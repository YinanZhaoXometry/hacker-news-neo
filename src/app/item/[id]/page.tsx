import { notFound } from 'next/navigation';
import { getStory } from '@/lib/db';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight } from 'lucide-react';
import pluralize from 'pluralize';

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
                  {story.title}
                  <ArrowUpRight className="w-6 h-6" />
                </a>
              ) : (
                <h1 className="text-2xl font-bold">{story.title}</h1>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="mx-2 inline-block w-1 h-1 rounded-full bg-blue-500"></span>
                <span>
                  {story.score} {pluralize('point', story.score)}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="mx-2 inline-block w-1 h-1 rounded-full bg-green-500"></span>
                <span>by {story.by}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="mx-2 inline-block w-1 h-1 rounded-full bg-purple-500"></span>
                <span>
                  {formatDistanceToNowStrict(story.time, {
                    addSuffix: true,
                    locale: enUS,
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
