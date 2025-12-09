import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAddRecentCommunity } from '@/features/communities/api/add-recent-community';
import { usePreferences } from '@/features/settings/api';
import { fancyLog } from '@/helper/fancy-log';

import {
  SearchedCommunity,
  useInfiniteSearchCommunities,
} from '../api/get-search-communites';

type SearchCommunitiesListProps = {
  query: string;
  sortType: string;
};

export const SearchCommunitiesList = ({
  query,
  sortType,
}: SearchCommunitiesListProps) => {
  const searchCommunitiesQuery = useInfiniteSearchCommunities({
    query,
    sortType,
  });
  const preferencesQueryClient = usePreferences();
  const addRecentCommunityMutation = useAddRecentCommunity();

  const preferences = preferencesQueryClient.data;

  /* Check if user allow to store recent communities */
  const handleAddToRecentCommunities = (community: {
    id: number;
    name: string;
    communityAvatar: string;
    isPrivate: boolean;
    totalMembers: number;
  }) => {
    if (preferences?.isStoreRecentCommunities) {
      addRecentCommunityMutation.mutate({
        data: {
          id: community.id,
          name: community.name,
          communityAvatar: community.communityAvatar,
          isPrivate: community.isPrivate,
          totalMembers: community.totalMembers,
        },
      });
    } else {
      console.log('User preferences do not allow to store recent communities');
    }
  };

  if (searchCommunitiesQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (searchCommunitiesQuery.isError) {
    return (
      <div>
        Error loading search results: {searchCommunitiesQuery.error.message}
      </div>
    );
  }

  const communities =
    searchCommunitiesQuery.data?.pages.flatMap((page) => page.data) || [];
  fancyLog('SearchCommunitiesList-Communities:', communities);

  return (
    <div className="flex-1 space-y-4">
      {communities.map((community: SearchedCommunity) => (
        <div
          key={community.id}
          className="flex items-start gap-4 rounded-md border-y p-4 hover:border-blue-200 hover:bg-blue-50/50"
        >
          <Link
            to={paths.app.community.getHref(community.id)}
            onClick={() =>
              handleAddToRecentCommunities({
                id: community.id,
                name: community.name,
                communityAvatar:
                  community.communityAvatar ||
                  'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
                isPrivate: community.isPrivate,
                totalMembers: community.totalMembers,
              })
            }
          >
            <img
              src={
                community.communityAvatar ||
                'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg'
              }
              alt={community.name}
              className="size-16 rounded-full object-cover"
            />
          </Link>
          <div className="flex-1">
            <Link
              to={paths.app.community.getHref(community.id)}
              onClick={() =>
                handleAddToRecentCommunities({
                  id: community.id,
                  name: community.name,
                  communityAvatar:
                    community.communityAvatar ||
                    'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
                  isPrivate: community.isPrivate,
                  totalMembers: community.totalMembers,
                })
              }
            >
              <h3 className="text-lg font-medium hover:text-blue-600">
                w/{community.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {community.shortDescription}
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              {community.totalMembers} members
            </div>
          </div>
          {community.isPrivate && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              Private
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
