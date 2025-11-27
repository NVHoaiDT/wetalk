import {
  ClockIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import { Link, useNavigate } from 'react-router';

import { paths } from '@/config/paths';
import { useAddRecentSearch } from '@/features/search/api/add-recent-search';
import { useClearRecentSearches } from '@/features/search/api/clear-recent-searches';
import { useDeleteRecentSearch } from '@/features/search/api/delete-recent-search';
import { useRecentSearches } from '@/features/search/api/get-recent-searches';
import { cn } from '@/utils/cn';

export const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const { data: recentSearches = [] } = useRecentSearches();
  const addRecentSearchMutation = useAddRecentSearch();
  const deleteRecentSearchMutation = useDeleteRecentSearch();
  const clearRecentSearchesMutation = useClearRecentSearches();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return;

    addRecentSearchMutation.mutate({
      data: {
        keyword: keyword.trim(),
        searchAt: new Date().toISOString(),
      },
    });
    setShowSuggestions(false);
    navigate(paths.app.search.getHref(keyword.trim()));
  };

  const handleDeleteRecentSearch = (e: React.MouseEvent, keyword: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteRecentSearchMutation.mutate({ keyword });
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearRecentSearchesMutation.mutate(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
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
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search posts, communities..."
          className={cn(
            'h-11 w-full rounded-full bg-input/50 pl-12 pr-4 text-sm',
            'placeholder:text-muted-foreground/70',
            'outline-none transition-all',
            'hover:bg-accent/70',
            'focus:bg-background focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2',
          )}
        />
      </div>
      {showSuggestions && (
        <div
          className={cn(
            'absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden',
            'rounded-lg border bg-card shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          <div className="p-1.5">
            {query ? (
              // Current search query suggestion
              <Link
                to={paths.app.search.getHref(query)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent',
                  'text-muted-foreground hover:text-blue-600',
                )}
                onClick={() => handleSearch(query)}
              >
                <MagnifyingGlassIcon className="size-4" />
                <span className="font-medium">{query}</span>
                <span className="ml-auto text-xs text-muted-foreground/60">
                  Press Enter to search
                </span>
              </Link>
            ) : recentSearches.length > 0 ? (
              // Recent searches
              <>
                <div className="mb-2 flex items-center justify-between px-3 py-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Recent
                  </span>
                  <button
                    onClick={handleClearAllRecent}
                    className={cn(
                      'text-xs text-muted-foreground/70 transition-colors',
                      'hover:text-blue-600',
                    )}
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((search) => (
                  <Link
                    key={search.keyword}
                    to={paths.app.search.getHref(search.keyword)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm',
                      'transition-colors hover:bg-accent',
                    )}
                    onClick={() => {
                      handleSearch(search.keyword);
                    }}
                  >
                    <ClockIcon className="size-4 text-muted-foreground/70" />
                    <span className="flex-1 text-foreground">
                      {search.keyword}
                    </span>
                    <button
                      onClick={(e) =>
                        handleDeleteRecentSearch(e, search.keyword)
                      }
                      className={cn(
                        'opacity-0 transition-opacity group-hover:opacity-100',
                        'rounded p-0.5 hover:bg-accent-foreground/10',
                      )}
                      aria-label="Remove from recent searches"
                    >
                      <Cross2Icon className="size-3.5 text-muted-foreground" />
                    </button>
                  </Link>
                ))}
              </>
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No recent searches
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
