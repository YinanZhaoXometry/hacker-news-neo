import { StoryType } from '@/lib/db';

export const TYPE_MAP: Record<StoryType, string> = {
  top: 'Top 24 hours',
  new: 'Latest',
  best: 'Best',
  ask: 'Ask',
  show: 'Show',
  job: 'Jobs',
};
