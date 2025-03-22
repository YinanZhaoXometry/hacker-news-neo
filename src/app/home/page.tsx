import { queryStoriesByTypesFromDB } from '@/lib/db';
import { Clock, Newspaper } from 'lucide-react';
import { CATEGORIES } from './HomePage.constants';
import { FAQ, Features, StoryCard } from './components';
import { getStoryTagByFetchStoryType } from '../category/[type]/CategoryPage.helpers';

export default async function HomePage() {
  const allStories = await queryStoriesByTypesFromDB(
    CATEGORIES.map((t) => getStoryTagByFetchStoryType(t.value))
  );

  return (
    <div className="min-h-screen">
      <section className="pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Newspaper className="w-16 h-16 text-blue-600/80" />
            </div>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HackerNews Neo
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              HackerNews Popular content, allowing you to easily stay updated
              with the latest trends in the tech world. Includes popular
              articles, the latest news and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                Automatically updated hourly
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((type, index) => (
              <StoryCard
                key={type.value}
                title={type.label}
                type={type.value}
                stories={allStories[index] || []}
                icon={type.icon}
              />
            ))}
          </div>
        </div>
      </div>

      <FAQ />
      <Features />
    </div>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 每小时重新验证一次
