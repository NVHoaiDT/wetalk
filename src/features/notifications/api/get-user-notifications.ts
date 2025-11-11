/* 
    Fetch user notifications.

    Endpoint: `GET /notifications`

    Respone example:
    ```
    {
        "success": true,
        "message": "Notifications retrieved successfully",
        "data": [            
            {
                "id": 4,
                "body": "nguyenvana downvoted your post",
                "action": "get_post_vote",      // action type: get_post_new_comment | get_comment_vote | get_comment_reply | get_post_vote
                "payload": {
                    "postId": 7,
                    "userName": "nguyenvana",
                    "voteType": false
                },
                "isRead": false,
                "createdAt": "2025-11-02T14:32:12.690922Z"
            },            
            ...
        ],
        "pagination": {
        "total": 45,
        "page": 1,
        "limit": 10,
        "next_url": "/api/v1/notifications?page=2&limit=10"
        }
    }
    ```
*/

import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { NotificationsResponse } from '@/types/api';

export const getUserNotifications = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<NotificationsResponse> => {
  return api.get('/notifications', {
    params: {
      page,
      limit,
    },
  });
};

export const getUserNotificationsQueryOptions = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return queryOptions({
    queryKey: ['notifications', { page, limit }],
    queryFn: () => getUserNotifications({ page, limit }),
  });
};

type UseUserNotificationsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getUserNotificationsQueryOptions>;
};

export const useUserNotifications = ({
  page = 1,
  limit = 10,
  queryConfig,
}: UseUserNotificationsOptions = {}) => {
  return useQuery({
    ...getUserNotificationsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
