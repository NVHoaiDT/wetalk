import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { useServerSideEvents } from '@/lib/server-side-event';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  // Connect to SSE for real-time updates (messages, notifications, etc.)
  useServerSideEvents({ enabled: true });

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
