import { Check, Copy, Facebook, Twitter } from 'lucide-react';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

type SharePostProps = {
  link: string;
  children: React.ReactNode;
};

export const SharePost = ({ link, children }: SharePostProps) => {
  const [copied, setCopied] = useState(false);

  const getFullUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${window.location.origin}${url}`;
  };

  const fullUrl = getFullUrl(link);
  const encodedUrl = encodeURIComponent(fullUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        {/* Copy Link Section */}
        <div className="p-2">
          <p className="mb-2 text-xs font-semibold text-gray-500">Share Link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-hidden rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
              <p className="truncate text-sm text-gray-700">{fullUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Social Media Share Options */}
        <div className="p-1">
          <DropdownMenuItem
            onClick={handleShareFacebook}
            className="flex cursor-pointer items-center gap-3 px-3 py-2"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-600">
              <Facebook className="size-4 fill-white text-white" />
            </div>
            <span className="text-sm font-medium">Share on Facebook</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleShareTwitter}
            className="flex cursor-pointer items-center gap-3 px-3 py-2"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-sky-500">
              <Twitter className="size-4 fill-white text-white" />
            </div>
            <span className="text-sm font-medium">Share on Twitter</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
