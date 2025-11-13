/* 
REQUEST: `GET /communities/topics?search=a`
RESPONSE:
{
    "success": true,
    "message": "Topics retrieved successfully",
    "data": [
        {
            "id": 14,
            "name": "Applied Science"
        },
        {
            "id": 4,
            "name": "Artificial Intelligence"
        },
        {
            "id": 13,
            "name": "Automation & Robotics"
        },
        ...
    ]
}
*/

import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Tag } from '@/types/api';

export const getCommunitiesTopics = ({
  search,
}: {
  search: string;
}): Promise<{ data: Tag[] }> => {
  return api.get('/communities/topics', {
    params: {
      search,
    },
  });
};

export const getCommunitiesTopicsQueryOptions = (search: string) => {
  return {
    queryKey: ['communities-topics', search],
    queryFn: () => getCommunitiesTopics({ search }),
  };
};

type GetCommunitiesTopicsOptions = {
  search: string;
  queryConfig?: QueryConfig<typeof getCommunitiesTopicsQueryOptions>;
};

export const useCommunitiesTopics = ({
  search,
  queryConfig,
}: GetCommunitiesTopicsOptions) => {
  return useQuery({
    ...getCommunitiesTopicsQueryOptions(search),
    ...queryConfig,
  });
};
