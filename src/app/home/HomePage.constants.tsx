import { type StoryType } from '@/lib/db/db';
import {
  Flame,
  Clock,
  Trophy,
  HelpCircle,
  Layout,
  Briefcase,
} from 'lucide-react';

export const CATEGORIES: Array<{
  value: StoryType;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'top',
    label: 'Top 24 hours',
    icon: <Flame className="w-4 h-4" />,
  },
  { value: 'new', label: 'Latest', icon: <Clock className="w-4 h-4" /> },
  { value: 'best', label: 'Best', icon: <Trophy className="w-4 h-4" /> },
  { value: 'ask', label: 'Ask', icon: <HelpCircle className="w-4 h-4" /> },
  { value: 'show', label: 'Show', icon: <Layout className="w-4 h-4" /> },
  { value: 'job', label: 'Job', icon: <Briefcase className="w-4 h-4" /> },
];
