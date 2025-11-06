import { Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useInfiniteCommunityPosts } from '../../api/get-community-posts';
import { PostsTable } from '../manage-posts/posts-table';

type PostsSectionProps = {
  communityId: number;
};

type PostStatus = 'pending' | 'approved' | 'rejected';

export const PostsSection = ({ communityId }: PostsSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus>('approved');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts with filters
  const postsQuery = useInfiniteCommunityPosts({
    communityId,
    search: debouncedSearch,
    status: statusFilter,
  });

  const posts = postsQuery.data?.pages.flatMap((page) => page.data) || [];
  const totalPosts = postsQuery.data?.pages[0]?.pagination?.total || 0;

  const handleLoadMore = () => {
    if (postsQuery.hasNextPage && !postsQuery.isFetchingNextPage) {
      postsQuery.fetchNextPage();
    }
  };

  const getStatusCount = () => {
    return totalPosts;
  };

  return (
    <div className="flex h-full flex-col">
      {/* Action Bar */}
      <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
        {/* Search and Filter Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-500" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as PostStatus)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {getStatusCount()}
            </span>
          </div>
          {statusFilter === 'pending' && totalPosts > 0 && (
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-yellow-500"></span>
              <span className="text-sm text-yellow-700">
                {totalPosts} post{totalPosts !== 1 ? 's' : ''} awaiting review
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Posts Table */}
      <div className="max-h-[calc(90vh-360px)] overflow-y-auto px-8 py-6">
        <PostsTable
          posts={posts}
          communityId={communityId}
          isLoading={postsQuery.isLoading}
          isFetchingNextPage={postsQuery.isFetchingNextPage}
          hasNextPage={postsQuery.hasNextPage}
          onLoadMore={handleLoadMore}
          currentStatus={statusFilter}
        />
      </div>
    </div>
  );
};
