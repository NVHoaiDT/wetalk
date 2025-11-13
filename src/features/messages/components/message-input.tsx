import { Image, Send, X } from 'lucide-react';
import { FormEvent, KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { fancyLog } from '@/helper/fancy-log';
import { cn } from '@/utils/cn';

type MessageInputProps = {
  onSend: (content: string, attachments?: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const MessageInput = ({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    // Allow sending if there's either content or attachments
    if ((!trimmed && attachments.length === 0) || disabled || isUploading)
      return;

    fancyLog('Submitting message:', { trimmed, attachments });

    onSend(trimmed, attachments);
    setContent('');
    setAttachments([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((url, index) => {
            const isVideo = url.includes('videos/') || url.endsWith('.mp4');
            return (
              <div key={url} className="group relative">
                <div className="size-16 overflow-hidden rounded-lg border border-gray-200">
                  {isVideo ? (
                    <video
                      src={url}
                      className="size-full object-cover"
                      preload="metadata"
                    >
                      <track kind="captions" />
                    </video>
                  ) : (
                    <img
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                  className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-lg transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <X className="size-3 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Media Uploader Dialog */}
      {isUploaderOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Upload Media</h4>
            <button
              type="button"
              onClick={() => setIsUploaderOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="size-4" />
            </button>
          </div>
          <MediaUploader
            onChange={(urls) => {
              setAttachments(urls);
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
            maxFiles={5}
            value={attachments}
            accept={{ images: true, videos: true }}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsUploaderOpen(!isUploaderOpen)}
          disabled={disabled || isUploading}
          className="size-10 shrink-0 text-gray-500 hover:text-blue-500"
        >
          <Image className="size-5" />
        </Button>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isUploading}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm',
            'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            'max-h-32',
          )}
          style={{
            minHeight: '40px',
            maxHeight: '128px',
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={
            disabled ||
            isUploading ||
            (!content.trim() && attachments.length === 0)
          }
          className="size-10 shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </form>
  );
};
