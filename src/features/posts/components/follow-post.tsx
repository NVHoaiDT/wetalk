import { Bell } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useFollowPost } from '../api/follow-post';

type FollowPostProps = {
  postId: number;
};

export const FollowPostFallback = ({ postId }: FollowPostProps) => {
  const { addNotification } = useNotifications();
  const followPostMutation = useFollowPost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Followed Successfully',
        });
      },
    },
  });
  return (
    <button
      className="flex items-center gap-1.5 rounded-full p-2 transition-colors hover:bg-gray-100"
      onClick={() => followPostMutation.mutate({ postId })}
    >
      <Bell className="size-4" />
      <span>Follow</span>
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Stay updated!"
      body="Create an account to follow posts and get notified about new comments."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763793969/follow_oykl45.jpg"
      triggerButton={
        <button className="flex items-center gap-1.5 rounded-full p-2 transition-colors hover:bg-gray-100">
          <Bell className="size-4" />
          <span>Follow</span>
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

export const FollowPost = ({ postId }: FollowPostProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={<FollowPostFallback postId={postId} />}
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
