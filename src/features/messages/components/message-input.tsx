import { Send } from 'lucide-react';
import { FormEvent, KeyboardEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

type MessageInputProps = {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const MessageInput = ({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setContent('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
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
        disabled={disabled || !content.trim()}
        className="size-10 shrink-0"
      >
        <Send className="size-4" />
      </Button>
    </form>
  );
};
