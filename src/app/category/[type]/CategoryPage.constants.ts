import { StoryTag } from '@/lib/db';
import { Tag } from '@prisma/client';

export const STORY_TAG_TO_NAME_MAP: Record<StoryTag, string> = {
  [Tag.TOP]: 'Top 24 hours',
  [Tag.NEW]: 'Latest',
  [Tag.BEST]: 'Best',
  [Tag.ASK]: 'Ask',
  [Tag.SHOW]: 'Show',
  [Tag.JOB]: 'Jobs',
};
