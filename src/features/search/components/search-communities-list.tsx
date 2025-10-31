import { Spinner } from '@/components/ui/spinner';
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
          <img
            src={
              'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg'
            }
            alt={community.name}
            className="size-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-medium">w/{community.name}</h3>
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
