import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';

import { MDPreview } from '@/components/ui/md-preview';
import { MediaViewer } from '@/components/ui/media-viewer';
import { paths } from '@/config/paths';
import { formatBigNumber } from '@/utils/format';

import { usePost } from '../api/get-post';
import { useSummaryPost } from '../api/get-summary-post';

import { AiChatbox } from './ai-chatbox';
import { DownVotePost } from './downvote-post';
import { EditPost } from './edit-post';
import { FollowPost } from './follow-post';
import { PollView } from './poll-view';
import { ReportPost } from './report-post';
import { SavePost } from './save-post';
import { SharePost } from './share-post';
import { UpVotePost } from './upvote-post';

const PostViewPlaceholder = () => {
  return (
    <article className="w-full rounded-xl border border-slate-200 shadow-sm">
      {/* Post Header */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex">
          {/* Content Section */}
          <div className="flex-1 p-4">
            {/* Post Info - Community Row */}
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Community Avatar Skeleton */}
                <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200"></div>

                <div className="flex flex-col gap-2">
                  {/* Community Name Skeleton */}
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>

                  <div className="mb-3 flex items-center gap-2">
                    {/* Author Username Skeleton */}
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                    {/* Date Skeleton */}
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>

              {/* More Actions Button Skeleton */}
              <div className="size-8 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-4 h-7 w-3/4 animate-pulse rounded bg-gray-200"></div>

            {/* Tags Skeleton */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-6 w-14 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            {/* Content Skeleton */}
            <div className="mb-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
            </div>

            {/* Post Actions Skeleton */}
            <div className="mt-6 flex items-center gap-4">
              {/* Vote Section Skeleton */}
              <div className="h-10 w-28 animate-pulse rounded-full bg-gray-200"></div>
              {/* Comments Skeleton */}
              <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200"></div>
              {/* Share Skeleton */}
              <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const PostView = ({ id }: { id: number }) => {
  const postQuery = usePost({ id });
  const summaryPostQuery = useSummaryPost({
    text: postQuery.data?.data.content || '',
  });

  if (postQuery.isLoading) {
    return <PostViewPlaceholder />;
  }

  if (summaryPostQuery.isPending) {
    return <PostViewPlaceholder />;
  }

  const post = postQuery?.data?.data;
  const summaryPost = summaryPostQuery?.data;

  if (!post) return null;

  const hasMedia = post.type === 'media' && post.mediaUrls?.length > 0;
  return (
    <article className="w-full rounded-xl border border-slate-200 shadow-sm">
      {/* AI Summary Chatbox */}
      <AiChatbox
        summary={summaryPost?.summary}
        isLoading={summaryPostQuery.isLoading}
      />

      {/* Post Header */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex">
          {/* Content Section */}
          <div className="flex-1 p-4">
            {/* Post Info - Community Row */}
            <div className="mb-2 flex items-center justify-between  gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Link
                  to={paths.app.community.getHref(post.community.id)}
                  className="shrink-0 self-start"
                >
                  <div className="size-10 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                    <img
                      src={post.community.avatar}
                      alt={post.community.name}
                      className="size-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex flex-col gap-2">
                  <Link
                    to={paths.app.community.getHref(post.community.id)}
                    className="cursor-pointer font-semibold text-gray-800 hover:text-blue-600"
                  >
                    w/{post.community.name}
                  </Link>

                  <div className="mb-3 flex items-center gap-2 text-sm">
                    <Link
                      to={paths.app.userProfile.getHref(post.author.id)}
                      className="cursor-pointer text-gray-700 hover:text-blue-600"
                    >
                      u/{post.author.username}
                    </Link>

                    <div className="flex items-center gap-1 self-center text-sm text-gray-500">
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                    <MoreHorizontal className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-md"
                >
                  <DropdownMenuItem
                    className="flex items-center gap-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <EditPost post={post} />
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2">
                    <SavePost postId={post.id} />
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2">
                    <FollowPost postId={post.id} />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <ReportPost postId={post.id} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-xl font-semibold text-gray-700">
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
                <span>{post.commentCount}</span>
              </button>
              <SharePost link={paths.app.post.getHref(post.id)}>
                <button className="flex items-center gap-1.5 rounded-full bg-input p-2 transition-colors hover:bg-gray-100">
                  <span>Share</span>
                </button>
              </SharePost>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
