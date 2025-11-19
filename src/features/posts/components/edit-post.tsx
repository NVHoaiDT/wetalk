import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input } from '@/components/ui/form';
import { LinkPreview } from '@/components/ui/link-preview';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Post } from '@/types/api';

import { editPostInputSchema, useEditPost } from '../api/edit-post';

import { EditMediaUploader } from './edit-media-uploader';
import { EditPoll } from './edit-poll';
import { SelectPostTags } from './select-post-tags';

type EditPostProps = {
  post: Post;
};

export const EditPost = ({ post }: EditPostProps) => {
  const { addNotification } = useNotifications();
  const [activeTab] = useState<'text' | 'media' | 'link' | 'poll'>(
    post.type as any,
  );
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const editPostMutation = useEditPost({
    postId: post.id,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Updated',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Update Post',
          message: error.message,
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={editPostMutation.isSuccess}
      triggerButton={
        <Button
          size="sm"
          variant="outline"
          icon={<Pencil className="size-4" />}
          className="group relative flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
        >
          Edit Post
        </Button>
      }
      title="Edit your post"
      submitButton={
        <Button
          form="edit-post"
          type="submit"
          size="sm"
          isLoading={editPostMutation.isPending}
          disabled={isUploadingMedia || editPostMutation.isPending}
          className="min-w-[100px] border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          {isUploadingMedia ? 'Uploading...' : 'Update'}
        </Button>
      }
    >
      <Form
        id="edit-post"
        onSubmit={(values) => {
          editPostMutation.mutate({
            data: {
              ...values,
              postId: post.id,
              type: activeTab,
            },
          });
        }}
        schema={editPostInputSchema}
        options={{
          defaultValues: {
            postId: post.id,
            type: post.type,
            title: post.title,
            content: post.content,
            tags: post.tags || [],
            url: post.type === 'link' ? (post as any).url : undefined,
            mediaUrls: post.type === 'media' ? post.mediaUrls : undefined,
            pollData: post.type === 'poll' ? post.pollData : undefined,
          },
        }}
      >
        {({ register, formState, control, watch, setValue, getValues }) => {
          console.log('form errors', formState.errors);
          console.log('form values', getValues());
          return (
            <div className="space-y-6">
              {/* Tabs - Display only, based on post type */}
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  type="button"
                  disabled
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'text'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400'
                  }`}
                >
                  Text
                </button>
                <button
                  type="button"
                  disabled
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'media'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400'
                  }`}
                >
                  Images & Video
                </button>
                <button
                  type="button"
                  disabled
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'link'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400'
                  }`}
                >
                  Link
                </button>
                <button
                  type="button"
                  disabled
                  className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'poll'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-400'
                  }`}
                >
                  Poll
                </button>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500">
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
                <p className="text-xs leading-relaxed text-amber-700">
                  You cannot change the post type when editing.
                </p>
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

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <EditMediaUploader
                    value={watch('mediaUrls') || []}
                    onChange={(urls) => {
                      setValue('mediaUrls', urls as any);
                    }}
                    onUploadStateChange={(isUploading) => {
                      setIsUploadingMedia(isUploading);
                    }}
                    maxFiles={10}
                  />
                  {isUploadingMedia && (
                    <p className="text-sm text-blue-600">
                      Uploading media files...
                    </p>
                  )}
                </div>
              )}

              {/* Link Tab */}
              {activeTab === 'link' && (
                <div>
                  <Input
                    label="Link URL"
                    placeholder="https://example.com"
                    error={formState.errors['url'] as any}
                    className="rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    registration={register('url')}
                  />

                  <LinkPreview link={watch('url') || ''} />
                </div>
              )}

              {/* Poll Tab */}
              {activeTab === 'poll' && (
                <EditPoll
                  setValue={setValue as any}
                  errors={formState.errors as any}
                  initialPollData={post.pollData}
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
