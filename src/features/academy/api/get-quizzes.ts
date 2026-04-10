import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAcademy } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { QuizSummary } from '@/types/api';

export const getQuizzesByLesson = ({
  lessonSlug,
}: {
  lessonSlug: string;
}): Promise<{ data: QuizSummary[] }> => {
  return apiAcademy.get(`/lessons/${lessonSlug}/quiz`);
};

export const getQuizzesByLessonQueryOptions = (lessonSlug: string) => {
  return queryOptions({
    queryKey: ['quizzes', 'lesson', lessonSlug],
    queryFn: () => getQuizzesByLesson({ lessonSlug }),
  });
};

type UseQuizzesByLessonOptions = {
  lessonSlug: string;
  queryConfig?: QueryConfig<typeof getQuizzesByLessonQueryOptions>;
};

export const useQuizzesByLesson = ({
  lessonSlug,
  queryConfig,
}: UseQuizzesByLessonOptions) => {
  return useQuery({
    ...getQuizzesByLessonQueryOptions(lessonSlug),
    ...queryConfig,
  });
};
