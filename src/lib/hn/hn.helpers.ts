import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

export async function fetchWithRetry<T>(
  url: string,
  retries = MAX_RETRIES
): Promise<T | null> {
  try {
    const response = await instance.get<T>(url);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry<T>(url, retries - 1);
    }
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}
