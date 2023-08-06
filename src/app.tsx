import { useEffect, useState } from 'preact/hooks';

import { mastodon } from 'masto';
import { useSnapshot } from 'valtio';

import FeedPost from './components/FeedPost';
import PostEditor from './components/PostEditor';
import LoginPage from './pages/LoginPage';
import { authStore } from './stores/auth';
import { checkAuthState, logout, processAuthorizationCode } from './utils/auth';
import { getFeed } from './utils/feed';
import logger from './utils/logger';
import statusToPost from './utils/status-parser';

// Always import default theme (to avoid "blinking")
import './themes/aves/theme.scss';

// TODO: save instance data to somewhere, for max character length
export function App() {
  const [applicationState, setApplicationState] = useState<'loading' | 'ready'>(
    'loading',
  );
  const snapshot = useSnapshot(authStore);
  const [feed, setFeed] = useState<mastodon.v1.Status[] | null>(null);
  const [theme] = useState('aves');

  useEffect(() => {
    document.body.dataset.theme = theme;

    if (theme === 'aves') return; // Default theme is already imported
    import(`./themes/${theme}/theme.scss`); // Dynamically import new theme
  }, [theme]);

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

      setApplicationState('ready');
    })();
  }, []);

  return (
    <div className="tusked-app">
      <div className="columns">
        <aside className="column navbar left-navbar">
          <div className="navbar-inner">
            <h1>
              Tusked <sup>pre-alpha</sup>
            </h1>
            {snapshot.loggedIn && (
              <>
                <p>You are logged in as @{snapshot.account?.acct}</p>
                <button className="temp-logout-button" onClick={() => logout()}>
                  Logout
                </button>
              </>
            )}
          </div>
        </aside>
        <main className="column main-content">
          {applicationState === 'loading' ? (
            <div className="temp-loading-class">
              <p>Loading...</p>
            </div>
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
                      return <FeedPost post={statusToPost(status)} />;
                    })}
                  </div>
                </div>
              ) : (
                <LoginPage />
              )}
            </div>
          )}
        </main>
        <aside className="column navbar right-navbar">
          <div className="navbar-inner"></div>
        </aside>
      </div>
    </div>
  );
}
