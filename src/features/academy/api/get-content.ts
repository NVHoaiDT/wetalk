import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { LessonContent } from '@/types/api';

export const getContent = ({
  lessonSlug,
}: {
  lessonSlug: string;
}): Promise<{ data: LessonContent }> => {
  return apiAcademy.get(`/lessons/${lessonSlug}/content`);
};

export const getContentQueryOptions = (lessonSlug: string) => {
  return queryOptions({
    queryKey: ['content', lessonSlug],
    queryFn: () => getContent({ lessonSlug }),
  });
};

type UseContentOptions = {
  lessonSlug: string;
  queryConfig?: QueryConfig<typeof getContentQueryOptions>;
};

export const useContent = ({ lessonSlug, queryConfig }: UseContentOptions) => {
  return useQuery({
    ...getContentQueryOptions(lessonSlug),
    ...queryConfig,
  });
};
