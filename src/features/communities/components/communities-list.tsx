import { Link, useSearchParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';

import { useCommunities } from '../api/get-communities';

import { CommunityCard } from './ui/community-card';

const communitiySections = [
  {
    filter: 'member_count',
    title: 'Top Communities',
    shortDescription: 'Discover the most popular communities on Wetalk',
  },
  {
    filter: 'newest',
    title: 'Latest Communities',
    shortDescription: 'Discover the latest communities on Wetalk',
  },
];

const CommunitiesList = () => {
  const [searchParams] = useSearchParams();
  const communitiesQuery = useCommunities({
    sortBy: searchParams.get('sortBy') || 'member_count',
    page: +(searchParams.get('page') || 1),
  });

  if (communitiesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  /* const pagination = communitiesQuery.data?.pagination; */
  const communities = communitiesQuery.data?.data;

  if (!communities) return null;

  console.log(communities);

  return (
    <div className="flex flex-col gap-8">
      {communitiySections.map((section) => (
        <div key={section.filter}>
          <div className="mb-8">
            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
              {section.title}
            </h1>
            <p className="text-gray-600">{section.shortDescription}</p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {communities.map((community) => (
              <Link
                to={paths.app.community.getHref(community.id)}
                key={community.id}
              >
                <CommunityCard {...community} />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* <div className="mb-8">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
          Top Communities
        </h1>
        <p className="text-gray-600">
          Discover the most popular communities on Wetalk
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {communities.map((community) => (
          <CommunityCard key={community.id} {...community} />
        ))}
      </div> */}
    </div>
  );
};

export default CommunitiesList;
