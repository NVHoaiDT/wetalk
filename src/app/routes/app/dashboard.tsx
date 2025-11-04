import { MainErrorFallback } from '@/components/errors/main';
import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';
import { useUser } from '@/lib/auth';

const DashboardRoute = () => {
  const userQuery = useUser();
  if (userQuery.isLoading) {
    return <Spinner />;
  }

  if (userQuery.isError) {
    return <MainErrorFallback />;
  }

  const user = userQuery.data?.data;
  if (!user) {
    return null;
  }

  fancyLog('USER', user);
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
        Welcome back, <b>{user.username}</b>
      </h1>
    </ContentLayout>
  );
};

export default DashboardRoute;
