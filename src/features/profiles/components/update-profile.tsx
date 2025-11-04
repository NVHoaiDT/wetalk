import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';
import { useCurrentUser } from '@/lib/auth';

import {
  updateProfileInputSchema,
  useUpdateProfile,
} from '../api/update-profile';

export const UpdateProfile = () => {
  const { addNotification } = useNotifications();
  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
        });
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Error Updating Profile',
        });
      },
    },
  });
  const userQuery = useCurrentUser();
  const user = userQuery.data?.data;

  if (userQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <FormDrawer
      isDone={updateProfileMutation.isSuccess}
      triggerButton={
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          icon={<Edit className="size-4" />}
        >
          Edit Profile
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
          fancyLog('Form-Values:', values);
          updateProfileMutation.mutate({ data: values });
        }}
        options={{
          defaultValues: {
            username: user?.username ?? '',
            avatar: user?.avatar ?? '',
            bio: user?.bio ?? '',
          },
        }}
        schema={updateProfileInputSchema}
      >
        {({ register, formState, setValue, watch }) => {
          const avatarUrl = watch('avatar');
          fancyLog('Avatar-URL:', avatarUrl);
          return (
            <>
              <Input
                label="Username"
                error={formState.errors['username']}
                registration={register('username')}
              />
              <Textarea
                label="Bio"
                error={formState.errors['bio']}
                registration={register('bio')}
              />

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Avatar</div>

                <MediaUploader
                  maxFiles={1}
                  accept={{ images: true, videos: false }}
                  maxSize={5 * 1024 * 1024}
                  value={avatarUrl ? [avatarUrl] : []}
                  onChange={(urls) => {
                    if (urls.length > 0) {
                      fancyLog('All-Avatar-URLs:', urls);
                      fancyLog('New-Avatar-URL:', urls[urls.length - 1]);
                      setValue('avatar', urls[urls.length - 1], {
                        shouldValidate: true,
                      });
                    }
                  }}
                  onError={(error) => {
                    addNotification({
                      type: 'error',
                      title: 'Upload Error',
                      message: error.message,
                    });
                  }}
                />

                {formState.errors['avatar'] && (
                  <p className="text-sm text-red-600">
                    {formState.errors['avatar']?.message}
                  </p>
                )}
              </div>
            </>
          );
        }}
      </Form>
    </FormDrawer>
  );
};
