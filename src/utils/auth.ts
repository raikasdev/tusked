import { createRestAPIClient, createStreamingAPIClient, mastodon } from 'masto';

import { authStore } from '../stores/auth';
import logger from './logger';
import { localStore } from './store';

const {
  VITE_APPLICATION_NAME: APPLICATION_NAME,
  VITE_APPLICATION_WEBSITE: APPLICATION_WEBSITE,
} = import.meta.env;

export type OAuthState = {
  instanceHost: string;
  client_id: string;
  client_secret: string;
  access_token?: string;
};

interface ProppedInstanceUrl {
  instanceHost: string;
}

export let apiClient: mastodon.rest.Client | null = null;
export let streamingClient: mastodon.streaming.Client | null = null;

export async function prepareLoginURL({ instanceHost }: ProppedInstanceUrl) {
  let oauthState = localStore.get<OAuthState>('oauth');
  if (oauthState == null || oauthState.instanceHost !== instanceHost) {
    const { client_id, client_secret } = await registerApplication({
      instanceHost,
    });

    oauthState = {
      instanceHost,
      client_id,
      client_secret,
    };

    localStore.set<OAuthState>('oauth', oauthState);
  }

  return getAuthorizationURL({ instanceHost, client_id: oauthState.client_id });
}

export async function processAuthorizationCode({ code }: { code: string }) {
  const oauthState = localStore.get<OAuthState>('oauth');
  if (oauthState == null) throw new Error('No OAuth state found');

  const { client_id, client_secret, instanceHost } = oauthState;

  const { access_token } = await getAccessToken({
    instanceHost,
    client_id,
    client_secret,
    code,
  });

  if (!access_token) throw new Error('Invalid code');

  localStore.set<OAuthState>('oauth', {
    ...oauthState,
    access_token,
  });

  try {
    await initClient({
      instanceHost,
      access_token,
    });
  } catch (e) {
    throw new Error('Failed to access user profile');
  }
}

export function logout() {
  const oauthState = localStore.get<OAuthState>('oauth');
  if (oauthState == null) return;

  authStore.loggedIn = false;
  authStore.accessToken = undefined;
  authStore.account = undefined;
  apiClient = null;
  streamingClient = null;

  localStore.set<OAuthState>('oauth', {
    ...oauthState,
    access_token: undefined,
  });
}

/**
 * Used to check the auth state initially (to see if user is logged in)
 */
export async function checkAuthState() {
  const oauthState = localStore.get<OAuthState>('oauth');
  if (oauthState == null) return false;

  const { access_token, instanceHost } = oauthState;
  if (!access_token) return false;

  try {
    await initClient({
      instanceHost,
      access_token,
    });
  } catch (e) {
    return false;
  }
  return true;
}

// Internal functions for Auth

async function initClient({
  instanceHost,
  access_token,
}: ProppedInstanceUrl & { access_token: string }) {
  const client = createRestAPIClient({
    url: `https://${instanceHost}`,
    accessToken: access_token, // Can be null
    timeout: 30_000, // Unfortunatly this is global instead of per-request
  });

  try {
    const user = await client.v1.accounts.verifyCredentials();
    logger.debug('Logged in as', user);

    const instance = await client.v1.instance.fetch();
    logger.debug('Instance info', instance);

    apiClient = client;
    try {
      streamingClient = createStreamingAPIClient({
        streamingApiUrl: instance.urls.streamingApi,
        accessToken: access_token,
        implementation: window.WebSocket,
        retry: 1,
      });
    } catch (e) {
      logger.error('Connecting to Streaming API failed');
    }

    authStore.loggedIn = true;
    authStore.accessToken = access_token;

    authStore.account = user;
    authStore.instance = instance;
  } catch (e) {
    const oauthState = localStore.get<OAuthState>('oauth');
    if (!oauthState) throw new Error('Invalid access token');

    // TODO: Show error, redirect to login
    localStore.set<OAuthState>('oauth', {
      ...oauthState,
      access_token: undefined,
    });
    throw new Error('Invalid access token');
  }
}

async function registerApplication({ instanceHost }: ProppedInstanceUrl) {
  const registrationParams = new URLSearchParams({
    client_name: APPLICATION_NAME,
    redirect_uris: location.origin,
    scopes: 'read write follow',
    website: APPLICATION_WEBSITE,
  });

  const registrationResponse = await fetch(
    `https://${instanceHost}/api/v1/apps`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: registrationParams.toString(),
    },
  );

  const registrationJSON = await registrationResponse.json();
  logger.debug('Application registration response', { registrationJSON });

  return registrationJSON;
}

function getAuthorizationURL({
  instanceHost,
  client_id,
}: ProppedInstanceUrl & { client_id: string }) {
  const authorizationParams = new URLSearchParams({
    client_id,
    scope: 'read write follow',
    redirect_uri: location.origin,
    // redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
    response_type: 'code',
  });

  return `https://${instanceHost}/oauth/authorize?${authorizationParams.toString()}`;
}

type GetAccessTokenProps = ProppedInstanceUrl & {
  client_id: string;
  client_secret: string;
  code: string;
};

async function getAccessToken({
  instanceHost,
  client_id,
  client_secret,
  code,
}: GetAccessTokenProps) {
  const params = new URLSearchParams({
    client_id,
    client_secret,
    code,
    redirect_uri: location.origin,
    grant_type: 'authorization_code',
    scope: 'read write follow',
  });

  const tokenResponse = await fetch(`https://${instanceHost}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const tokenJSON = await tokenResponse.json();
  logger.debug('Access token acquired', { tokenJSON });

  return tokenJSON;
}
