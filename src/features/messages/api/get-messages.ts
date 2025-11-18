import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { MessagesResponse } from '@/types/api';

export const getMessages = ({
  conversationId,
  page = 1,
}: {
  conversationId: number;
  page?: number;
}): Promise<MessagesResponse> => {
  return api.get(`/messages/conversations/${conversationId}/messages`, {
    params: {
      page,
    },
  });
};

export const getMessagesQueryOptions = ({
  conversationId,
  page = 1,
}: {
  conversationId: number;
  page?: number;
}) => {
  return queryOptions({
    queryKey: ['messages', conversationId, { page }],
    queryFn: () => getMessages({ conversationId, page }),
    enabled: !!conversationId,
  });
};

type UseMessagesOptions = {
  conversationId: number;
  page?: number;
  queryConfig?: QueryConfig<typeof getMessagesQueryOptions>;
};

export const useMessages = ({
  conversationId,
  page = 1,
  queryConfig,
}: UseMessagesOptions) => {
  return useQuery({
    ...getMessagesQueryOptions({ conversationId, page }),
    ...queryConfig,
  });
};
