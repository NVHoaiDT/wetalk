import { ContentLayout } from '@/components/layouts';
import {
  DashboardPostsFeed,
  RecentPostsSidebar,
} from '@/features/dashboard/components';

const DashboardRoute = () => {
  return (
    <ContentLayout>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Feed - Takes 8 columns on large screens */}
          <div className="lg:col-span-8">
            <DashboardPostsFeed />
          </div>

          {/* Sidebar - Takes 4 columns on large screens, sticky on desktop */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <RecentPostsSidebar />
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default DashboardRoute;
