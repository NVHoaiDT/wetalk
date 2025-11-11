import { ContentLayout } from '@/components/layouts';
import { NotificationsList } from '@/features/notifications/components/notifications-list';

const NotificationsRoute = () => {
  return (
    <ContentLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <NotificationsList />
        </div>
      </div>
    </ContentLayout>
  );
};

export default NotificationsRoute;
