import { ChevronUp } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useVotePostComment } from '../api/vote-post-comment';

type UpVotePostCommentProps = {
  commentId: number;
};

export const UpVotePostCommentFallback = ({
  commentId,
}: UpVotePostCommentProps) => {
  const { addNotification } = useNotifications();
  const votePostCommentMutation = useVotePostComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvoted Successfully',
        });
      },
    },
  });
  return (
    <button
      className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
      onClick={() => votePostCommentMutation.mutate({ commentId, vote: true })}
    >
      <ChevronUp className="size-5" />
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the conversation!"
      body="Sign up to upvote comments and support helpful contributions."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
      triggerButton={
        <button className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
          <ChevronUp className="size-5" />
        </button>
      }
      confirmButton={
        <Link
          to={paths.auth.register.getHref(location.pathname)}
          replace
          className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      }
    ></ConfirmationDialog>
  );
};

export const UpVotePostComment = ({ commentId }: UpVotePostCommentProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <UpVotePostCommentFallback commentId={commentId} />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
