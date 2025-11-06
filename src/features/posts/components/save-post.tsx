import { Bookmark } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';

import { useSavePost } from '../api/save-post';

export const SavePost = ({ postId }: { postId: number }) => {
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
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
      onClick={() => savePostMutation.mutate({ postId })}
    >
      <Bookmark className="size-4" />
      <span>Save</span>
    </button>
  );
};
