import { ArchiveX } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';

import { useInfinitePostComments } from '../api/get-post-comments';

type PostCommentsListProps = {
  postId: number;
};

export const PostCommentsList = ({ postId }: PostCommentsListProps) => {
  const postCommentsQuery = useInfinitePostComments({ postId });

  if (postCommentsQuery.isLoading)
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  const comments = postCommentsQuery.data?.pages.flatMap((page) => page.data);
  if (!comments?.length)
    return (
      <div
        role="list"
        aria-label="post-comments"
        className="flex h-40 flex-col items-center justify-center bg-white text-gray-500"
      >
        <ArchiveX className="size-10" />
        <h4>No Comments Found</h4>
      </div>
    );

  fancyLog('PostCommentsList:', comments);
  return <div>PostCommentsList</div>;
};
