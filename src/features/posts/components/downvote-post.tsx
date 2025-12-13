import { ArrowBigDownDash } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';
import { cn } from '@/utils/cn';

import { useUnvotePost } from '../api/unvote-posts';
import { useVotePost } from '../api/vote-post';

type DownVotePostProps = {
  postId: number;
  isVoted?: boolean;
};

export const DownVotePostFallback = ({
  postId,
  isVoted,
}: DownVotePostProps) => {
  const { addNotification } = useNotifications();
  const votePostMutation = useVotePost({
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvoted Successfully',
        });
      },
    },
  });
  const unvotePostMutation = useUnvotePost({
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Downvote Removed Successfully',
        });
      },
    },
  });

  const isDownVoted = isVoted === false;

  const handleClick = () => {
    if (isDownVoted) {
      unvotePostMutation.mutate({ postId });
    } else {
      votePostMutation.mutate({ postId, vote: false });
    }
  };
  return (
    <button
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        isDownVoted && 'text-red-500',
      )}
      onClick={handleClick}
      disabled={votePostMutation.isPending || unvotePostMutation.isPending}
    >
      <ArrowBigDownDash className="size-5" />
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the conversation!"
      body="Sign up to share your feedback."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
      triggerButton={
        <button className="rounded text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500">
          <ArrowBigDownDash className="size-5" />
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

export const DownVotePost = ({ postId, isVoted }: DownVotePostProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <DownVotePostFallback postId={postId} isVoted={isVoted} />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
