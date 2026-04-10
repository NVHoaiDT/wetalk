import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { useNotifications } from '@/components/ui/notifications';

import { useDeleteLesson } from '../api/delete-lesson';

type DeleteLessonProps = {
  lessonSlug: string;
  topicSlug: string;
  title: string;
};

export const DeleteLesson = ({
  lessonSlug,
  topicSlug,
  title,
}: DeleteLessonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { addNotification } = useNotifications();

  const deleteLessonMutation = useDeleteLesson({
    topicSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Lesson Deleted',
          message: 'Lesson has been deleted successfully.',
        });
        setShowConfirm(false);
      },
    },
  });

  if (!showConfirm) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
        title="Delete lesson"
      >
        <Trash2 className="size-4" />
      </button>
    );
  }

  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="mb-3 text-sm text-red-800">
        Delete <strong>{title}</strong>? This will also remove its content.
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
          onClick={() => deleteLessonMutation.mutate({ slug: lessonSlug })}
          disabled={deleteLessonMutation.isPending}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800 disabled:opacity-50"
        >
          {deleteLessonMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
