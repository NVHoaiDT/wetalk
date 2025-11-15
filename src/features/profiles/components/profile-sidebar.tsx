import { MessageSquare, Calendar, Award, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';
import { User } from '@/types/api';

import { useUserBadget } from '../api/get-user-badget';

import { UpdateProfile } from './update-profile';

type ProfileSidebarProps = {
  user: User;
  isOwnProfile?: boolean;
};

export const ProfileSidebar = ({ user, isOwnProfile }: ProfileSidebarProps) => {
  const userBadgetQuery = useUserBadget({ userId: user.id });

  if (userBadgetQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const userBadget = userBadgetQuery.data?.data;
  fancyLog('User-Badget:', userBadget);

  const handleShare = () => {
    // TODO: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="space-y-4">
      {/* User Info Card */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-bold text-gray-900">
          {user.username}
        </h2>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="my-1 rounded-full bg-gray-100 py-2 hover:bg-gray-200"
          icon={<Share2 className="size-4" />}
        >
          Share
        </Button>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {user.achievement.karma}
            </div>
            <div className="text-sm text-gray-600">Karma</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {user.achievement.totalPosts + user.achievement.totalComments}
            </div>
            <div className="text-sm text-gray-600">Contributions</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Reddit Age</span>
            <span className="font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Posts</span>
            <span className="font-medium text-gray-900">
              {user.achievement.totalPosts}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Comments</span>
            <span className="font-medium text-gray-900">
              {user.achievement.totalComments}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Card */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-gray-600">ACHIEVEMENTS</h3>
          <Award className="size-5 text-amber-500" />
        </div>

        <div className="space-y-3">
          {/* Badges */}
          {userBadget && userBadget.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
                <img
                  src={userBadget[0].iconUrl}
                  alt={userBadget[0].badgeName}
                  className="size-6"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {userBadget[0].badgeName}
                </div>
                <div className="text-xs text-gray-600">
                  {userBadget[0].monthYear}
                </div>
              </div>
            </div>
          )}

          {/* Karma Hunter */}
          {user.achievement.karma > 50 && (
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Karma Hunter</div>
                <div className="text-xs text-gray-600">50+ Karma</div>
              </div>
            </div>
          )}
          {/* Active Contributor */}
          {user.achievement.totalComments > 5 && (
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Active Contributor
                </div>
                <div className="text-xs text-gray-600">10+ Comments</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Card (Only for own profile) */}
      {isOwnProfile && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">Settings</h3>
          <div className="space-y-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<Edit className="size-4" />}
            >
              Edit Profile
            </Button> */}
            <UpdateProfile />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<Award className="size-4" />}
            >
              Manage Achievements
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<Calendar className="size-4" />}
            >
              View History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
