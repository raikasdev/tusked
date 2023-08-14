// This is used to get feed posts, add new ones from streaming API and for fetching more
// cache!
// Streaming API doesn't work on my instance, so things are manually fetched for now.
import { useEffect, useState } from 'preact/hooks';

import { mastodon } from 'masto';
import { useSnapshot } from 'valtio';

import { PostsState, postsStore } from '../stores/posts';
import { Post } from '../types';
import { streamingClient } from '../utils/auth';
import { getFeedPaginator, getLatestPosts } from '../utils/feed';
import logger from '../utils/logger';
import statusToPost from '../utils/status-parser';

interface UseFeed {
  posts: Post[];
  loadMore: () => Promise<void>; // load old
  refresh: () => Promise<void>; // load new
  loading: boolean; // loadMore()
  refreshing: boolean; // refresh()
}

export default function useFeed(): UseFeed {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { posts, feed } = useSnapshot(postsStore) as PostsState;
  const [paginator] = useState<
    mastodon.Paginator<
      mastodon.v1.Status[],
      mastodon.rest.v1.ListTimelineParams
    >
  >(getFeedPaginator());

  useEffect(() => {
    loadMore();

    if (!streamingClient) return;

    (async () => {
      for await (const event of streamingClient.user.subscribe()) {
        console.log('user', event);
      }
      for await (const event of streamingClient.public.subscribe()) {
        console.log('public', event);
      }
    })();
  }, []);

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    const newStatuses = await getLatestPosts();
    setRefreshing(false);
    newStatuses.reverse().forEach((status) => {
      const post = statusToPost(status);
      if (posts.has(post.id)) return;
      posts.set(post.id, post);
      if (postsStore.feed.find((i) => i.id === post.id)) return;
      postsStore.feed.unshift(post);
    });
  };

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const statusResult = await paginator.next();
    setLoading(false);
    const statuses: mastodon.v1.Status[] | undefined = statusResult.value;
    if (statuses) {
      statuses.forEach((status) => {
        const post = statusToPost(status);
        if (posts.has(post.id)) return;
        posts.set(post.id, post);
        if (postsStore.feed.find((i) => i.id === post.id)) return;
        postsStore.feed.push(post);
      });

      postsStore.posts = new Map(posts); // Valtio doesn't detect Map changes
      return;
    }
    logger.error('Loading more failed', statusResult);
    // TODO: add better error
  };

  return { posts: feed, loadMore, refresh, loading, refreshing };
}
