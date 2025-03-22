import { Inter } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { metadata } from '@/lib/metadata';
import Script from 'next/script';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
         (function(c,l,a,r,i,t,y){
					c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
					t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
					y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    			})(window, document, "clarity", "script", "qs5kbi0m4v");
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
