import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiAcademy } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getContentQueryOptions } from './get-content';

const contentSectionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    content: z.string().min(1, 'Content is required'),
  }),
  z.object({
    type: z.literal('code'),
    content: z.string().min(1, 'Code content is required'),
    language: z.string().min(1, 'Language is required'),
  }),
  z.object({
    type: z.literal('media'),
    url: z.string().min(1, 'URL is required'),
  }),
]);

export const createContentInputSchema = z.object({
  sections: z
    .array(contentSectionSchema)
    .min(1, 'At least one section is required'),
});

export type CreateContentInput = z.infer<typeof createContentInputSchema>;

export const createContent = ({
  lessonSlug,
  data,
}: {
  lessonSlug: string;
  data: CreateContentInput;
}): Promise<{ success: boolean; message: string }> => {
  return apiAcademy.post(`/lessons/${lessonSlug}/content`, data);
};

type UseCreateContentOptions = {
  lessonSlug: string;
  mutationConfig?: MutationConfig<typeof createContent>;
};

export const useCreateContent = ({
  lessonSlug,
  mutationConfig,
}: UseCreateContentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getContentQueryOptions(lessonSlug).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createContent,
  });
};
