import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { ConversationsResponse } from '@/types/api';

export const getConversations = ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<ConversationsResponse> => {
  return api.get('/messages/conversations', {
    params: {
      page,
      limit,
    },
  });
};

export const getConversationsQueryOptions = ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return queryOptions({
    queryKey: ['conversations', { page, limit }],
    queryFn: () => getConversations({ page, limit }),
  });
};

type UseConversationsOptions = {
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getConversationsQueryOptions>;
};

export const useConversations = ({
  page = 1,
  limit = 20,
  queryConfig,
}: UseConversationsOptions = {}) => {
  return useQuery({
    ...getConversationsQueryOptions({ page, limit }),
    ...queryConfig,
  });
};
