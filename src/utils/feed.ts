import { apiClient } from './auth';

export async function getFeed() {
  if (!apiClient) throw new Error('Not logged in');

  return await apiClient.v1.timelines.home.list();
}
