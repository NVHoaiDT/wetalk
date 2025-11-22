import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useVotePostComment } from '../api/vote-post-comment';

type DownVotePostCommentProps = {
  commentId: number;
};

export const DownVotePostCommentFallback = ({
  commentId,
}: DownVotePostCommentProps) => {
  const { addNotification } = useNotifications();
  const votePostCommentMutation = useVotePostComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvoted Successfully',
        });
      },
    },
  });
  return (
    <button
      className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
      onClick={() => votePostCommentMutation.mutate({ commentId, vote: false })}
    >
      <ChevronDown className="size-5" />
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the conversation!"
      body="Sign up to downvote comments and share your feedback."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
      triggerButton={
        <button className="rounded text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
          <ChevronDown className="size-5" />
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

export const DownVotePostComment = ({
  commentId,
}: DownVotePostCommentProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <DownVotePostCommentFallback commentId={commentId} />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
