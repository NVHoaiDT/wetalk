import { useState } from 'react';
import { useParams } from 'react-router';

import { MainErrorFallback } from '@/components/errors/main';
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
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const { data: currentUserData } = useCurrentUser();
  const currentUserId = currentUserData?.data?.id;

  const { data, status } = useUser(Number(userId));

  if (status === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status === 'error') {
    return <MainErrorFallback />;
  }

  const user = data?.data;
  if (!user) {
    return null;
  }

  const isOwnProfile = currentUserId === user.id;

  return (
    <ContentLayout title={`${user.username}'s Profile`}>
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
