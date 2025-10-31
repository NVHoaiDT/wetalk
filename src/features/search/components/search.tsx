import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import * as React from 'react';

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
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Search posts, communities..."
          className={cn(
            'w-full rounded-full bg-muted px-10 py-2 text-sm outline-none',
            'placeholder:text-muted-foreground',
            'focus:ring-2 focus:ring-ring',
          )}
        />
      </div>
      {showSuggestions && query && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              // Handle suggestion click
              setShowSuggestions(false);
            }}
          >
            <MagnifyingGlassIcon className="size-4" />
            <span>{query}</span>
          </button>
        </div>
      )}
    </div>
  );
};
