import type { mastodon } from 'masto';

/**
 * A post, with all the information necessary to display it
 */
interface Post {
  status: mastodon.v1.Status;
  id: string;

  author: TinyProfile;

  content: string;
  attachments: mastodon.v1.MediaAttachment[];
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
  shortUsername: string; // @username even on remotes
  displayName: string;
  avatarURL: string;
}

/**
 * PostEditor text object
 */
export interface PostEditorPart {
  type: 'text' | 'mention' | 'link' | 'hashtag' | 'emoji' | 'newline';

  value: string; // text or emoji name
}
