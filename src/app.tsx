import { useEffect, useState } from 'preact/hooks';

import { mastodon } from 'masto';
import { useSnapshot } from 'valtio';

import PostEditor from './components/PostEditor';
import { authStore } from './stores/auth';
import {
  checkAuthState,
  prepareLoginURL,
  processAuthorizationCode,
} from './utils/auth';
import { getFeed } from './utils/feed';
import logger from './utils/logger';

// Always import default theme (to avoid "blinking")
import './themes/aves/theme.scss';

// TODO: save instance data to somewhere, for max character length
export function App() {
  const [applicationState, setApplicationState] = useState<'loading' | 'ready'>(
    'loading',
  );
  const snapshot = useSnapshot(authStore);
  const [url, setUrl] = useState('');
  const [feed, setFeed] = useState<mastodon.v1.Status[] | null>(null);
  const [theme, setTheme] = useState('aves');

  useEffect(() => {
    document.body.dataset.theme = theme;

    if (theme === 'aves') return; // Default theme is already imported
    import(`./themes/${theme}/theme.scss`); // Dynamically import new theme
  }, [theme]);

  console.log(snapshot);

  useEffect(() => {
    const { search } =
      typeof window.location === 'string'
        ? new URL(window.location)
        : window.location;
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
    <div className="tusked-app">
      <div className="columns">
        <aside className="column navbar left-navbar"></aside>
        <main className="column main-content">
          {applicationState === 'loading' ? (
            <p>Loading...</p>
          ) : (
            <div class="card">
              {snapshot.loggedIn ? (
                <div>
                  <PostEditor
                    maxLength={
                      snapshot?.instance?.configuration.statuses
                        .maxCharacters || 500
                    }
                  />
                  <div className="post-feed">
                    {feed?.map((status) => {
                      return (
                        <div className="post">
                          <b>
                            {status.account.acct}{' '}
                            {status.reblog && (
                              <>
                                <br />
                                boosted a post by @{status.reblog.account.acct}
                              </>
                            )}
                            :
                          </b>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: status.reblog?.content || status.content,
                            }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                  <p>Is logged in: {snapshot.loggedIn ? 'yes' : 'no'}</p>
                  <p>You are logged in as @{snapshot.account?.acct}</p>
                  <button onClick={() => setTheme('aves')}>Aves</button>
                  <button onClick={() => setTheme('aves-light')}>
                    Aves Light
                  </button>
                </div>
              ) : (
                <div className="login-container">
                  <h1>
                    Tusked <sup>pre-alpha</sup>
                  </h1>
                  <p>Welcome! Login using mementomori.social</p>
                  <button
                    className="button-round-large"
                    onClick={() => {
                      window.location.replace(url);
                    }}
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
        <aside className="column navbar right-navbar"></aside>
      </div>
    </div>
  );
}
