import { Camera } from 'lucide-react';

import { User } from '@/types/api';

type ProfileHeaderProps = {
  user: User;
  isOwnProfile?: boolean;
};

export const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Banner Background */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 sm:h-40">
        <img
          src={user.coverImage}
          alt={`${user.username}'s cover`}
          className="size-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-12 mb-4 inline-block sm:-mt-16">
          <div className="group relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="size-24 rounded-full border-4 border-white bg-gray-100 object-cover shadow-lg sm:size-32"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-lg sm:size-32 sm:text-4xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 sm:size-10">
                <Camera className="size-4 sm:size-5 " />
              </button>
            )}
          </div>
        </div>

        {/* User Details */}
        <div>
          <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {user.username}
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            u/{user.username}
          </p>
        </div>
      </div>
    </div>
  );
};
