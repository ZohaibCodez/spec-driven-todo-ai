'use client';

import * as React from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export function useMediaQuery(breakpoint: keyof typeof BREAKPOINTS): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint, matches]);

  return matches;
}
