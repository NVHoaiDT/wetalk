/* 
    Endpoint: POST /posts/:id/report
    
    Body: 
    {
        "reasons": ["Racism", "hate speech", "...", "..."],
        "note": "reporter notes" // optional
    }
    Response: 
    {
        "success": true,
        "message": "Post saved successfully"
    }
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const reportPostInputSchema = z.object({
  postId: z.number(),
  reasons: z.array(z.string()).min(1).max(5),
  note: z.string().max(500).optional(),
});

export type ReportPostInput = z.infer<typeof reportPostInputSchema>;

export const reportPost = (data: ReportPostInput) => {
  return api.post(`/posts/${data.postId}/report`, data);
};

type UseReportPostOptions = {
  mutationConfig?: MutationConfig<typeof reportPost>;
};

export const useReportPost = ({ mutationConfig }: UseReportPostOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['reported-posts'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: reportPost,
  });
};
