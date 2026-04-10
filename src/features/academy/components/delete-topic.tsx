import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';

import { useDeleteTopic } from '../api/delete-topic';

type DeleteTopicProps = {
  slug: string;
  title: string;
};

export const DeleteTopic = ({ slug, title }: DeleteTopicProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const deleteTopicMutation = useDeleteTopic({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Topic Deleted',
          message: 'Topic has been deleted successfully.',
        });
        navigate(paths.app.academy.getHref());
      },
    },
  });

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 className="size-4" />
        Delete
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="mb-3 text-sm text-red-800">
        Are you sure you want to delete <strong>{title}</strong>? This action
        cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => deleteTopicMutation.mutate({ slug })}
          disabled={deleteTopicMutation.isPending}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
        >
          {deleteTopicMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    </div>
  );
};
