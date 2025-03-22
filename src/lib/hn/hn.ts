import { fetchWithRetry } from './hn.helpers';
import { FetchHnStoryType, HNItem, HNUser } from './hn.types';

// Fetch story IDs by type (top, new, best, etc.)
export async function fetchHnStoryIdsByType(
  type: FetchHnStoryType
): Promise<number[]> {
  const stories = await fetchWithRetry<number[]>(`/${type}stories.json`);
  return stories || [];
}

// Fetch multiple stories by their IDs
export async function fetchHnStoriesByIds(ids: number[]): Promise<HNItem[]> {
  const stories = await Promise.all(ids.map((id) => fetchHnItemById(id)));
  return stories.filter((story): story is HNItem => story !== null);
}

export async function fetchHnUser(id: string): Promise<HNUser | null> {
  return fetchWithRetry<HNUser>(`/user/${id}.json`);
}

// Batch retrieve comments
export async function fetchHnComments(ids: number[]): Promise<HNItem[]> {
  const comments = await Promise.all(ids.map((id) => fetchHnItemById(id)));
  return comments.filter(
    (comment): comment is HNItem =>
      comment !== null && comment.type === 'comment'
  );
}

// Fetch a single item by ID
async function fetchHnItemById(id: number): Promise<HNItem | null> {
  return fetchWithRetry<HNItem>(`/item/${id}.json`);
}
