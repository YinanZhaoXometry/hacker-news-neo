import { getStoryTagByFetchStoryType } from '@/app/category/[type]/CategoryPage.helpers';
import { createStoryInDB, queryStoryFromDB, updateStoryInDB } from '@/lib/db';
import { FetchHnStoryType, HNItem } from '@/lib/hn';

interface ProcessedStory {
  id: number;
  type: DBStory['type'];
  title: string;
}

interface DBStory {
  id: number;
  title: string;
  type: 'story' | 'job';
}

export async function processStory(
  story: HNItem,
  type: FetchHnStoryType
): Promise<ProcessedStory | null> {
  if (!story) return null;

  try {
    const storyFromDB = await queryStoryFromDB(story.id);
    const storyTag = getStoryTagByFetchStoryType(type);
    const dbType = mapHNTypeToDBType(type);

    if (storyFromDB && storyFromDB.tags.includes(storyTag)) {
      console.log(`Story existed: ${story.id}`);
      return null;
    }

    console.log(`Processing story: ${story.id} (${type})`);

    if (storyFromDB && !storyFromDB.tags.includes(storyTag)) {
      console.log(`Story existed but need update: ${story.id}`);
      const updatedStory = (await updateStoryInDB({ ...story, type: dbType }, [
        ...storyFromDB.tags,
        storyTag,
      ])) as DBStory;

      console.log(`Story updated: ${story.id} (类型: ${dbType})`);

      return {
        type: dbType,
        id: updatedStory.id,
        title: updatedStory.title,
      };
    }

    const savedStory = (await createStoryInDB(
      {
        ...story,
        type: dbType,
      },
      [storyTag]
    )) as DBStory;

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
function mapHNTypeToDBType(hnType: string): DBStory['type'] {
  switch (hnType) {
    case 'ask':
      return 'story';
    case 'show':
      return 'story';
    case 'new':
      return 'story';
    case 'top':
      return 'story';
    case 'job':
      return 'job';
    default:
      return 'story';
  }
}
