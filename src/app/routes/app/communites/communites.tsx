import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { data, LoaderFunctionArgs } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { getCommunitiesQueryOptions } from '@/features/communities/api/get-communities';
import CommunitiesList from '@/features/communities/components/communities-list';

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
  const queryClient = useQueryClient();

  return (
    <ContentLayout title="Communites">
      <CommunitiesList></CommunitiesList>
    </ContentLayout>
  );
};

export default CommunitesRoute;
