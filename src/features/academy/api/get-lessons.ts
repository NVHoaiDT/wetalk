import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Lesson, Pagination } from '@/types/api';

export const getLessons = ({
  topicSlug,
  page = 1,
  limit = 10,
}: {
  topicSlug: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Lesson[]; pagination: Pagination }> => {
  return apiAcademy.get(`/topics/${topicSlug}/lessons`, {
    params: { page, limit },
  });
};

export const getLessonsQueryOptions = (
  topicSlug: string,
  page = 1,
  limit = 10,
) => {
  return queryOptions({
    queryKey: ['lessons', topicSlug, page, limit],
    queryFn: () => getLessons({ topicSlug, page, limit }),
  });
};

type UseLessonsOptions = {
  topicSlug: string;
  page?: number;
  limit?: number;
  queryConfig?: QueryConfig<typeof getLessonsQueryOptions>;
};

export const useLessons = ({
  topicSlug,
  page = 1,
  limit = 10,
  queryConfig,
}: UseLessonsOptions) => {
  return useQuery({
    ...getLessonsQueryOptions(topicSlug, page, limit),
    ...queryConfig,
  });
};
