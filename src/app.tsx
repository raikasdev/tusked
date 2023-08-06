import { useState, useEffect } from 'preact/hooks'
import { checkAuthState, prepareLoginURL, processAuthorizationCode } from './utils/auth';
import { useSnapshot } from 'valtio';
import { authStore } from './stores/auth';
import logger from './utils/logger';
import { mastodon } from 'masto';
import { getFeed } from './utils/feed';

export function App() {
  const [applicationState, setApplicationState] = useState<'loading' | 'ready'>('loading');
  const snapshot = useSnapshot(authStore);
  const [url, setUrl] = useState('');
  const [feed, setFeed] = useState<mastodon.v1.Status[] | null>(null);

  useEffect(() => {
    const { search } = typeof window.location === 'string' ? new URL(window.location) : window.location;
    const params = new URLSearchParams(search);

    (async () => {
      const authState = await checkAuthState();
      
      async function loadFeed() {
        setFeed(await getFeed());
        setApplicationState('ready');
      }

      if (authState) {
        return await loadFeed();
      }

      if (params.has('code')) {
        // TODO: way to show user an error
        try {
          await processAuthorizationCode({ code: params.get('code')! });

          // TODO: replace with (p)react-router
          history.pushState(null, document.title, '/');

          return await loadFeed();
        } catch (e) {
          logger.error('Getting code from query failed due to ', e);
        }
      }

      setUrl(await prepareLoginURL({ instanceHost: 'mementomori.social' }));
      setApplicationState('ready');
    })();
  }, []);

  return (
    <>
      <h1>Tusked</h1>
      {
        applicationState === 'loading'
          ? <p>Loading...</p>
          : <div class="card">
              <p>Is logged in: {snapshot.loggedIn ? 'yes' : 'no'}</p>
              {
                snapshot.loggedIn
                  ? <>
                      <p>You are logged in as @{snapshot.account?.acct}</p>
                      {feed?.map((status) => {
                        console.log(status);
                        return (
                        <p>{status.account.acct}: {status.content}</p>
                      )})}
                    </>
                  : <a href={url}>
                      Login
                    </a>
              }
            </div>
      }
    </>
  )
}
