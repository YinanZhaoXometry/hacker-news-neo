import { fetchWithRetry } from './hn.helpers';
import { HNItem, HNUser } from './hn.types';

// Fetch story IDs by type (top, new, best, etc.)
export async function fetchHnStories(type: string): Promise<number[]> {
  const stories = await fetchWithRetry<number[]>(`/${type}stories.json`);
  return stories || [];
}

// Fetch a single item by ID
async function fetchHnItem(id: number): Promise<HNItem | null> {
  return fetchWithRetry<HNItem>(`/item/${id}.json`);
}

// Fetch multiple stories by their IDs
export async function fetchHnMultipleStories(ids: number[]): Promise<HNItem[]> {
  const stories = await Promise.all(ids.map((id) => fetchHnItem(id)));
  return stories.filter((story): story is HNItem => story !== null);
}

export async function fetchHnUser(id: string): Promise<HNUser | null> {
  return fetchWithRetry<HNUser>(`/user/${id}.json`);
}

// Batch retrieve comments
export async function fetchHnComments(ids: number[]): Promise<HNItem[]> {
  const comments = await Promise.all(ids.map((id) => fetchHnItem(id)));
  return comments.filter(
    (comment): comment is HNItem =>
      comment !== null && comment.type === 'comment'
  );
}
