/* 
    Endpoint: GET /communities/:id/manage/restrictions/user/:userId
    Response:
    {
        "data": [
            {
                "id": 3,
                "restrictionType": "temporary_ban",
                "reason": "Please follow community guidelines",
                "expiresAt": "2025-12-15T00:00:00Z",
                "createdAt": "2025-12-08T14:10:09.466562Z"
            },
            {
                "id": 2,
                "restrictionType": "warning",
                "reason": "Please follow community guidelines",
                "createdAt": "2025-12-08T14:08:41.562591Z"
            }
        ],
        "pagination": {
            "total": 2, // total ban records
            "page": 1,  // current page
            "limit": 10 // items per page
        }
    }
*/
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { BanRestriction, Pagination } from '@/types/api';

export const getBannedHistory = ({
  communityId,
  userId,
  page = 1,
}: {
  communityId: number;
  userId: number;
  page?: number;
}): Promise<{
  data: BanRestriction[];
  pagination: Pagination;
}> => {
  return api.get(
    `/communities/${communityId}/manage/restrictions/user/${userId}`,
    {
      params: {
        page,
      },
    },
  );
};

export const getBannedHistoryQueryOptions = ({
  communityId,
  userId,
  page,
}: {
  communityId: number;
  userId: number;
  page?: number;
}) => {
  return queryOptions({
    queryKey: ['community-banned-history', communityId, userId, page],
    queryFn: () => getBannedHistory({ communityId, userId, page }),
  });
};

type UseBannedHistoryOptions = {
  communityId: number;
  userId: number;
  page?: number;
  queryConfig?: QueryConfig<typeof getBannedHistoryQueryOptions>;
};

export const useBannedHistory = ({
  communityId,
  userId,
  page,
  queryConfig,
}: UseBannedHistoryOptions) => {
  return useQuery({
    ...getBannedHistoryQueryOptions({ communityId, userId, page }),
    ...queryConfig,
  });
};
