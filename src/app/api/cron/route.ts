import { NextResponse } from 'next/server';
import {
  fetchHnStoryIdsByType,
  fetchHnStoriesByIds,
  FetchHnStoryType,
} from '@/lib/hn';
import { isValidCronRequest, processStory } from './cron.helpers';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // timeout 5 minutes

export async function GET(req: Request) {
  if (!isValidCronRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const results = [];
  const errors = [];

  try {
    const types = [
      'new',
      'top',
      'best',
      'ask',
      'show',
      'job',
    ] as FetchHnStoryType[];

    for (const type of types) {
      try {
        console.log(`Fetching articles of type ${type}...`);
        const storyIds = await fetchHnStoryIdsByType(type);
        const stories = await fetchHnStoriesByIds(storyIds.slice(0, 10));

        // Process articles in parallel, but limit the number of concurrent tasks
        const batchSize = 3;
        for (let i = 0; i < stories.length; i += batchSize) {
          const batch = stories.slice(i, i + batchSize);
          const processedStories = await Promise.all(
            batch.map((story) => processStory(story, type))
          );

          results.push(...processedStories.filter(Boolean));
        }
      } catch (error) {
        console.error(
          `Error occurred while processing articles of type ${type}:`,
          error
        );
        errors.push({ type, error: String(error) });
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    return NextResponse.json({
      success: true,
      message: `Scheduled task completed (${duration.toFixed(
        1
      )} seconds): Successfully fetched ${results.length} articles`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: String(error),
        results,
        errors,
      },
      { status: 500 }
    );
  }
}
