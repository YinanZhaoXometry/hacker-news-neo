import { StoryType } from '@/lib/db/db';
import { TYPE_MAP } from './CategoryPage.constants';

export function isValidStoryType(type: string): type is StoryType {
  return type in TYPE_MAP;
}
