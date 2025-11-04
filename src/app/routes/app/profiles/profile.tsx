import { useState } from 'react';

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
import { useCurrentUser } from '@/lib/auth';

const ProfileRoute = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { data, status } = useCurrentUser();

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

  return (
    <ContentLayout>
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - Left */}
          <div className="lg:col-span-2">
            <ProfileHeader user={user} isOwnProfile={true} />
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isOwnProfile={true}
              />
              <div className="p-4">
                <ProfileContent userId={user.id} activeTab={activeTab} />
              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} isOwnProfile={true} />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ProfileRoute;
