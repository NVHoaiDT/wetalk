import { ContentLayout } from '@/components/layouts';
import { NotificationsList } from '@/features/notifications/components/notifications-list';
import { ProtectedRoute } from '@/lib/auth';

const NotificationsRoute = () => {
  return (
    <ProtectedRoute>
      <ContentLayout>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <NotificationsList />
            </div>
          </div>
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
};

export default NotificationsRoute;
