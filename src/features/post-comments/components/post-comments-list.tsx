import { formatDistanceToNow } from 'date-fns';
import { ArchiveX, MoreVertical, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { LightboxMediaViewer } from '@/components/ui/lightbox-media-viewer';
import { MDPreview } from '@/components/ui/md-preview';
import { paths } from '@/config/paths';
import { fancyLog } from '@/helper/fancy-log';
import { useCurrentUser } from '@/lib/auth';
import { Authorization, POLICIES } from '@/lib/authorization';
import { User } from '@/types/api';

import { useInfinitePostComments } from '../api/get-post-comments';

import { CreatePostComment } from './create-post-comment';
import { DeletePostComment } from './delete-post-comment';
import { DownVotePostComment } from './downvote-post-comment';
import { EditPostComment } from './edit-post-comment';
import { ReplyComment } from './reply-comment';
import { UpVotePostComment } from './upvote-post-comment';

type PostCommentsListProps = {
  postId: number;
};

const Comment = ({
  comment,
  postId,
  level = 0,
}: {
  comment: any;
  postId: number;
  level?: number;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(level >= 1); // Default collapse for level 2+
  const maxNestedLevel = 3;

  const userQuery = useCurrentUser();
  const user = userQuery.data?.data;

  return (
    <Card
      className={`border-l-2 ${level === 0 ? 'border-l-transparent' : 'border-l-blue-200'}`}
    >
      <div className="p-4">
        {/* Comment Header */}
        <Link to={paths.app.userProfile.getHref(comment.author.id)}>
          <div className="mb-2 flex items-center space-x-3">
            <img
              src={comment.author.avatar}
              alt={comment.author.username}
              className={`rounded-full ${level === 0 ? 'size-8' : 'size-6'}`}
            />
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-blue-600">
                {comment.author.username}
              </span>
              <span className="text-gray-500">•</span>
              <time className="text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </time>
            </div>
          </div>
        </Link>
        {/* Comment Content */}
        <div className={level === 0 ? 'pl-8' : 'pl-6'}>
          <MDPreview value={comment.content} />
          {comment.mediaUrl && (
            <>
              <button
                type="button"
                className="mt-2 cursor-pointer transition-opacity hover:opacity-90"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="View image in fullscreen"
              >
                <img
                  src={comment.mediaUrl}
                  alt="Comment attachment"
                  className="max-h-60 rounded-lg object-cover"
                />
              </button>
              <LightboxMediaViewer
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                media={comment.mediaUrl}
              />
            </>
          )}

          {/* Comment Actions */}
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {/* Vote buttons */}
              <UpVotePostComment commentId={comment.id} />
              <span>{comment.vote}</span>
              <DownVotePostComment commentId={comment.id} />
            </div>
            {level < maxNestedLevel && (
              <ReplyComment
                onReply={() => setIsReplying(!isReplying)}
                isReplying={isReplying}
              />
            )}
            {/* Toggle button for nested replies at level 2+ */}
            {level >= 1 && comment.replies?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 px-2 text-xs text-gray-600 hover:text-blue-600"
              >
                {isCollapsed ? (
                  <div className="flex items-center gap-1 text-sm">
                    <ZoomIn className="size-4" />
                    <span> {comment.replies.length} replies</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm">
                    <ZoomOut className="size-4" />
                    <span>Hide replies</span>
                  </div>
                )}
              </Button>
            )}
            {level === 0 && (
              <Authorization
                policyCheck={POLICIES['comment:delete'](user as User, comment)}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-600 hover:text-blue-600"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top">
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                      className="cursor-pointer text-blue-600 hover:text-blue-700"
                    >
                      <EditPostComment
                        id={comment.id}
                        postId={postId}
                        initialContent={comment.content}
                        initialMediaUrl={comment.mediaUrl}
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <DeletePostComment id={comment.id} postId={postId} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Authorization>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4">
              <CreatePostComment
                postId={postId}
                parentCommentId={comment.id}
                placeholder={`Reply to ${comment.author.username}...`}
                minimized
                onSuccess={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies?.length > 0 && !isCollapsed && (
        <div className="space-y-4 border-t border-gray-100 bg-gray-50 p-4 pl-8">
          {comment.replies.map((reply: any) => (
            <Comment
              key={reply.id}
              comment={reply}
              postId={postId}
              level={Math.min(level + 1, maxNestedLevel)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

const PostCommentsPlaceholder = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="size-8 rounded-full bg-gray-300"></div>
            <div className="h-4 w-32 rounded bg-gray-300"></div>
          </div>
          <div className="mt-2 h-4 w-full rounded bg-gray-300"></div>
          <div className="mt-2 h-4 w-5/6 rounded bg-gray-300"></div>
        </div>
      ))}
    </div>
  );
};

export const PostCommentsList = ({ postId }: PostCommentsListProps) => {
  const postCommentsQuery = useInfinitePostComments({ postId });

  if (postCommentsQuery.isLoading) {
    return <PostCommentsPlaceholder />;
  }

  /* 
    Backend API retrn [null] when there are no comments 
    So we also check for that case
   */
  if (
    !postCommentsQuery.data ||
    postCommentsQuery.data.pages[0].data === null
  ) {
    return (
      <div
        role="list"
        aria-label="post-comments"
        className="flex h-40 flex-col items-center justify-center bg-white text-gray-500"
      >
        <ArchiveX className="size-10" />
        <h4>No Comments Yet</h4>
        <p className="mt-2 text-sm text-gray-400">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  const comments = postCommentsQuery.data?.pages.flatMap((page) => page.data);
  fancyLog('Post Comments:', comments);

  return (
    <div className="max-w-4xl space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};
