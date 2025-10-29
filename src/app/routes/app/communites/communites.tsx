import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { getCommunitiesQueryOptions } from '@/features/communities/api/get-communities';
import CommunitiesList from '@/features/communities/components/communities-list';
import { CreateCommunity } from '@/features/communities/components/create-community';

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const page = Number(url.searchParams.get('page') || 1);

    const query = getCommunitiesQueryOptions({ page });

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

const CommunitesRoute = () => {
  return (
    <ContentLayout title="Communites">
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
