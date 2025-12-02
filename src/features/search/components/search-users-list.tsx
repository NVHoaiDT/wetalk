import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { fancyLog } from '@/helper/fancy-log';

import { useInfiniteSearchUsers } from '../api/get-search-users';

type SearchUsersListProps = {
  query: string;
  sortType: string;
};

export const SearchUsersList = ({ query, sortType }: SearchUsersListProps) => {
  const searchUsersQuery = useInfiniteSearchUsers({ query, sortType });

  if (searchUsersQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (searchUsersQuery.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        Error loading users: {searchUsersQuery.error.message}
      </div>
    );
  }

  const users = searchUsersQuery.data?.pages.flatMap((page) => page.data) || [];
  fancyLog('SearchUsersList-Users:', users);

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
          <MessageCircle className="size-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No users found
        </h3>
        <p className="text-sm text-gray-600">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Link
          key={user.id}
          to={paths.app.userProfile.getHref(user.id)}
          className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="size-16 rounded-full border-2 border-gray-100 object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full border-2 border-gray-100 bg-gradient-to-br from-blue-400 to-blue-600 text-xl font-bold text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                  {user.username}
                </h3>
                {user.karma > 100 && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    <TrendingUp className="size-3" />
                    Popular
                  </span>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="size-4" />
                  <span className="font-medium">{user.karma}</span>
                  <span>karma</span>
                </div>
                <span>•</span>
                <span>
                  Joined{' '}
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                View Profile
              </Button>
            </div>
          </div>
        </Link>
      ))}

      {/* Load More */}
      {searchUsersQuery.hasNextPage && (
        <div className="pt-4 text-center">
          <Button
            variant="outline"
            onClick={() => searchUsersQuery.fetchNextPage()}
            disabled={searchUsersQuery.isFetchingNextPage}
            className="rounded-full"
          >
            {searchUsersQuery.isFetchingNextPage ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Load More Users'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
