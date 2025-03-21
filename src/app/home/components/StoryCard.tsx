import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight } from 'lucide-react';
import { StoryCardProps } from './StoryCard.types';
import pluralize from 'pluralize';

export function StoryCard({ title, type, stories, icon }: StoryCardProps) {
  return (
    <div className="backdrop-blur-md bg-white/30 rounded-3xl overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-white/50 to-white/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-gray-600">{icon}</div>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          </div>
          <Link
            href={`/category/${type}`}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1"
          >
            View More <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
      <div className="divide-y divide-gray-100/30">
        {stories.map((story) => (
          <article
            key={story.id}
            className="p-4 hover:bg-white/40 transition-colors duration-200"
          >
            <div className="flex items-start gap-2">
              {story.url ? (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 flex-1"
                >
                  {story.title}
                  <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                </a>
              ) : (
                <Link
                  href={`/item/${story.id}`}
                  className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 flex-1"
                >
                  {story.title}
                </Link>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-blue-500"></span>
                {story.score} {pluralize('point', story.score)}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-green-500"></span>
                {story.by}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-purple-500"></span>
                {formatDistanceToNowStrict(story.time, {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
