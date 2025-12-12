import { ContentLayout } from '@/components/layouts';
import CommunitiesList from '@/features/communities/components/communities-list';
import { CreateCommunity } from '@/features/communities/components/create-community';

const CommunitesRoute = () => {
  return (
    <ContentLayout>
      <div className="flex justify-end">
        <CreateCommunity />
      </div>
      <div className="mt-4">
        <CommunitiesList />
      </div>
    </ContentLayout>
  );
};

export default CommunitesRoute;
