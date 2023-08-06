// Used for local auth state (not persistent)
import { mastodon } from 'masto';
import { proxy } from 'valtio';

type AuthState = {
  loggedIn: boolean;
  accessToken?: string;
  account?: mastodon.v1.Account;
  instance?: mastodon.v1.Instance;
};

export const authStore = proxy<AuthState>({
  loggedIn: false,
});
