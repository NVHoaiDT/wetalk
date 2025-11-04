import { TrendingUp, MessageSquare, Calendar, Award, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { User } from '@/types/api';

type ProfileSidebarProps = {
  user: User;
  isOwnProfile?: boolean;
};

export const ProfileSidebar = ({ user, isOwnProfile }: ProfileSidebarProps) => {
  return (
    <div className="space-y-4">
      {/* User Info Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          {user.username}
        </h2>

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
          <h3 className="font-bold text-gray-900">Achievements</h3>
          <Award className="size-5 text-amber-500" />
        </div>

        <div className="space-y-3">
          {/* Badge */}
          <div className="flex items-center space-x-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md">
              <Award className="size-6" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {user.achievement.badge}
              </div>
              <div className="text-xs text-gray-600">Badge</div>
            </div>
          </div>

          {/* Karma Badge */}
          {user.achievement.karma > 100 && (
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
                <TrendingUp className="size-6" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">High Karma</div>
                <div className="text-xs text-gray-600">100+ Karma Points</div>
              </div>
            </div>
          )}

          {/* Active Contributor */}
          {user.achievement.totalComments > 10 && (
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
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<Edit className="size-4" />}
            >
              Edit Profile
            </Button>
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
