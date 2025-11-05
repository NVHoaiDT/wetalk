import { Clock, Flame, Star, TrendingUp, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Spinner } from '@/components/ui/spinner';
import { useInfiniteAllPosts } from '@/features/dashboard/api/get-all-posts';

import { DashboardPostCard } from './dashboard-post-card';

const sortOptions = [
  { value: 'best', label: 'Best', icon: Star, color: 'text-yellow-500' },
  { value: 'hot', label: 'Hot', icon: Flame, color: 'text-orange-500' },
  { value: 'new', label: 'New', icon: Clock, color: 'text-blue-500' },
  { value: 'top', label: 'Top', icon: TrendingUp, color: 'text-green-500' },
] as const;

type SortType = (typeof sortOptions)[number]['value'];

export const DashboardPostsFeed = () => {
  const [sortBy, setSortBy] = useState<SortType>('best');
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteAllPosts({ sortBy });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  const currentSort = sortOptions.find((opt) => opt.value === sortBy);
  const CurrentSortIcon = currentSort?.icon || Star;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Bar */}
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md">
              <CurrentSortIcon className={`size-4 ${currentSort?.color}`} />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                {currentSort?.label}
              </span>
              <ChevronDown className="size-4 text-gray-400 transition-transform group-hover:text-blue-600 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
                    ${
                      isActive
                        ? 'border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon
                    className={`size-4 ${isActive ? option.color : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto size-2 animate-pulse rounded-full bg-blue-600" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">No posts found</p>
          </div>
        ) : (
          posts.map((post) => <DashboardPostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Infinite Scroll Sentinel & Loading Indicator */}
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-gray-600">Loading more posts...</p>
            </div>
          )}
        </div>
      )}

      {/* End of feed message */}
      {!hasNextPage && posts.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            🎉 You have reached the end! No more posts to load.
          </p>
        </div>
      )}
    </div>
  );
};
