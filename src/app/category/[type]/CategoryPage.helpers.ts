import { STORY_TAG_TO_NAME_MAP } from './CategoryPage.constants';
import { FetchHnStoryType } from '@/lib/hn';
import { Tag } from '@prisma/client';

export function getStoryTagByFetchStoryType(type: FetchHnStoryType): Tag {
  const isValid = Object.keys(STORY_TAG_TO_NAME_MAP).includes(
    type.toUpperCase()
  );

  if (!isValid) {
    return Tag.TOP;
  }

  switch (type) {
    case 'top':
      return Tag.TOP;
    case 'best':
      return Tag.BEST;
    case 'new':
      return Tag.NEW;
    case 'ask':
      return Tag.ASK;
    case 'show':
      return Tag.SHOW;
    case 'job':
      return Tag.JOB;
    default:
      return Tag.TOP;
  }
}
