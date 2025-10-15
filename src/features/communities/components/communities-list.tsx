import { useSearchParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';

import { useCommunities } from '../api/get-communities';

const CommunitiesList = () => {
  const [searchParams] = useSearchParams();
  const communitiesQuery = useCommunities({
    page: +(searchParams.get('page') || 1),
  });

  if (communitiesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const communities = communitiesQuery.data?.data;
  const pagination = communitiesQuery.data?.pagination;

  console.log('============Communities: ', communities);
  console.log('============Pagination: ', pagination);

  if (!communities) return null;

  return <h1>Test</h1>;
};

export default CommunitiesList;
