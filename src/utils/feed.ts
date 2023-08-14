import { apiClient } from './auth';

export function getFeedPaginator() {
  if (!apiClient) throw new Error('Not logged in');

  const paginator = apiClient.v1.timelines.home.list({});

  return paginator;
}

export async function getLatestPosts() {
  if (!apiClient) throw new Error('Not logged in');

  return await apiClient.v1.timelines.home.list({});
}
