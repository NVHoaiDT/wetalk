import { Plus, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { fancyLog } from '@/helper/fancy-log';

import { createPostInputSchema, useCreatePost } from '../api/create-post';

type CreatePostProps = {
  communityId: number;
};

export const CreatePost = ({ communityId }: CreatePostProps) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<
    'text' | 'media' | 'link' | 'poll'
  >('text');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FormDrawer
      isDone={createPostMutation.isSuccess}
      triggerButton={
        <Button
          size="sm"
          icon={<Plus className="size-4" />}
          className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Create Post
        </Button>
      }
      title="Create Post"
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
          fancyLog('Create-Post-Values', values);
        }}
        schema={createPostInputSchema}
        options={{
          defaultValues: {
            community_id: communityId,
            type: 'text',
            title: '',
            content: '',
            tags: [],
            media_urls: [],
          },
        }}
      >
        {({ register, formState, control, watch }) => {
          console.log('form errors', formState.errors);

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
                  registration={register('title')}
                  className="rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {watch('title')?.length || 0}/300
                </div>
              </div>

              {/* Media Upload Section (only for Images & Video tab) */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="media-upload"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="media-upload"
                      className="flex cursor-pointer flex-col items-center justify-center py-12"
                    >
                      <Upload className="mb-3 size-10 text-gray-400" />
                      <p className="mb-1 text-sm font-medium text-gray-700">
                        Drag and Drop or upload media
                      </p>
                      <p className="text-xs text-gray-500">
                        Images and videos supported
                      </p>
                    </label>
                  </div>
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {mediaFiles.map((file, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                        >
                          {file.type.startsWith('image/') ? (
                            <>
                              <ImageIcon className="absolute left-2 top-2 z-10 size-4 text-white" />
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="h-24 w-full object-cover"
                              />
                            </>
                          ) : (
                            <>
                              <Video className="absolute left-2 top-2 z-10 size-4 text-white" />
                              <video
                                src={URL.createObjectURL(file)}
                                className="h-24 w-full object-cover"
                              >
                                {' '}
                                <track
                                  kind="captions"
                                  src="/captions/example.vtt"
                                  srcLang="en"
                                  label="English"
                                  default
                                />
                                Your browser does not support the video tag.
                              </video>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-lg transition-opacity hover:bg-red-600 group-hover:opacity-100"
                          >
                            <X className="size-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content Textarea */}
              <Textarea
                label="Body text (optional)"
                placeholder="What are your thoughts?"
                error={formState.errors['content']}
                registration={register('content')}
                className="min-h-[120px] resize-none rounded-lg border-blue-200 bg-white text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              {/* Tags Input */}
              <div className="space-y-2">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  + Add tags
                </button>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {field.value?.map((tag: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = field.value.filter(
                                (_: string, i: number) => i !== index,
                              );
                              field.onChange(newTags);
                            }}
                            className="hover:text-blue-900"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

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
