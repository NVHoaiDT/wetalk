import { useState } from 'react';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { ProfileContent } from '@/features/profiles/components/profile-content';
import { ProfileHeader } from '@/features/profiles/components/profile-header';
import { ProfileSidebar } from '@/features/profiles/components/profile-sidebar';
import {
  ProfileTabs,
  TabType,
} from '@/features/profiles/components/profile-tabs';
import { useUser, useCurrentUser } from '@/lib/auth';

const UserProfileRoute = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('communities');

  const { data: currentUserData } = useCurrentUser();
  const currentUserId = currentUserData?.data?.id;

  const userQuery = useUser(Number(userId));

  if (userQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (userQuery.isError || !userQuery.data?.data) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex max-w-full flex-col items-center gap-4 rounded-lg border border-orange-200 bg-white p-8 text-center">
          <img
            src="https://res.cloudinary.com/djwpst00v/image/upload/v1763789403/13379593_5219088_iajsfa.svg"
            alt="question"
            className="size-96 rounded-full"
          />
          <h3 className="text-lg font-semibold text-red-900">
            Unable to load Profile
          </h3>
          <p className="text-sm text-orange-700">
            This user profile might not exist. Please make sure the URL is
            correct or try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  const user = userQuery.data?.data;

  const isOwnProfile = currentUserId === user.id;

  return (
    <ContentLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - Left */}
          <div className="lg:col-span-2">
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOwnProfile={isOwnProfile}
              />
              <div className="p-4">
                <ProfileContent userId={user.id} activeTab={activeTab} />
              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default UserProfileRoute;
