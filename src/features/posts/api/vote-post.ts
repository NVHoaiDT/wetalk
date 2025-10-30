import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const votePost = ({ postId }: { postId: string }) => {
  return api.post(`/posts/${postId}/vote`);
};

type UseVotePostOptions = {
  mutationConfig?: MutationConfig<typeof votePost>;
};
