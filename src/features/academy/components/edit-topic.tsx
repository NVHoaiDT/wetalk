import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';

import {
  updateTopicInputSchema,
  UpdateTopicInput,
  useUpdateTopic,
} from '../api/update-topic';

type EditTopicProps = {
  slug: string;
  currentTitle: string;
  currentDescription: string;
};

export const EditTopic = ({
  slug,
  currentTitle,
  currentDescription,
}: EditTopicProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { addNotification } = useNotifications();

  const updateTopicMutation = useUpdateTopic({
    slug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Topic Updated',
          message: 'Topic has been updated successfully.',
        });
        setIsEditing(false);
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateTopicInput>({
    resolver: zodResolver(updateTopicInputSchema),
    defaultValues: {
      title: currentTitle,
      description: currentDescription,
    },
  });

  const onSubmit = (data: UpdateTopicInput) => {
    updateTopicMutation.mutate({ slug, data });
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Edit Topic</h3>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="size-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextEditor
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.description}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateTopicMutation.isPending}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {updateTopicMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};
