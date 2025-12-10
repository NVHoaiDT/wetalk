import {
  ALargeSmall,
  BookmarkX,
  CheckCheck,
  ClipboardClock,
  FastForward,
  List,
} from 'lucide-react';
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

import { ApprovePost } from './approve-post';
import { RejectPost } from './reject-post';
import { RemovePost } from './remove-post';

type PostsTableProps = {
  posts: Post[];
  communityId: number;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  currentStatus?: 'pending' | 'approved' | 'rejected';
};

const typeIcons = {
  text: <ALargeSmall className="size-5 text-yellow-500" />,
  media: <FastForward className="size-5 text-gray-500" />,
  poll: <List className="size-5 text-blue-500" />,
};
const statusIcons = {
  approved: <CheckCheck className="size-5 text-green-500" />,
  pending: <ClipboardClock className="size-5 text-yellow-500" />,
  rejected: <BookmarkX className="size-5 text-orange-500" />,
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

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <TableElement>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-1/3 font-semibold text-gray-700">
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
                <TableCell className="px-2">
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

                <TableCell className="px-4">
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

                <TableCell className="px-4">
                  <span className="text-sm">
                    {typeIcons[post.type as keyof typeof typeIcons]}
                  </span>
                </TableCell>

                <TableCell className="px-4">
                  {statusIcons[post.status as keyof typeof statusIcons]}{' '}
                </TableCell>

                <TableCell className="px-4">
                  <div className="text-sm text-gray-600">
                    {formatDate(post.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {currentStatus !== 'approved' && (
                      <ApprovePost
                        communityId={communityId}
                        postId={post.id}
                        postTitle={post.title}
                      />
                    )}
                    {currentStatus !== 'rejected' && (
                      <RejectPost
                        communityId={communityId}
                        postId={post.id}
                        postTitle={post.title}
                      />
                    )}
                    <RemovePost
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
