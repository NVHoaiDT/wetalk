import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useNotifications } from '@/components/ui/notifications';

import {
  useUpdateLesson,
  updateLessonInputSchema,
  UpdateLessonInput,
} from '../api/update-lesson';

type EditLessonProps = {
  lessonSlug: string;
  topicSlug: string;
  currentTitle: string;
  currentOrderIndex: number;
  onSuccess: () => void;
};

export const EditLesson = ({
  lessonSlug,
  topicSlug,
  currentTitle,
  currentOrderIndex,
  onSuccess,
}: EditLessonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { addNotification } = useNotifications();

  const updateLessonMutation = useUpdateLesson({
    lessonSlug,
    topicSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Lesson Updated',
          message: 'Lesson has been updated successfully.',
        });
        setIsEditing(false);
        onSuccess();
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateLessonInput>({
    resolver: zodResolver(updateLessonInputSchema),
    defaultValues: {
      title: currentTitle,
      orderIndex: currentOrderIndex,
    },
  });

  const onSubmit = (data: UpdateLessonInput) => {
    updateLessonMutation.mutate({ slug: lessonSlug, data });
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <Pencil className="size-3" /> Edit
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Edit Lesson</h4>
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            reset();
          }}
          className="rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="size-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Order Index
          </label>
          <input
            type="number"
            {...register('orderIndex', { valueAsNumber: true })}
            className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.orderIndex && (
            <p className="mt-1 text-xs text-red-600">
              {errors.orderIndex.message}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updateLessonMutation.isPending}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {updateLessonMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              reset();
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
