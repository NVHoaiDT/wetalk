import { Edit, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDrawer,
  Input,
  Switch,
  Textarea,
} from '@/components/ui/form';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';
/* import { Authorization, ROLES } from '@/lib/authorization'; */
import { fancyLog } from '@/helper/fancy-log';

import { useCommunity } from '../api/get-community';
import {
  updateCommunityInputSchema,
  useUpdateCommunity,
} from '../api/update-community';

import { SearchTopics } from './search-topics';

export const UpdateCommunity = ({ communityId }: { communityId: number }) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const { addNotification } = useNotifications();

  const updateCommunityMutation = useUpdateCommunity({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Community Updated',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Creating Community',
          message: error.message,
        });
      },
    },
  });

  const communityQuery = useCommunity({ communityId });
  const community = communityQuery?.data?.data;
  if (!community) return null;

  return (
    /* <Authorization allowedRoles={[ROLES.ADMIN]}> */
    <FormDrawer
      isDone={updateCommunityMutation.isSuccess}
      triggerButton={
        <button className="flex w-full flex-row justify-start gap-2 border-b border-gray-200 px-2 py-1.5 text-sm font-normal">
          <Edit className="size-4" />
          Appearance
        </button>
      }
      title="Update Community"
      submitButton={
        <Button
          form="update-community"
          type="submit"
          size="sm"
          isLoading={updateCommunityMutation.isPending}
          disabled={
            isUploadingAvatar ||
            isUploadingCoverImage ||
            updateCommunityMutation.isPending
          }
          className="min-w-[100px] border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          {isUploadingAvatar
            ? 'Uploading Avatar...'
            : isUploadingCoverImage
              ? 'Uploading Cover...'
              : 'Submit'}
        </Button>
      }
    >
      <Form
        id="update-community"
        onSubmit={(values) => {
          fancyLog('Update-Community-Values', values);
          updateCommunityMutation.mutate({ data: values, communityId });
        }}
        schema={updateCommunityInputSchema}
        options={{
          defaultValues: {
            name: community.name,
            shortDescription: community.shortDescription,
            description: community.description,
            communityAvatar: community.communityAvatar || undefined,
            coverImage: community.coverImage || undefined,
            topics: community.topic || [],
            isPrivate: community.isPrivate,
          },
        }}
      >
        {({ register, control, formState, setValue, watch }) => (
          <>
            {formState.errors && fancyLog('Error ?', formState.errors)}
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

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Description
                  </div>
                  <TextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    error={formState.errors['description']}
                  />
                  {formState.errors['description'] && (
                    <p className="text-sm text-red-600">
                      {formState.errors['description']?.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Topics Selection */}
            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <SearchTopics
                  value={field.value || []}
                  onChange={field.onChange}
                  error={formState.errors['topics'] as any}
                  label="Topics"
                />
              )}
            />

            {/* Community Avatar */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Community Avatar
              </div>

              {/* Avatar Preview */}
              {watch('communityAvatar') && (
                <div className="relative mb-3 flex justify-center">
                  <div className="group relative size-32 overflow-hidden rounded-full border-4 border-gray-200 shadow-lg transition-all duration-300 hover:border-blue-400">
                    <img
                      key={watch('communityAvatar')}
                      src={watch('communityAvatar')}
                      alt="Community Avatar"
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
                value={
                  watch('communityAvatar')
                    ? [watch('communityAvatar') as string]
                    : []
                }
                onChange={(urls) => {
                  if (urls.length > 0) {
                    setValue('communityAvatar', urls[0], {
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

              {formState.errors['communityAvatar'] && (
                <p className="text-sm text-red-600">
                  {formState.errors['communityAvatar']?.message}
                </p>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Cover Image
              </div>

              {/* Cover Image Preview */}
              {watch('coverImage') && (
                <div className="relative mb-3 flex justify-center">
                  <div className="group relative h-32 w-full overflow-hidden rounded-lg border-4 border-gray-200 shadow-lg transition-all duration-300 hover:border-blue-400">
                    <img
                      key={watch('coverImage')}
                      src={watch('coverImage')}
                      alt="Community Cover"
                      className="size-full object-cover transition-all duration-500 group-hover:scale-110"
                      style={{
                        animation: 'fadeIn 0.5s ease-in',
                      }}
                    />
                    {isUploadingCoverImage && (
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
                value={
                  watch('coverImage') ? [watch('coverImage') as string] : []
                }
                onChange={(urls) => {
                  if (urls.length > 0) {
                    setValue('coverImage', urls[0], {
                      shouldValidate: true,
                    });
                  }
                }}
                onUploadStateChange={(isUploading) => {
                  setIsUploadingCoverImage(isUploading);
                }}
                onError={(error) => {
                  addNotification({
                    type: 'error',
                    title: 'Upload Error',
                    message: error.message,
                  });
                }}
              />

              {formState.errors['coverImage'] && (
                <p className="text-sm text-red-600">
                  {formState.errors['coverImage']?.message}
                </p>
              )}
            </div>

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
