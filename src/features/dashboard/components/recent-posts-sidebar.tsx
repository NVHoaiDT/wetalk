import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useInfiniteAllPosts } from '@/features/dashboard/api/get-all-posts';
import { formatBigNumber } from '@/utils/format';

export const RecentPostsSidebar = () => {
  const { data, isLoading } = useInfiniteAllPosts({ sortBy: 'best' });

  const posts = data?.pages.flatMap((page) => page.data).slice(0, 5) ?? [];

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Posts</h2>
        <div className="flex h-32 items-center justify-center">
          <Spinner size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Posts</h2>

      {posts.length === 0 ? (
        <p className="text-center text-sm text-gray-600">No posts available</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={paths.app.post.getHref(post.id)}
              className="group block border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex gap-3">
                {/* Community Avatar */}
                <div className="shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                    {post.community.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Post Info */}
                <div className="min-w-0 flex-1">
                  {/* Community & Date */}
                  <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-semibold text-gray-900">
                      r/{post.community.name}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {post.title}
                  </h3>

                  {/* Post Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      <span className="font-medium">
                        {formatBigNumber(post.vote)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      <span>10</span>
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
