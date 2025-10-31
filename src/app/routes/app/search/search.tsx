import { QueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';

export const clientLoader = (queryClient: QueryClient) => async () => {
  // No data to preload for now
  return null;
};
const SearchRoute = () => {
  const params = useParams();
  const query = params.query as string;
  return (
    <ContentLayout title="Search">
      <div>Search Page: {query}</div>
    </ContentLayout>
  );
};
export default SearchRoute;
