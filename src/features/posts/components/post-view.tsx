import { formatDistanceToNow } from 'date-fns';
import { Bookmark, MessageCircle, Share2 } from 'lucide-react';

import { MDPreview } from '@/components/ui/md-preview';
import { MediaViewer } from '@/components/ui/media-viewer';
import { Spinner } from '@/components/ui/spinner';
import { formatBigNumber } from '@/utils/format';

import { usePost } from '../api/get-post';

import { DownVotePost } from './downvote-post';
import { PollView } from './poll-view';
import { ReportPost } from './report-post';
import { UpVotePost } from './upvote-post';

export const PostView = ({ id }: { id: number }) => {
  const postQuery = usePost({ id });

  if (postQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const post = postQuery?.data?.data;

  if (!post) return null;

  const hasMedia = post.type === 'media' && post.mediaUrls?.length > 0;

  return (
    <article className="mx-auto max-w-4xl space-y-4 p-4">
      {/* Post Header */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex">
          {/* Content Section */}
          <div className="flex-1 p-4">
            {/* Post Info */}
            <div className="mb-3 flex items-center gap-2 text-sm">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="size-6 rounded-full"
              />
              <span className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">
                w/{post.community.name}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">
                <span className="cursor-pointer hover:text-blue-600">
                  u/{post.author.username}
                </span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt))}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Poll Content */}
            {post.type === 'poll' && post.pollData && (
              <div className="mb-6">
                <PollView post={post} />
              </div>
            )}

            {/* Media Content */}
            {hasMedia && (
              <div className="mb-6">
                <MediaViewer mediaUrls={post.mediaUrls} title={post.title} />
              </div>
            )}

            {/* Text Content */}
            <MDPreview value={post.content} />

            {/* Post Actions */}
            <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
              {/* Vote Section */}
              <div className="flex flex-row items-center gap-2 rounded-full bg-input p-2">
                <UpVotePost postId={post.id} />
                <span className="text-xs font-bold text-gray-600">
                  {formatBigNumber(post.vote)}
                </span>
                <DownVotePost postId={post.id} />
              </div>
              <button className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100">
                <MessageCircle className="size-4" />
                <span>10 Comments</span>
              </button>
              <button className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100">
                <Share2 className="size-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100">
                <Bookmark className="size-4" />
                <span>Save</span>
              </button>
              <ReportPost postId={post.id} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
