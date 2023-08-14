import { useEffect, useState } from 'preact/hooks';

import instancesListURL from '../data/instances.json?url';
import { OAuthState, prepareLoginURL } from '../utils/auth';
import logger from '../utils/logger';
import { localStore } from '../utils/store';

const URL_REGEX =
  /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/;

export default function LoginPage() {
  const [instancesList, setInstancesList] = useState([]);
  const [instanceHost, setInstanceHost] = useState(
    localStore.get<OAuthState>('oauth')?.instanceHost ?? '',
  ); // TODO: set to some config
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // TODO: better error handling

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(instancesListURL);
        const data = await res.json();
        setInstancesList(data);
      } catch (e) {
        // Silently fail
        logger.error(e);
      }
    })();
  }, []);

  return (
    <div className="login-container">
      <h2>
        Tusked <sup>pre-alpha</sup>
      </h2>
      <p>Welcome! Please enter your instance URL (Mastodon server)</p>
      <div className="instance-input-container">
        <div className="instance-input">
          <span className="input-prefix">https://</span>
          <input
            type="string"
            list="instances"
            inputMode="url"
            autoCapitalize={'none'}
            spellCheck={false}
            autoCorrect={'off'}
            autoComplete={'off'}
            defaultValue={instanceHost}
            onChange={(e) => setInstanceHost(e.currentTarget.value)}
            placeholder="mastodon.social"
          />

          <datalist id="instances">
            {instancesList.map((instance) => (
              <option value={instance} key={instance}>
                {instance}
              </option>
            ))}
          </datalist>
        </div>
      </div>
      <span className="login-error">{error}</span>

      <button
        className="login-button"
        disabled={loading || URL_REGEX.test(instanceHost) === false}
        onClick={async () => {
          setLoading(true);
          setError('');
          try {
            const url = await prepareLoginURL({ instanceHost });
            window.location.replace(url);
          } catch (e) {
            setError('Could not connect to Mastodon server');
          }
          setLoading(false);
        }}
      >
        Login
      </button>
      <div className="github-container">
        <a href="https://github.com/raikasdev/tusked">
          <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-brand-github"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
          </svg>
          <span>View source code on GitHub</span>
        </a>
      </div>
    </div>
  );
}
