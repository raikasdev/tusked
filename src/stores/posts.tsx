// Used for caching posts
import { proxy } from 'valtio';

import { Post } from '../types';

export type PostsState = {
  posts: Map<string, Post>;
  feed: Post[]; // Maybe add a type for a feed if necessary. All posts aren't in the feed.
};

export const postsStore = proxy<PostsState>({
  posts: new Map(),
  feed: [],
});
