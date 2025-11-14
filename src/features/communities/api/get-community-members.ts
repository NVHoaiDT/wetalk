import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { CommunityMember, Pagination } from '@/types/api';

export const getCommunityMembers = ({
  communityId,
  status,
  search,
  sortBy,
  page = 1,
}: {
  communityId: number;
  status?: 'approved' | 'pending' /* Default is approved */;
  search?: string;
  sortBy?: string;
  page?: number;
}): Promise<{
  data: CommunityMember[];
  pagination: Pagination;
}> => {
  return api.get(`/communities/${communityId}/members`, {
    params: {
      status,
      search,
      sortBy,
      page,
    },
  });
};

export const getCommunityMembersQueryOptions = ({
  communityId,
  status,
  search,
  sortBy,
  page,
}: {
  communityId: number;
  status?: 'approved' | 'pending';
  search?: string;
  sortBy?: string;
  page?: number;
}) => {
  return queryOptions({
    queryKey: [
      'community-members',
      communityId,
      { status, search, sortBy, page },
    ],
    queryFn: () =>
      getCommunityMembers({ communityId, status, search, sortBy, page }),
  });
};

type UseCommunityMembersOptions = {
  communityId: number;
  status?: 'approved' | 'pending';
  search?: string;
  sortBy?: string;
  page?: number;
  queryConfig?: QueryConfig<typeof getCommunityMembersQueryOptions>;
};

export const useCommunityMembers = ({
  communityId,
  status,
  search,
  sortBy,
  page,
  queryConfig,
}: UseCommunityMembersOptions) => {
  return useQuery({
    ...getCommunityMembersQueryOptions({
      communityId,
      status,
      search,
      sortBy,
      page,
    }),
    ...queryConfig,
  });
};
