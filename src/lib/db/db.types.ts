import { Tag } from '@prisma/client';

export type StoryTag = Tag;

export type OrderBy = {
  score?: 'asc' | 'desc';
  time?: 'asc' | 'desc';
}[];
