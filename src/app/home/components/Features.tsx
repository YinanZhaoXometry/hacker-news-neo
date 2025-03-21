import { Sparkles, Globe, Zap, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Popular Content',
    description:
      'Curated popular HackerNews content, allowing you to easily stay updated with global tech trends.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Updates',
    description:
      'Automatically syncs the latest HackerNews content hourly, ensuring you always have the most up-to-date information.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Diverse Content Types',
    description:
      'Includes popular articles posted in 24 hours, latest news and more, catering to various reading preferences.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Article Quality',
    description: 'High-quality content with an excellent reading experience.',
  },
];

export function Features() {
  return (
    <section className="py-16 bg-gradient-to-b from-white/50 to-white/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Use HackerNews?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing users with the highest quality
            HackerNews content, allowing you to easily stay updated with the
            latest trends in the global tech community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
