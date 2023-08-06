import type { mastodon } from 'masto';

/**
 * A post, with all the information necessary to display it
 */
interface Post {
  status: mastodon.v1.Status;

  author: TinyProfile;

  content: string;
  date: Date;

  favourites: number;
  boosts: number;
  comments: number;

  boosted: boolean;
  favourited: boolean;

  boostedBy?: TinyProfile;
}

/**
 * Simple user profile with only basic information necessary to display user
 */
interface TinyProfile {
  username: string;
  displayName: string;
  avatarURL: string;
}
