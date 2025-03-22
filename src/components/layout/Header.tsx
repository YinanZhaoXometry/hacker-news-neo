'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, MenuIcon, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTestIsHomePage } from './Header.hooks';
import * as Popover from '@radix-ui/react-popover';
import styles from './Header.module.css';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = useTestIsHomePage();

  const [mobileNavMenuOpen, setMobileNavMenuOpen] = useState(false);

  const navItems = useMemo(() => {
    const list = [
      {
        href: '/category/top',
        label: 'Top 24 hours',
      },
      {
        href: '/category/new',
        label: 'Latest',
      },
      {
        href: '/category/best',
        label: 'Best',
      },
      {
        href: '/category/ask',
        label: 'Ask',
      },
      {
        href: '/category/show',
        label: 'Show',
      },
      {
        href: '/category/job',
        label: 'Jobs',
      },
    ] as Array<{ href: string; label: string }>;

    if (!isHomePage) {
      list.unshift({
        href: '/',
        label: 'Home',
      });
    }

    return list;
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'backdrop-blur-md bg-white/80' : ''
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="HackerNews中文版"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold">HackerNews Neo</span>
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((navItem, index) => (
                <Link
                  href={navItem.href}
                  className="hover:text-gray-600"
                  key={index}
                >
                  {navItem.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center">
              <a
                href="https://github.com/ViggoZ/hackernews-cn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100/70 hover:bg-gray-200/50 active:bg-gray-200/90 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>

            <Popover.Root
              modal={true}
              open={mobileNavMenuOpen}
              onOpenChange={setMobileNavMenuOpen}
            >
              <Popover.Trigger className="md:hidden">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100/50 hover:bg-gray-200/50 active:bg-gray-200/90 transition-colors duration-200"
                  aria-label="Update dimensions"
                >
                  <MenuIcon />
                </span>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content className={styles.Content}>
                  <Popover.Close className={styles.Close} aria-label="Close">
                    <X />
                  </Popover.Close>
                  <div className="flex flex-col rounded-sm">
                    {navItems.map((navItem, index) => (
                      <Link
                        href={navItem.href}
                        className={cn(
                          'hover:text-gray-600 text-center h-14 flex items-center justify-center',
                          styles.navItem
                        )}
                        onClick={() => setMobileNavMenuOpen(false)}
                        key={index}
                      >
                        {navItem.label}
                      </Link>
                    ))}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>
    </header>
  );
}
