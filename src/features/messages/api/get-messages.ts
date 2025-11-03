import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { MessagesResponse } from '@/types/api';

export const getMessages = ({
  conversationId,
  page = 1,
  limit = 50,
}: {
  conversationId: number;
  page?: number;
  limit?: number;
}): Promise<MessagesResponse> => {
  return api.get(`/messages/conversations/${conversationId}/messages`, {
    params: {
      page,
      limit,
    },
  });
};

export const getMessagesQueryOptions = ({
  conversationId,
  page = 1,
  limit = 50,
}: {
  conversationId: number;
  page?: number;
  limit?: number;
}) => {
  return queryOptions({
    queryKey: ['messages', conversationId, { page, limit }],
    queryFn: () => getMessages({ conversationId, page, limit }),
    enabled: !!conversationId,
  });
};

type UseMessagesOptions = {
  conversationId: number;
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getMessagesQueryOptions>;
};

export const useMessages = ({
  conversationId,
  page = 1,
  limit = 50,
  queryConfig,
}: UseMessagesOptions) => {
  return useQuery({
    ...getMessagesQueryOptions({ conversationId, page, limit }),
    ...queryConfig,
  });
};
