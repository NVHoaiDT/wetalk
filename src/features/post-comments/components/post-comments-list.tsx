import { formatDistanceToNow } from 'date-fns';
import { ArchiveX, Reply, MoreVertical } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';
import { useCurrentUser } from '@/lib/auth';
import { Authorization, POLICIES } from '@/lib/authorization';
import { User } from '@/types/api';

import { useInfinitePostComments } from '../api/get-post-comments';

import { CreatePostComment } from './create-post-comment';
import { DeletePostComment } from './delete-post-comment';
import { DownVotePostComment } from './downvote-post-comment';
import { EditPostComment } from './edit-post-comment';
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
  const maxNestedLevel = 3;

  const userQuery = useCurrentUser();
  const user = userQuery.data?.data;
  fancyLog('USER: ', user);
  fancyLog('COMMENT: ', comment);
  return (
    <Card
      className={`border-l-2 ${level === 0 ? 'border-l-transparent' : 'border-l-blue-200'}`}
    >
      <div className="p-4">
        {/* Comment Header */}
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

        {/* Comment Content */}
        <div className={level === 0 ? 'pl-8' : 'pl-6'}>
          <MDPreview value={comment.content} />
          {comment.mediaUrl && (
            <div className="mt-2">
              <img
                src={comment.mediaUrl}
                alt="Comment attachment"
                className="max-h-60 rounded-lg object-cover"
              />
            </div>
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
              <button
                className="flex h-8 flex-row content-center items-center px-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className={'mr-1 size-4'} />
                {isReplying ? 'Cancel' : 'Reply'}
              </button>
            )}
            {level === 0 && (
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
                  <Authorization
                    policyCheck={POLICIES['comment:delete'](
                      user as User,
                      comment,
                    )}
                  >
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
                  </Authorization>
                </DropdownMenuContent>
              </DropdownMenu>
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
      {comment.replies?.length > 0 && (
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

export const PostCommentsList = ({ postId }: PostCommentsListProps) => {
  const postCommentsQuery = useInfinitePostComments({ postId });

  if (postCommentsQuery.isLoading)
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  const comments = postCommentsQuery.data?.pages.flatMap((page) => page.data);

  if (!comments?.length)
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

  return (
    <div className="max-w-4xl space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};
