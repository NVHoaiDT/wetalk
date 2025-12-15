import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ChevronDown, Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { DeletePost } from '@/features/posts/components/delete-post';
import { useInfiniteUserPosts } from '@/features/profiles/api/get-user-posts';
import { cn } from '@/utils/cn';

type ProfilePostsListProps = {
  userId: number;
};

type SortType = 'new' | 'top' | 'hot';

export const ProfilePostsList = ({ userId }: ProfilePostsListProps) => {
  const [sortBy, setSortBy] = useState<SortType>('new');
  const [showSort, setShowSort] = useState(false);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteUserPosts({
      userId,
      sortBy,
    });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="size-4" />
          <span>Showing all posts</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center space-x-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="capitalize">{sortBy}</span>
            <ChevronDown className="size-4" />
          </button>
          {showSort && (
            <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
              {(['new', 'top', 'hot'] as SortType[]).map((sort) => (
                <button
                  key={sort}
                  onClick={() => {
                    setSortBy(sort);
                    setShowSort(false);
                  }}
                  className={cn(
                    'block w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-50',
                    sortBy === sort && 'bg-blue-50 text-blue-600',
                  )}
                >
                  {sort}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex space-x-3">
              {/* Content */}
              <Link to={paths.app.post.getHref(post.id)}>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center space-x-2 text-xs text-gray-600">
                    {post.community ? (
                      <Link
                        to={paths.app.community.getHref(post.community.id)}
                        className="font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        r/{post.community.name}
                      </Link>
                    ) : (
                      <span className="font-semibold">[Deleted Community]</span>
                    )}
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  {post.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="size-4" />
                      <span>Comments</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {!post.community && (
              <div className="flex shrink-0 text-yellow-600">
                <DeletePost postId={post.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};
