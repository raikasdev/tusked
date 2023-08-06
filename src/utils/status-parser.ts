import type { mastodon } from 'masto';

import { authStore } from '../stores/auth';
import type { Post, TinyProfile } from '../types';
import logger from './logger';

// From Mastopoet, probably should be made more sturdy
export default function statusToPost(status: mastodon.v1.Status): Post {
  const author = status.reblog?.account ?? status.account;
  const actualStatus = status.reblog ?? status;

  // Emoji replacer (quality code 100%)
  let content = actualStatus.content;

  actualStatus.emojis.forEach((emoji: { url: string; shortcode: string }) => {
    content = content.replaceAll(
      `:${emoji.shortcode}:`,
      `<img class="emoji" alt="Emoji called ${emoji.shortcode}" src="${emoji.url}" />`,
    );
  });

  return {
    status, // As fallback
    author: accountToTinyProfile(author),
    content,
    date: new Date(status.createdAt),
    boosts: status.reblogsCount,
    comments: status.repliesCount,
    favourites: status.favouritesCount,
    boosted: status.reblogged === true,
    favourited: status.favourited === true,
    boostedBy: status.reblog ? accountToTinyProfile(status.account) : undefined,
  };
}

export function accountToTinyProfile(
  account: mastodon.v1.Account,
): TinyProfile {
  let username = account.acct;

  if (!username.includes('@')) {
    logger.debug('Local username, looking up username from WebFinger...');

    username = `${username}@${authStore.instance?.uri}`;
  }

  username = `@${username}`;

  let displayName =
    account.displayName === '' ? account.username : account.displayName;

  account.emojis.forEach((emoji: { url: string; shortcode: string }) => {
    displayName = displayName.replaceAll(
      `:${emoji.shortcode}:`,
      `<img class="emoji" alt="Emoji called ${emoji.shortcode}" src="${emoji.url}" />`,
    );
  });

  return {
    displayName,
    username,
    avatarURL: account.avatar,
  };
}
