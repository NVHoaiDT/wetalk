/* 
    Endpoint: POST /comments/:id/report
    Request Body:
    {
        "reasons": ["Racism","Hate Speech", "...", "..."],
        "note": "Please review this comment" // optional
    }
    Response: 
    {
        "success": true,
        "message": "Comment reported successfully"
    }
        
*/

import { useQueryClient, useMutation } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const reportCommentInput = z.object({
  commentId: z.number(),
  reasons: z.array(z.string()).min(1).max(5),
  note: z.string().max(500).optional(),
});

export type ReportCommentInput = z.infer<typeof reportCommentInput>;

export const reportComment = (data: ReportCommentInput) => {
  return api.post(`/comments/${data.commentId}/report`, data);
};

type UseReportCommentOptions = {
  mutationConfig?: MutationConfig<typeof reportComment>;
};

export const useReportComment = ({
  mutationConfig,
}: UseReportCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['reported-comments'] });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: reportComment,
  });
};
