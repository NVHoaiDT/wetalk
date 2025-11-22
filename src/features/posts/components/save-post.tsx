import { Bookmark } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useSavePost } from '../api/save-post';

type SavePostProps = {
  postId: number;
};

export const SavePostFallback = ({ postId }: SavePostProps) => {
  const { addNotification } = useNotifications();
  const savePostMutation = useSavePost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Saved Successfully',
        });
      },
    },
  });
  return (
    <button
      className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100"
      onClick={() => savePostMutation.mutate({ postId })}
    >
      <Bookmark className="size-4" />
      <span>Save</span>
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Save posts for later!"
      body="Create an account to save posts and access them anytime."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763794173/save_jmhhpw.jpg"
      triggerButton={
        <button className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100">
          <Bookmark className="size-4" />
          <span>Save</span>
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

export const SavePost = ({ postId }: SavePostProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={<SavePostFallback postId={postId} />}
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
