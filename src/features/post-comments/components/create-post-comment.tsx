import { Image, Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';

import { useCreatePostComment } from '../api/create-post-comment';

type CreateCommentProps = {
  postId: number;
  parentCommentId?: number;
  onSuccess?: () => void;
  placeholder?: string;
  minimized?: boolean;
};

export const CreatePostComment = ({
  postId,
  parentCommentId,
  onSuccess,
  minimized = false,
}: CreateCommentProps) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string>();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const { addNotification } = useNotifications();
  const createPostCommentMutation = useCreatePostComment({
    postId,
    mutationConfig: {
      onSuccess: () => {
        setContent('');
        setMediaUrl(undefined);
        addNotification({
          type: 'success',
          title: 'Comment posted successfully',
        });
        onSuccess?.();
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createPostCommentMutation.mutate({
      data: {
        postId,
        content: content.trim(),
        parentCommentId,
        mediaUrl,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`relative rounded-lg border bg-white ${minimized ? 'border-transparent hover:border-gray-200' : 'border-gray-200'}`}
      >
        <TextEditor value={content} onChange={setContent} />
        {/* <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[80px] w-full resize-none border-none bg-transparent p-4 focus:ring-0 ${minimized ? 'h-10 min-h-0 py-2' : ''}`}
        /> */}
        {mediaUrl && (
          <div className="mx-4 mb-4 mt-2">
            <img
              src={mediaUrl}
              alt="Uploaded media"
              className="max-h-60 rounded object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-red-500 hover:text-red-600"
              onClick={() => setMediaUrl(undefined)}
            >
              Remove image
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-gray-100 p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-blue-600"
            onClick={() => setIsUploaderOpen(true)}
          >
            <Image className="size-5" />
          </Button>
          <Button
            type="submit"
            disabled={!content.trim() || createPostCommentMutation.isPending}
            size="sm"
            className="rounded-full px-4"
          >
            {createPostCommentMutation.isPending ? (
              'Posting...'
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>

      {isUploaderOpen && (
        <div className="mt-4">
          <MediaUploader
            mode="replace"
            onChange={(urls) => {
              if (urls.length > 0) {
                setMediaUrl(urls[0]);
              }
              setIsUploaderOpen(false);
            }}
            onError={(error) => {
              addNotification({
                type: 'error',
                title: 'Upload Failed',
                message: error.message,
              });
            }}
            maxFiles={1}
            value={mediaUrl ? [mediaUrl] : []}
            accept={{ images: true, videos: false }}
          />
        </div>
      )}
    </form>
  );
};
