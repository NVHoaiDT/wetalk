import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';
import { useCurrentUser } from '@/lib/auth';

import {
  createTopicInputSchema,
  CreateTopicInput,
  useCreateTopic,
} from '../api/create-topic';

type CreateTopicProps = {
  onSuccess: () => void;
};

export const CreateTopic = ({ onSuccess }: CreateTopicProps) => {
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.data;
  const { addNotification } = useNotifications();

  const createTopicMutation = useCreateTopic({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Topic Created',
          message: 'Your topic has been created successfully.',
        });
        onSuccess();
      },
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTopicInput>({
    resolver: zodResolver(createTopicInputSchema),
    defaultValues: {
      author: {
        userId: currentUser?.id,
        avatar: currentUser?.avatar || '',
        name: currentUser?.username || '',
      },
    },
  });

  const onSubmit = (data: CreateTopicInput) => {
    createTopicMutation.mutate({ data });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Create New Topic
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Go Programming Fundamentals"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
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
            type="submit"
            disabled={createTopicMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {createTopicMutation.isPending ? 'Creating...' : 'Create Topic'}
          </button>
        </div>
      </form>
    </div>
  );
};
