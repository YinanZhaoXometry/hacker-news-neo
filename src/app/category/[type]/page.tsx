import { getStories, type StoryType } from '@/lib/db';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import pluralize from 'pluralize';

export const dynamic = 'force-dynamic';

interface Story {
  id: number;
  title: string;
  url: string | null;
  text: string | null;
  by: string;
  score: number;
  time: Date;
}

const typeMap: Record<StoryType, string> = {
  top: 'Top 24 hours',
  new: 'Latest',
  best: 'Best',
  ask: 'Ask',
  show: 'Show',
  job: 'Jobs',
};

function isValidStoryType(type: string): type is StoryType {
  return type in typeMap;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { type: string };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 20;
  const type = isValidStoryType(params.type) ? params.type : 'top';

  try {
    const { stories, totalPages } = await getStories(type, page, pageSize);

    // 如果请求的页码超出范围，重定向到第一页
    if (page > totalPages && totalPages > 0) {
      return {
        redirect: {
          destination: `/category/${params.type}?page=1`,
          permanent: false,
        },
      };
    }

    if (!stories || stories.length === 0) {
      return (
        <main className="container mx-auto max-w-7xl px-4 pt-24 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Data Available
            </h1>
            <p className="text-gray-600">
              There are currently no articles in this category. Please try again
              later.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Home Page
            </Link>
          </div>
        </main>
      );
    }

    // 计算分页范围
    const maxDisplayPages = 5;
    const startPage = Math.max(1, page - Math.floor(maxDisplayPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);

    return (
      <main className="container mx-auto max-w-7xl px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="text-3xl font-bold">{typeMap[type]}</h1>
        </div>

        <div className="space-y-6">
          {stories.map((story: Story) => (
            <article
              key={story.id}
              className="bg-white/50 rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex items-start gap-2">
                {story.url ? (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md font-medium hover:text-blue-600 flex items-center gap-1 flex-1"
                  >
                    {story.title}
                    <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                  </a>
                ) : (
                  <Link
                    href={`/item/${story.id}`}
                    className="text-lg font-medium hover:text-blue-600 flex-1"
                  >
                    {story.title}
                  </Link>
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
              {story.text && (
                <div className="mt-3 text-sm text-gray-700">{story.text}</div>
              )}
            </article>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <a
              href={`/category/${params.type}?page=${page - 1}`}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Previous Page
            </a>
          )}

          {page > 2 && (
            <a
              href={`/category/${params.type}?page=1`}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              1
            </a>
          )}

          {page > 3 && <span className="px-2">...</span>}

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((p) => (
            <a
              key={p}
              href={`/category/${params.type}?page=${p}`}
              className={`px-4 py-2 rounded-lg border ${
                p === page
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              {p}
            </a>
          ))}

          {page < totalPages - 2 && <span className="px-2">...</span>}

          {page < totalPages - 1 && (
            <a
              href={`/category/${params.type}?page=${totalPages}`}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              {totalPages}
            </a>
          )}

          {page < totalPages && (
            <a
              href={`/category/${params.type}?page=${page + 1}`}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Next Page
            </a>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Loading Category page failed:', error);
    return (
      <main className="container mx-auto max-w-7xl px-4 pt-24 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600">
            An error occurred while loading the data. Please refresh the page
            and try again.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Home Page
          </Link>
        </div>
      </main>
    );
  }
}
