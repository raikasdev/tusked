import { useEffect, useState } from 'preact/hooks';

import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

import Feed from '../components/Feed';
import PostEditor from '../components/editor/PostEditor';
import LoginPage from '../pages/LoginPage';
import { authStore } from '../stores/auth';
import {
  checkAuthState,
  logout,
  processAuthorizationCode,
} from '../utils/auth';
import logger from '../utils/logger';

export default function IndexPage() {
  const [applicationState, setApplicationState] = useState<'loading' | 'ready'>(
    'loading',
  );
  const snapshot = useSnapshot(authStore);
  const navigate = useNavigate();

  useEffect(() => {
    const { search } =
      typeof window.location === 'string'
        ? new URL(window.location)
        : window.location;
    const params = new URLSearchParams(search);

    (async () => {
      const authState = await checkAuthState();

      async function loadFeed() {
        setApplicationState('ready');
      }

      if (authState) {
        return await loadFeed();
      }

      if (params.has('code')) {
        // TODO: way to show user an error
        try {
          await processAuthorizationCode({ code: params.get('code')! });

          navigate('/');

          return await loadFeed();
        } catch (e) {
          logger.error('Getting code from query failed due to ', e);
        }
      }

      setApplicationState('ready');
    })();
  }, []);

  return (
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
                    snapshot?.instance?.configuration.statuses.maxCharacters ||
                    500
                  }
                />
                <Feed />
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
  );
}
