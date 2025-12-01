import { Image, Pencil, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';

import { useEditPostComment } from '../api/edit-post-comment';

type EditPostCommentProps = {
  id: number;
  postId: number;
  initialContent: string;
  initialMediaUrl?: string;
  onClose?: () => void;
};

export const EditPostComment = ({
  id,
  postId,
  initialContent,
  initialMediaUrl,
  onClose,
}: EditPostCommentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [mediaUrl, setMediaUrl] = useState(initialMediaUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const { addNotification } = useNotifications();

  const editPostCommentMutation = useEditPostComment({
    postId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Updated',
          message: 'Your comment has been successfully updated',
        });
        setIsOpen(false);
        onClose?.();
      },
    },
  });

  const handleEdit = () => {
    if (!content.trim()) return;

    editPostCommentMutation.mutate({
      data: {
        content: content.trim(),
        mediaUrl,
      },
      commentId: id,
    });
  };

  const isSubmitDisabled =
    !content.trim() || editPostCommentMutation.isPending || isUploading;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center px-2 py-1.5 text-sm"
      >
        <Pencil className="mr-2 size-4" />
        <span>Edit</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-xl"
          onKeyDown={(e) => {
            // Prevent dialog from closing when space is pressed in editor
            if (e.key === ' ') {
              e.stopPropagation();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <TextEditor value={content} onChange={setContent} />

            {mediaUrl && (
              <div className="relative">
                <img
                  src={mediaUrl}
                  alt="Comment media"
                  className="max-h-60 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-500 hover:text-red-600"
                  onClick={() => setMediaUrl(undefined)}
                  disabled={isUploading}
                >
                  <div className="flex items-center">
                    <X className="mr-1 size-4" />
                    Remove image
                  </div>
                </Button>
              </div>
            )}

            {!mediaUrl && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="py-4"
                onClick={() => setIsUploaderOpen(true)}
                disabled={isUploading}
              >
                <div className="flex items-center">
                  <Image className="mr-2 size-4" />
                  Add image
                </div>
              </Button>
            )}

            {isUploaderOpen && (
              <div className="rounded-lg border p-4">
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
                  onUploadStateChange={setIsUploading}
                  maxFiles={1}
                  value={mediaUrl ? [mediaUrl] : []}
                  accept={{ images: true, videos: false }}
                />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading || editPostCommentMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitDisabled}>
                {editPostCommentMutation.isPending
                  ? 'Saving...'
                  : isUploading
                    ? 'Uploading...'
                    : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
