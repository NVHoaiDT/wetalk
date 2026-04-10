import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useNotifications } from '@/components/ui/notifications';

import {
  createLessonInputSchema,
  CreateLessonInput,
  useCreateLesson,
} from '../api/create-lesson';

type CreateLessonProps = {
  topicSlug: string;
  nextOrderIndex: number;
  onSuccess: () => void;
};

export const CreateLesson = ({
  topicSlug,
  nextOrderIndex,
  onSuccess,
}: CreateLessonProps) => {
  const { addNotification } = useNotifications();

  const createLessonMutation = useCreateLesson({
    topicSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Lesson Created',
          message: 'Your lesson has been created successfully.',
        });
        onSuccess();
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLessonInput>({
    resolver: zodResolver(createLessonInputSchema),
    defaultValues: {
      topicSlug,
      orderIndex: nextOrderIndex,
    },
  });

  const onSubmit = (data: CreateLessonInput) => {
    createLessonMutation.mutate({ data });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Add New Lesson
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Introduction to Variables"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Order Index
          </label>
          <input
            type="number"
            {...register('orderIndex', { valueAsNumber: true })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.orderIndex && (
            <p className="mt-1 text-xs text-red-500">
              {errors.orderIndex.message}
            </p>
          )}
        </div>

        <input type="hidden" {...register('topicSlug')} />

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={createLessonMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {createLessonMutation.isPending ? 'Creating...' : 'Add Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};
