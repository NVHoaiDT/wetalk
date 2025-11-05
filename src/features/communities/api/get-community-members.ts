import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CommunityMember, Pagination } from '@/types/api';

export const getCommunityMembers = ({
  communityId,
  search,
  sortBy,
  page = 1,
}: {
  communityId: number;
  search?: string;
  sortBy?: string;
  page?: number;
}): Promise<{
  data: CommunityMember[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/${communityId}/members`, {
    params: {
      search,
      sortBy,
      page,
    },
  });
};

export const getCommunityMembersQueryOptions = ({
  communityId,
  search,
  sortBy,
  page,
}: {
  communityId: number;
  search?: string;
  sortBy?: string;
  page?: number;
}) => {
  return queryOptions({
    queryKey: ['community-members', communityId, { search, sortBy, page }],
    queryFn: () => getCommunityMembers({ communityId, search, sortBy, page }),
  });
};

type UseCommunityMembersOptions = {
  communityId: number;
  search?: string;
  sortBy?: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getCommunityMembersQueryOptions>;
};

export const useCommunityMembers = ({
  communityId,
  search,
  sortBy,
  page,
  queryConfig,
}: UseCommunityMembersOptions) => {
  return useQuery({
    ...getCommunityMembersQueryOptions({ communityId, search, sortBy, page }),
    ...queryConfig,
  });
};
