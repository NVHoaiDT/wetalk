import { ArrowBigUpDash } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';
import { cn } from '@/utils/cn';

import { useUnvotePost } from '../api/unvote-posts';
import { useVotePost } from '../api/vote-post';

type UpVotePostProps = {
  postId: number;
  isVoted?: boolean;
};

export const UpVotePostFallback = ({ postId, isVoted }: UpVotePostProps) => {
  const { addNotification } = useNotifications();
  const votePostMutation = useVotePost({
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Upvoted Successfully',
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
          title: 'Upvote Removed Successfully',
        });
      },
    },
  });

  const isUpVoted = isVoted === true;

  const handleClick = () => {
    if (isUpVoted) {
      unvotePostMutation.mutate({ postId });
    } else {
      votePostMutation.mutate({ postId, vote: true });
    }
  };

  return (
    <button
      className={cn(
        'rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500',
        isUpVoted && 'text-green-500',
      )}
      onClick={handleClick}
      disabled={votePostMutation.isPending || unvotePostMutation.isPending}
    >
      <ArrowBigUpDash className="size-5" />
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the conversation!"
      body="Sign up to upvote posts and support content you like."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
      triggerButton={
        <button className="rounded text-gray-500 transition-colors hover:bg-green-50 hover:text-green-500">
          <ArrowBigUpDash className="size-5" />
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

export const UpVotePost = ({ postId, isVoted }: UpVotePostProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <UpVotePostFallback postId={postId} isVoted={isVoted} />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
