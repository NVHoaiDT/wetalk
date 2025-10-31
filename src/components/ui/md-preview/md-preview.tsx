import createDOMPurify from 'dompurify';
import { parse } from 'marked';
import { useState, useRef, useEffect } from 'react';

import { cn } from '@/utils/cn';

const DOMPurify = createDOMPurify(window);

export type MDPreviewProps = {
  value: string;
  className?: string;
  maxLines?: number;
};

export const MDPreview = ({
  value = '',
  className,
  maxLines = 0, // 0 means no line clamping
}: MDPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!maxLines || !contentRef.current) return;

    const content = contentRef.current;
    const lineHeight = parseInt(getComputedStyle(content).lineHeight);
    const maxHeight = lineHeight * maxLines;

    setCanExpand(content.scrollHeight > maxHeight);
  }, [value, maxLines]);

  return (
    <div>
      <div
        ref={contentRef}
        className={cn(
          'prose prose-slate w-full overflow-hidden',
          !isExpanded && maxLines && 'line-clamp-' + maxLines,
          className,
        )}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(parse(value) as string),
        }}
      />
      {canExpand && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};
