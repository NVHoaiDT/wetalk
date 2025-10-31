import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Link } from 'react-router';

import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

export const Search = () => {
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(Boolean(value));
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
  };
  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <div className="group relative">
        <MagnifyingGlassIcon
          className={cn(
            'absolute left-4 top-1/2 size-5 -translate-y-1/2 transition-colors',
            'text-muted-foreground/70 group-focus-within:text-blue-500',
          )}
        />
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search posts, communities..."
          className={cn(
            'h-11 w-full rounded-full bg-accent/50 pl-12 pr-4 text-sm',
            'placeholder:text-muted-foreground/70',
            'outline-none transition-all',
            'hover:bg-accent/70',
            'focus:bg-background focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2',
          )}
        />
      </div>
      {showSuggestions && query && (
        <div
          className={cn(
            'absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden',
            'rounded-lg border bg-card shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          <div className="p-1.5">
            <Link
              to={paths.app.search.getHref(query)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                'transition-colors hover:bg-accent',
                'text-muted-foreground hover:text-blue-600',
              )}
              onClick={handleSuggestionClick}
            >
              <MagnifyingGlassIcon className="size-4" />
              <span className="font-medium">{query}</span>
              <span className="ml-auto text-xs text-muted-foreground/60">
                Press Enter to search
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
