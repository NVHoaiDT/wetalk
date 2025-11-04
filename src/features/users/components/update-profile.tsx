import { Edit2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useCurrentUser } from '@/lib/auth';

import {
  updateProfileInputSchema,
  useUpdateProfile,
} from '../api/update-profile';

export const UpdateProfile = () => {
  const user = useCurrentUser();
  const { addNotification } = useNotifications();
  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button
          className="group relative inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
          icon={<Edit2 className="size-4" />}
          size="lg"
        >
          Update Profile
        </Button>
      }
      title="Update Profile"
      submitButton={
        <Button
          form="update-profile"
          type="submit"
          size="sm"
          isLoading={updateProfileMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="update-profile"
        onSubmit={(values) => {
          updateProfileMutation.mutate({ data: values });
        }}
        options={{
          defaultValues: {
            firstName: user.data?.firstName ?? '',
            lastName: user.data?.lastName ?? '',
            email: user.data?.email ?? '',
            bio: user.data?.bio ?? '',
          },
        }}
        schema={updateProfileInputSchema}
      >
        {({ register, formState }) => (
          <>
            <Input
              label="First Name"
              error={formState.errors['firstName']}
              registration={register('firstName')}
            />
            <Input
              label="Last Name"
              error={formState.errors['lastName']}
              registration={register('lastName')}
            />
            <Input
              label="Email Address"
              type="email"
              error={formState.errors['email']}
              registration={register('email')}
            />

            <Textarea
              label="Bio"
              error={formState.errors['bio']}
              registration={register('bio')}
            />
          </>
        )}
      </Form>
    </FormDrawer>
  );
};
