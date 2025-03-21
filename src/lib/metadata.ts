import { Metadata } from 'next';

const title = 'Neo HackerNews';
const description =
  'Real-time updated of HackerNews - Latest tech news and discussions';

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`,
  },
  description,
  keywords: [
    'Neo HackerNews',
    'Neo',
    'Tech News',
    'Developer',
    'Software Engineer',
  ],
  authors: [
    {
      name: 'Yinan Zhao',
      url: 'https://github.com/YinanZhaoXometry',
    },
  ],
  creator: 'viggo',
  openGraph: {
    type: 'website',
    locale: 'us_EN',
    url: 'https://hn.yinanzhao.com',
    title,
    description,
    siteName: title,
  },
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://hn.yinanzhao.com'),
};
