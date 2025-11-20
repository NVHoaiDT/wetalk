import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAddRecentCommunity } from '@/features/communities/api/add-recent-community';
import { useCommunities } from '@/features/communities/api/get-communities';
import { fancyLog } from '@/helper/fancy-log';

import { CommunityCard } from './community-card';

interface CommunityGridProps {
  filter: string;
  topics?: string[];
}

const CommunityGrid = ({ filter, topics }: CommunityGridProps) => {
  const communityQuery = useCommunities({ sortBy: filter, page: 1, topics });
  const addRecentCommunityMutation = useAddRecentCommunity();

  if (communityQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const communities = communityQuery.data?.data;
  if (!communities) return null;

  fancyLog('CommunityGrid communities:', communities);
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {communities.map((community, index) => (
        <Link
          to={paths.app.community.getHref(community.id)}
          key={community.id}
          onClick={() =>
            addRecentCommunityMutation.mutate({
              data: {
                id: community.id,
                name: community.name,
                communityAvatar: community.communityAvatar,
                isPrivate: community.isPrivate,
                totalMembers: community.totalMembers,
              },
            })
          }
        >
          <CommunityCard rank={index + 1} {...community} />
        </Link>
      ))}
    </div>
  );
};

export { CommunityGrid };
