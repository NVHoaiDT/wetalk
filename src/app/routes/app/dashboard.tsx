import { MainErrorFallback } from '@/components/errors/main';
import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';

const DashboardRoute = () => {
  const { data, status } = useUser();

  if (status === 'pending') {
    return <Spinner />;
  }

  if (status === 'error') {
    return <MainErrorFallback />;
  }

  const user = data?.data;
  if (!user) {
    return null;
  }
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
        Welcome <b>{`${user?.username}`}</b>
      </h1>
      <h4 className="my-3">
        Your role is : <b>{user?.role.toUpperCase()}</b>
      </h4>
      <h4 className="my-3">
        Email : <b>{user?.email}</b>
      </h4>
    </ContentLayout>
  );
};

export default DashboardRoute;
