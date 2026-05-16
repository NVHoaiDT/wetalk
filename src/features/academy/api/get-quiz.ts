import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Quiz } from '@/types/api';

export const getQuiz = ({ id }: { id: string }): Promise<{ data: Quiz }> => {
  return apiAcademy.get(`/quizzes/${id}`);
};

export const getQuizQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['quizzes', id],
    queryFn: () => getQuiz({ id }),
  });
};

type UseQuizOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getQuizQueryOptions>;
};

export const useQuiz = ({ id, queryConfig }: UseQuizOptions) => {
  return useQuery({
    ...getQuizQueryOptions(id),
    ...queryConfig,
  });
};
