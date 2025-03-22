import { queryStoryExistsFromDB, createStoryInDB, StoryType } from '@/lib/db';
import { HNItem } from '@/lib/hn';

interface ProcessedStory {
  id: number;
  type: StoryType;
  title: string;
}

interface DBStory {
  id: number;
  title: string;
  type: 'story' | 'job';
}

export async function processStory(
  story: HNItem,
  type: string
): Promise<ProcessedStory | null> {
  if (!story) return null;

  try {
    const exists = await queryStoryExistsFromDB(story.id);
    if (exists) {
      console.log(`Story existed: ${story.id}`);
      return null;
    }

    console.log(`Processing story: ${story.id} (${type})`);

    const dbType = mapHNTypeToDBType(type);
    const savedStory = (await createStoryInDB({
      ...story,
      type: dbType,
    })) as DBStory;

    console.log(`Story processed: ${story.id} (类型: ${dbType})`);

    return {
      id: savedStory.id,
      type: dbType,
      title: savedStory.title,
    };
  } catch (error) {
    console.error(`Story processed with error ${story.id}:`, error);
    return null;
  }
}

export function isValidCronRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }
  return true;
}

// Map HN types to database types
function mapHNTypeToDBType(hnType: string): StoryType {
  switch (hnType) {
    case 'ask':
      return 'ask';
    case 'show':
      return 'show';
    case 'new':
      return 'new';
    case 'top':
      return 'top';
    case 'job':
      return 'job';
    default:
      return 'top';
  }
}
