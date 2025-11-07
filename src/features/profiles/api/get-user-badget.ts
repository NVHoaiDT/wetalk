/* 
    GET `/users/:id/badge-history`
    {
    "success": true,
    "message": "User badge history retrieved successfully",
    "data": [
        {
            "badgeName": "Platinum",
            "iconUrl": "/icons/badges/platinum.png",
            "karma": 205,
            "monthYear": "2025-11"
        },
        {
            "badgeName": "Silver",
            "iconUrl": "/icons/badges/silver.png",
            "karma": 75,
            "monthYear": "2025-10"
        }
    ]
}
*/

import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Badget } from '@/types/api';

// Fetcher Function (Retunr promise)
export const getUserBadget = ({
  userId,
}: {
  userId: number;
}): Promise<{ data: Badget[] }> => {
  return api.get(`/users/${userId}/badge-history`);
};

// Query Options
export const getUserBadgetQueryOption = (userId: number) => {
  return queryOptions({
    queryKey: ['user-badget', userId],
    queryFn: () => getUserBadget({ userId }),
  });
};

// Custom Hook Type
type UseUserBadgetOptions = {
  userId: number;
  queryConfig?: QueryConfig<typeof getUserBadget>;
};

// Custom Hook
export const useUserBadget = ({
  userId,
  queryConfig,
}: UseUserBadgetOptions) => {
  return useQuery({
    ...getUserBadgetQueryOption(userId),
    ...queryConfig,
  });
};
