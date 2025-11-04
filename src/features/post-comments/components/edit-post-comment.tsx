import { Pencil } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MDPreview } from '@/components/ui/md-preview';
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
  const [mediaUrl, setMediaUrl] = useState(initialMediaUrl || '');
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
        content,
        mediaUrl,
      },
      commentId: id,
    });
  };

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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-md border p-4">
              {/* <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] w-full resize-none border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                placeholder="Edit your comment..."
              /> */}
              <TextEditor value={content} onChange={setContent} />
              <div className="mt-2 border-t pt-2">
                <p className="text-sm text-gray-500">Preview:</p>
                <MDPreview value={content} />
              </div>
            </div>

            <MediaUploader
              mode="replace"
              value={mediaUrl ? [mediaUrl] : []}
              onChange={(urls) => setMediaUrl(urls[0] || '')}
              maxFiles={1}
              maxSize={5}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={editPostCommentMutation.isPending || !content.trim()}
              >
                {editPostCommentMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
