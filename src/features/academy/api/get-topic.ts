import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Topic } from '@/types/api';

export const getTopic = ({
  slug,
}: {
  slug: string;
}): Promise<{ data: Topic }> => {
  return apiAcademy.get(`/topics/${slug}`);
};

export const getTopicQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ['topics', slug],
    queryFn: () => getTopic({ slug }),
  });
};

type UseTopicOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getTopicQueryOptions>;
};

export const useTopic = ({ slug, queryConfig }: UseTopicOptions) => {
  return useQuery({
    ...getTopicQueryOptions(slug),
    ...queryConfig,
  });
};
