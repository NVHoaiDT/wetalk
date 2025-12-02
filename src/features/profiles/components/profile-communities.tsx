import { Users, Lock, Crown, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUserCommunities } from '@/features/profiles/api/get-user-community';
import { fancyLog } from '@/helper/fancy-log';

type ProfileCommunitiesProps = {
  userId: number;
};

const communityRoleIcons = {
  super_admin: <Crown className="size-4 text-amber-500" />,
  admin: <ShieldCheck className="size-4 text-blue-500" />,
};

export const ProfileCommunities = ({ userId }: ProfileCommunitiesProps) => {
  const { data, isLoading } = useUserCommunities({
    userId,
  });

  const communities = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">No communities yet</p>
      </div>
    );
  }

  fancyLog('User-Communities', communities);
  return (
    <div className="space-y-4">
      {/* Communities List */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {communities.map((community) => (
          <Link
            key={community.id}
            to={paths.app.community.getHref(community.id)}
            className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start space-x-3">
              {/* Community Avatar */}
              <img
                src={community.communityAvatar}
                alt={community.name}
                className="size-16 rounded-lg object-cover"
              />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center space-x-2">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    w/{community.name}
                  </h3>
                  {community.userRole &&
                    community.userRole in communityRoleIcons && (
                      <div title={community.userRole}>
                        {
                          communityRoleIcons[
                            community.userRole as keyof typeof communityRoleIcons
                          ]
                        }
                      </div>
                    )}
                  {community.isPrivate && (
                    <Lock className="size-4 shrink-0 text-gray-500" />
                  )}
                </div>
                <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {community.shortDescription}
                </p>

                {/* Topics */}
                {community.topic && community.topic.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {community.topic.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Members Count */}
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Users className="size-4" />
                  <span>
                    {community.totalMembers}{' '}
                    {community.totalMembers === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
