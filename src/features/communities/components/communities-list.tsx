import { useSearchParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';

import { useCommunities } from '../api/get-communities';

import { CommunityCard } from './ui/community-card';

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

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
          Top Communities
        </h1>
        <p className="text-gray-600">
          Discover the most popular communities on Wetalk
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {communities.map((community) => (
          <CommunityCard key={community.id} {...community} />
        ))}
      </div>
    </div>
  );
};

export default CommunitiesList;
