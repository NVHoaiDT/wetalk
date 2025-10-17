import { useSearchParams } from 'react-router';

import { Grid } from '@/components/ui/grid';
import { Spinner } from '@/components/ui/spinner';

import { useCommunities } from '../api/get-communities';

import { CommunityCard } from './ui/community-card';

/* const communitiyListTypes = ['top', 'new', 'hot', 'trending']; */

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

  const pagination = communitiesQuery.data?.pagination;
  const communities = communitiesQuery.data?.data;

  console.log(communities);
  if (!communities) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
          Top Communities
        </h1>
        <p className="text-gray-600">
          Discover the most popular communities on Wetalk
        </p>
      </div>

      <Grid
        data={communities}
        renderItem={(community) => <CommunityCard {...community} />}
        gridClassName="grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2"
      />
    </div>
  );
};

export default CommunitiesList;
