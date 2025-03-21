import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight } from 'lucide-react';
import pluralize from 'pluralize';

interface StoryListProps {
  stories: Story[];
  type: string;
  currentPage: number;
}

export default function StoryList({
  stories,
  type,
  currentPage,
}: StoryListProps) {
  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <article key={story.id} className="p-4 rounded-lg border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {story.url ? (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium hover:underline flex items-center gap-1"
                  >
                    {story.title}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    href={`/item/${story.id}`}
                    className="text-lg font-medium hover:underline"
                  >
                    {story.title}
                  </Link>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <span>
                  {story.score} {pluralize('point', story.score)}
                </span>
                <span className="mx-2">•</span>
                <span>by {story.by}</span>
                <span className="mx-2">•</span>
                <span>
                  {formatDistanceToNowStrict(story.time, {
                    addSuffix: true,
                    locale: enUS,
                  })}
                </span>
              </div>
            </div>
          </div>
          {story.text && (
            <div className="mt-2 text-sm text-gray-700">{story.text}</div>
          )}
        </article>
      ))}

      <div className="flex justify-between items-center mt-6">
        <Link
          href={`/?type=${type}&page=${Math.max(1, currentPage - 1)}`}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-50'
          }`}
        >
          Previous Page
        </Link>
        <span className="text-sm text-gray-500">第 {currentPage} 页</span>
        <Link
          href={`/?type=${type}&page=${currentPage + 1}`}
          className="px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          Next Page
        </Link>
      </div>
    </div>
  );
}
