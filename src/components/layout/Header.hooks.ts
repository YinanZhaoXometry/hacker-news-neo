import { usePathname } from 'next/navigation';

export function useTestIsHomePage() {
  const pathname = usePathname();

  return pathname === '/' || pathname === '/home';
}
