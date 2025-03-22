import { queryStoriesFromDB, StoryType } from '@/lib/db';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import pluralize from 'pluralize';
import { isValidStoryType } from './CategoryPage.helpers';
import { TYPE_MAP } from './CategoryPage.constants';
import styles from './CategoryPage.module.css';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { type: StoryType };
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 20;
  const type = isValidStoryType(params.type) ? params.type : 'top';

  try {
    const { stories, totalPages } = await queryStoriesFromDB(
      type,
      page,
      pageSize
    );

    // If the requested page number exceeds the range, redirect to the first page
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

    // Calculate pagination range
    const maxDisplayPages = 5;
    const startPage = Math.max(1, page - Math.floor(maxDisplayPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayPages - 1);

    return (
      <main className="container mx-auto max-w-4xl px-4 pt-24 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <h1 className="text-3xl font-bold">{TYPE_MAP[type]}</h1>
        </div>

        <div className="space-y-6">
          {stories.map((story: Story) => (
            <article
              key={story.id}
              className="bg-white/50 rounded-2xl border p-6 shadow-sm"
            >
              <div className="flex items-start gap-2">
                {story.url ? (
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium hover:text-blue-600 flex items-center gap-1 flex-1"
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
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-blue-500"></span>
                  <span>
                    {story.score} {pluralize('point', story.score)}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-green-500"></span>
                  <span>
                    by <span className="font-medium">{story.by}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-1 h-1 rounded-full bg-purple-500"></span>
                  <span>
                    {formatDistanceToNowStrict(story.time, {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </span>
                </span>
              </div>
              {story.text && (
                <div
                  className={`mt-3 text-sm text-gray-700 ${styles.categoryPageHtmlRenderer}`}
                  dangerouslySetInnerHTML={{ __html: story.text }}
                ></div>
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
