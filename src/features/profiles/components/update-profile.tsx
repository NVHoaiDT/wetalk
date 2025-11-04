import { Edit, Loader2 } from 'lucide-react';
import { useState } from 'react';

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
          disabled={isUploadingAvatar || updateProfileMutation.isPending}
        >
          {isUploadingAvatar ? 'Uploading Avatar...' : 'Submit'}
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

                {/* Avatar Preview */}
                {avatarUrl && (
                  <div className="relative mb-3 flex justify-center">
                    <div className="group relative size-32 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transition-all duration-300 hover:border-blue-400">
                      <img
                        key={avatarUrl}
                        src={avatarUrl}
                        alt="Profile Avatar"
                        className="size-full object-cover transition-all duration-500 group-hover:scale-110"
                        style={{
                          animation: 'fadeIn 0.5s ease-in',
                        }}
                      />
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <Loader2 className="size-8 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <MediaUploader
                  mode="replace"
                  maxFiles={1}
                  accept={{ images: true, videos: false }}
                  maxSize={5 * 1024 * 1024}
                  value={avatarUrl ? [avatarUrl] : []}
                  onChange={(urls) => {
                    if (urls.length > 0) {
                      setValue('avatar', urls[0], {
                        shouldValidate: true,
                      });
                    }
                  }}
                  onUploadStateChange={(isUploading) => {
                    setIsUploadingAvatar(isUploading);
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
