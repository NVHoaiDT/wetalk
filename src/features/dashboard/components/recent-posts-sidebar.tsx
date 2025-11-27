import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/config/paths';
import { useInfiniteAllPosts } from '@/features/dashboard/api/get-all-posts';
import { formatBigNumber } from '@/utils/format';

const RecentPostsSidebarPlaceholder = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header Skeleton */}
      <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200"></div>

      {/* Post Items Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
          >
            <div className="flex gap-3">
              {/* Avatar Skeleton */}
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200"></div>

              {/* Post Info Skeleton */}
              <div className="min-w-0 flex-1">
                {/* Community Name Skeleton */}
                <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-200"></div>

                <div className="flex items-center justify-between pb-3">
                  {/* Title Skeleton */}
                  <div className="mr-2 h-5 flex-1 animate-pulse rounded bg-gray-200"></div>
                  {/* Date Skeleton */}
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="h-7 w-20 animate-pulse rounded-xl bg-gray-200"></div>
                  <div className="h-7 w-16 animate-pulse rounded-xl bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link Skeleton */}
      <div className="mt-4 h-5 w-32 animate-pulse rounded bg-gray-200"></div>
    </div>
  );
};

export const RecentPostsSidebar = () => {
  const { data, isLoading } = useInfiniteAllPosts();

  const posts = data?.pages.flatMap((page) => page.data).slice(0, 5) ?? [];

  if (isLoading) {
    return <RecentPostsSidebarPlaceholder />;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center">
        <h3 className="mb-2 bg-[url(https://res.cloudinary.com/djwpst00v/image/upload/v1764155666/hey-brush_qdt75l.webp)] bg-contain bg-center bg-no-repeat px-2 py-1 text-lg font-semibold text-gray-700">
          Recent
        </h3>
        <h3 className="mb-2 text-lg font-semibold text-gray-700">Posts</h3>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-sm text-gray-600">No posts available</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={paths.app.post.getHref(post.id)}
              className="group block border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
            >
              <div className="flex gap-3">
                {/* Community Avatar */}
                <div className="shrink-0">
                  <img
                    className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white"
                    alt={post.community.name}
                    src={
                      'https://b.thumbs.redditmedia.com/J_fCwTYJkoM-way-eaOHv8AOHoF_jNXNqOvPrQ7bINY.png'
                    }
                  ></img>
                </div>

                {/* Post Info */}
                <div className="min-w-0 flex-1">
                  {/* Community & Date */}
                  <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">
                      r/{post.community.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3">
                    {/* Post Title */}
                    <h3 className="mr-2 line-clamp-1  text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                      {post.title}
                    </h3>
                    {/* Post Date */}
                    <span className="whitespace-nowrap text-xs text-gray-600">
                      •
                      {formatDistanceToNow(new Date(post.createdAt)).replace(
                        'about ',
                        '',
                      )}
                    </span>
                  </div>
                  {/* Post Stats */}
                  {/* TODO: Apply a color base on post vote + post comments */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 rounded-xl border border-yellow-200 bg-yellow-50 px-2.5 py-1 font-medium">
                      <TrendingUp className="size-4" />
                      <span className="">{formatBigNumber(post.vote)}</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-xl border border-sky-200 bg-cyan-50 px-2.5 py-1 font-medium">
                      <MessageCircle className="size-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View All Link */}
      {posts.length > 0 && (
        <Link
          to={paths.app.dashboard.getHref()}
          className="mt-4 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all posts →
        </Link>
      )}
    </div>
  );
};
