import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Lesson } from '@/types/api';

export const getLesson = ({
  slug,
}: {
  slug: string;
}): Promise<{ data: Lesson }> => {
  return apiAcademy.get(`/lessons/${slug}`);
};

export const getLessonQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ['lessons', slug],
    queryFn: () => getLesson({ slug }),
  });
};

type UseLessonOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getLessonQueryOptions>;
};

export const useLesson = ({ slug, queryConfig }: UseLessonOptions) => {
  return useQuery({
    ...getLessonQueryOptions(slug),
    ...queryConfig,
  });
};
