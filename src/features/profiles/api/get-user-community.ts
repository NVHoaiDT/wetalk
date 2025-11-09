/* 
{
    "id": 4,
    "name": "Java Vietnam Community",
    "shortDescription": "Java Developer Community in Vietnam",
    "topic": [
        "Technology",
        "Career"
    ],
    "communityAvatar": "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    "isPrivate": false,
    "totalMembers": 0
},
{
    "id": 3,
    "name": "Golang Vietnam",
    "shortDescription": "Golang Developer Community in Vietnam",
    "topic": [
        "Technology",
        "Programming"
    ],
    "communityAvatar": "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    "isPrivate": false,
    "totalMembers": 1
},
{
    "id": 2,
    "name": "ReactJS dev community",
    "shortDescription": "Community for ReactJS developer in Vietnam",
    "topic": [
        "Technology",
        "Programming"
    ],
    "communityAvatar": "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    "isPrivate": false,
    "totalMembers": 1
}
*/

import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Community } from '@/types/api';

export const getUserCommunities = ({
  userId,
}: {
  userId: number;
}): Promise<{ data: Community[] }> => {
  return api.get(`/users/${userId}/communities/super-admin`);
};

export const getUserCommunitiesQueryOptions = (userId: number) => {
  return queryOptions({
    queryKey: ['user-communities'],
    queryFn: () => getUserCommunities({ userId }),
  });
};

type UseUserCommunitiesOptions = {
  userId: number;
  queryConfig?: QueryConfig<typeof getUserCommunitiesQueryOptions>;
};

export const useUserCommunities = ({
  userId,
  queryConfig,
}: UseUserCommunitiesOptions) => {
  return useQuery({
    ...getUserCommunitiesQueryOptions(userId),
    ...queryConfig,
  });
};
