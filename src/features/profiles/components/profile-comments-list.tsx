import { ArrowBigUp, ChevronDown, Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useInfiniteUserComments } from '@/features/profiles/api/get-user-comments';
import { cn } from '@/utils/cn';

type ProfileCommentsListProps = {
  userId: number;
};

type SortType = 'new' | 'top' | 'hot';

export const ProfileCommentsList = ({ userId }: ProfileCommentsListProps) => {
  const [sortBy, setSortBy] = useState<SortType>('new');
  const [showSort, setShowSort] = useState(false);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteUserComments({
      userId,
      sortBy,
    });

  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Eye className="size-4" />
          <span>Showing all comments</span>
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

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <Link
            key={comment.id}
            to={paths.app.post.getHref(comment.postId)}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex space-x-3">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-1">
                <button className="text-gray-400 hover:text-blue-600">
                  <ArrowBigUp className="size-6" />
                </button>
                <span className="text-sm font-semibold text-gray-900">
                  {comment.vote}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 text-xs text-gray-600">
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {comment.parentCommentId && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Reply</span>
                    </>
                  )}
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-900"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
                {/* <div className="mt-2 text-xs text-gray-600">
                  on post #{comment.postId}
                </div> */}
              </div>
            </div>
          </Link>
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
