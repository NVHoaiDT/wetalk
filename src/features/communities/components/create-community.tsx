import { Plus } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Switch,
  Textarea,
} from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
/* import { Authorization, ROLES } from '@/lib/authorization'; */

import {
  createCommunityInputSchema,
  useCreateCommunity,
} from '../api/create-community';

export const CreateCommunity = () => {
  const { addNotification } = useNotifications();
  const createCommunityMutation = useCreateCommunity({
    mutationConfig: {
      onSuccess: () => {
        console.log('CREATED COMMUNITY SUCCESSFULLY');
        addNotification({
          type: 'success',
          title: 'Community Created',
        });
      },
    },
  });
  return (
    /* <Authorization allowedRoles={[ROLES.ADMIN]}> */
    <FormDrawer
      isDone={createCommunityMutation.isSuccess}
      triggerButton={
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Create Community
        </Button>
      }
      title="Create Community"
      submitButton={
        <Button
          form="create-community"
          type="submit"
          size="sm"
          isLoading={createCommunityMutation.isPending}
          className="min-w-[100px] border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Submit
        </Button>
      }
    >
      <Form
        id="create-community"
        onSubmit={(values) => {
          createCommunityMutation.mutate({ data: values });
        }}
        schema={createCommunityInputSchema}
        options={{
          defaultValues: {
            name: 'Test',
            shortDescription: 'Test',
            isPrivate: false,
          },
        }}
      >
        {({ register, control, formState }) => (
          <>
            <Input
              label="Name"
              error={formState.errors['name']}
              registration={register('name')}
              className="rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            <Textarea
              label="Short Description"
              error={formState.errors['shortDescription']}
              registration={register('shortDescription')}
              className="min-h-[100px] resize-none rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />

            {/* Private Community Toggle */}
            <div className="group relative overflow-hidden rounded-xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10">
              {/* Subtle animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-indigo-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 animate-pulse rounded-full bg-blue-500" />
                    <p className="text-sm font-bold text-blue-900">
                      Private Community ?
                    </p>
                  </div>
                  <span className="text-xs leading-relaxed text-blue-600/80">
                    Only approved members can view and participate in this
                    community
                  </span>
                </div>

                <Controller
                  name="isPrivate"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="shadow-lg transition-all duration-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:shadow-blue-500/50"
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}
      </Form>
    </FormDrawer>
    /* </Authorization> */
  );
};
