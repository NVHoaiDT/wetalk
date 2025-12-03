import { Image, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useCreatePostComment } from '../api/create-post-comment';

type CreateCommentProps = {
  postId: number;
  parentCommentId?: number;
  onSuccess?: () => void;
  placeholder?: string;
  minimized?: boolean;
};

// Helper function to check if HTML content is empty (only contains empty tags)
const isContentEmpty = (html: string): boolean => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return !text.trim();
};

export const CreatePostCommentFallback = ({
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
    if (isContentEmpty(content)) return;

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
        className={`relative rounded-lg border ${minimized ? 'border-transparent hover:border-gray-200' : 'border-gray-200'}`}
      >
        <TextEditor value={content} onChange={setContent} />
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
            disabled={
              isContentEmpty(content) || createPostCommentMutation.isPending
            }
            size="sm"
            className="rounded-full bg-gray-600 px-4"
          >
            {createPostCommentMutation.isPending ? (
              'Posting...'
            ) : (
              <div className="flex items-center">
                <Send className="mr-2 size-4" />
                Post
              </div>
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

export const UnauthenticatedFallback = ({ minimized = false }) => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Share your thoughts!"
      body="Sign up to join the conversation and post comments."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763795804/comment_v2xjak.jpg"
      triggerButton={
        <div
          className={`relative rounded-lg border ${minimized ? 'border-transparent hover:border-gray-200' : 'border-slate-300'} cursor-pointer bg-gray-50 p-8 transition-colors hover:bg-gray-100`}
        >
          <p className="text-sm text-gray-500">
            Sign up to join the conversation and post comments
          </p>
        </div>
      }
      confirmButton={
        <Link
          to={paths.auth.register.getHref(location.pathname)}
          replace
          className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      }
    ></ConfirmationDialog>
  );
};

export const CreatePostComment = ({
  postId,
  parentCommentId,
  onSuccess,
  placeholder,
  minimized = false,
}: CreateCommentProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <CreatePostCommentFallback
          postId={postId}
          parentCommentId={parentCommentId}
          onSuccess={onSuccess}
          placeholder={placeholder}
          minimized={minimized}
        />
      }
      unauthenticatedFallback={
        <UnauthenticatedFallback minimized={minimized} />
      }
    />
  );
};
