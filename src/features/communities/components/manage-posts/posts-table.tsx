import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import {
  TableElement,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { paths } from '@/config/paths';
import { Post } from '@/types/api';
import { formatDate } from '@/utils/format';

import { ApprovePostButton } from './approve-post';
import { RejectPostButton } from './reject-post';
import { RemovePostButton } from './remove-post';

type PostsTableProps = {
  posts: Post[];
  communityId: number;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  currentStatus?: 'pending' | 'approved' | 'rejected';
};

export const PostsTable = ({
  posts,
  communityId,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  currentStatus,
}: PostsTableProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p className="text-lg font-medium">No posts found</p>
        <p className="text-sm text-gray-400">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusConfig[status as keyof typeof statusConfig] || 'border-gray-200 bg-gray-50 text-gray-700'}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPostTypeIcon = (type: string) => {
    const icons = {
      text: '📝',
      media: '🖼️',
      link: '🔗',
      poll: '📊',
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <TableElement>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-1/2 font-semibold text-gray-700">
                POST
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                AUTHOR
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                TYPE
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                STATUS
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                CREATED
              </TableHead>
              <TableHead className="w-[120px] text-right font-semibold text-gray-700">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell>
                  <Link
                    to={paths.app.post.getHref(post.id)}
                    className="group block"
                  >
                    <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                      {post.title}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="size-8 rounded-full border border-gray-200 object-cover"
                    />
                    <span className="text-sm text-gray-700">
                      {post.author.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getPostTypeIcon(post.type)} {post.type}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {formatDate(post.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {currentStatus !== 'approved' && (
                      <ApprovePostButton
                        communityId={communityId}
                        postId={post.id}
                        postTitle={post.title}
                      />
                    )}
                    {currentStatus !== 'rejected' && (
                      <RejectPostButton
                        communityId={communityId}
                        postId={post.id}
                        postTitle={post.title}
                      />
                    )}
                    <RemovePostButton
                      communityId={communityId}
                      postId={post.id}
                      postTitle={post.title}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableElement>
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-4 text-center">
          {isFetchingNextPage && <Spinner size="md" />}
        </div>
      )}
    </div>
  );
};
