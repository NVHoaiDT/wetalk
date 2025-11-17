import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input } from '@/components/ui/form';
import { LinkPreview } from '@/components/ui/link-preview';
import { MediaUploader } from '@/components/ui/media-uploader/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor/text-editor';

import { createPostInputSchema, useCreatePost } from '../api/create-post';

import { CreatePoll } from './create-poll';
import { SelectPostTags } from './select-post-tags';

type CreatePostProps = {
  communityId: number;
};

export const CreatePost = ({ communityId }: CreatePostProps) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<
    'text' | 'media' | 'link' | 'poll'
  >('text');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const createPostMutation = useCreatePost({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Created',
        });
        setMediaFiles([]);
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Create Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={createPostMutation.isSuccess}
      triggerButton={
        <Button
          size="lg"
          icon={<Plus className="size-4" />}
          className="group relative flex w-full items-center justify-center rounded-full border-2 border-blue-600 bg-white px-5 py-2 font-semibold text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md"
        >
          Create post
        </Button>
      }
      title="Share your thoughts !"
      submitButton={
        <Button
          form="create-post"
          type="submit"
          size="sm"
          isLoading={createPostMutation.isPending}
          className="min-w-[100px] border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Post
        </Button>
      }
    >
      <Form
        id="create-post"
        onSubmit={(values) => {
          createPostMutation.mutate({
            data: {
              ...values,
              type: activeTab,
            },
          });
        }}
        schema={createPostInputSchema}
        options={{
          defaultValues: {
            communityId: communityId,
            type: 'text',
            title: '',
            content: '',
            tags: [] as string[],
            url: undefined,
            mediaUrls: undefined,
            pollData: undefined,
          },
        }}
      >
        {({ register, formState, control, watch, setValue, getValues }) => {
          console.log('form errors', formState.errors);
          console.log('form values', getValues());
          return (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'text'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'media'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Images & Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('link')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'link'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('poll')}
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'poll'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Poll
                </button>
              </div>

              {/* Title Input */}
              <div>
                <Input
                  label="Title"
                  placeholder="An interesting title..."
                  error={formState.errors['title']}
                  className="rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  registration={register('title')}
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {watch('title')?.length || 0}/300
                </div>
              </div>

              {activeTab === 'media' && (
                <MediaUploader
                  onChange={(urls) => {
                    // Update form field
                    setValue('mediaUrls', urls as any);
                  }}
                  onError={(error) => {
                    addNotification({
                      type: 'error',
                      title: 'Upload Failed',
                      message: error.message,
                    });
                  }}
                  value={watch('mediaUrls')}
                  maxFiles={10}
                  accept={{ images: true, videos: true }}
                  className="space-y-4"
                />
              )}

              {/* Scaffold for link*/}
              {activeTab === 'link' && (
                <div>
                  <Input
                    label="Link URL"
                    placeholder="https://example.com"
                    error={formState.errors['url']}
                    className="rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    registration={register('url')}
                  />

                  <LinkPreview link={watch('url') || ''} />
                </div>
              )}

              {/* Poll Tab */}
              {activeTab === 'poll' && (
                <CreatePoll
                  setValue={setValue as any}
                  errors={formState.errors}
                />
              )}

              {/* Rich Text Editor for content */}
              <div className="space-y-2">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      error={formState.errors['content']}
                    />
                  )}
                />
                {formState.errors['content'] && (
                  <p className="text-sm text-red-500">
                    {formState.errors['content'].message}
                  </p>
                )}
              </div>

              {/* Tags Input */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <SelectPostTags
                    value={field.value}
                    onChange={field.onChange}
                    error={formState.errors['tags'] as any}
                    label="Tags"
                  />
                )}
              />

              {/* Info Box */}
              <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500">
                  <svg
                    className="size-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs leading-relaxed text-blue-700">
                  Remember to follow community guidelines. Be respectful and
                  constructive in your posts.
                </p>
              </div>
            </div>
          );
        }}
      </Form>
    </FormDrawer>
  );
};
