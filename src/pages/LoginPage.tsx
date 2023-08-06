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
    </div>
  );
}
