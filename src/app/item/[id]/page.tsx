import { notFound } from 'next/navigation';
import { getStory } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight } from 'lucide-react';
import pluralize from 'pluralize';

interface Story {
  id: number;
  title: string;
  titleZh: string | null;
  url: string | null;
  text: string | null;
  textZh: string | null;
  by: string;
  score: number;
  time: Date;
}

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 每小时重新验证一次

export default async function StoryPage({ params }: PageProps) {
  const story = (await getStory(parseInt(params.id, 10))) as Story;

  if (!story) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {story.url ? (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-bold hover:underline flex items-center gap-1"
                >
                  {story.titleZh || story.title}
                  <ArrowUpRight className="w-6 h-6" />
                </a>
              ) : (
                <h1 className="text-2xl font-bold">
                  {story.titleZh || story.title}
                </h1>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>
                {story.score} {pluralize('point', story.score)}
              </span>
              <span className="mx-2">•</span>
              <span>Author: {story.by}</span>
              <span className="mx-2">•</span>
              <span>
                {formatDistanceToNow(story.time, {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
