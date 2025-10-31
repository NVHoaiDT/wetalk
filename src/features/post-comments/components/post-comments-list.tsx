import { formatDistanceToNow } from 'date-fns';
import {
  ArchiveX,
  ThumbsUp,
  ThumbsDown,
  Reply,
  MoreVertical,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';

import { useInfinitePostComments } from '../api/get-post-comments';

type PostCommentsListProps = {
  postId: number;
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
        <h4>No Comments Found</h4>
      </div>
    );

  fancyLog('PostCommentsList:', comments);
  return (
    <div className="max-w-4xl space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="p-4">
            {/* Comment Header */}
            <div className="mb-2 flex items-center space-x-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.username}
                className="size-8 rounded-full"
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
            <div className="pl-11">
              <p className="whitespace-pre-wrap text-gray-800">
                {comment.content}
              </p>

              {/* Comment Actions */}
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:text-blue-600"
                  >
                    <ThumbsUp className="mr-1 size-4" />
                    <span>0</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:text-blue-600"
                  >
                    <ThumbsDown className="size-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-600 hover:text-blue-600"
                >
                  <Reply className="mr-1 size-4" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-gray-600 hover:text-blue-600"
                >
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Nested Replies */}
          {comment.replies?.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 pl-8">
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="border-l-2 border-blue-200 py-4 pl-4"
                >
                  <div className="mb-2 flex items-center space-x-3">
                    <img
                      src={reply.author.avatar}
                      alt={reply.author.username}
                      className="size-6 rounded-full"
                    />
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-semibold text-blue-600">
                        {reply.author.username}
                      </span>
                      <span className="text-gray-500">•</span>
                      <time className="text-gray-500">
                        {formatDistanceToNow(new Date(reply.createdAt), {
                          addSuffix: true,
                        })}
                      </time>
                    </div>
                  </div>
                  <div className="pl-9">
                    <p className="whitespace-pre-wrap text-sm text-gray-800">
                      {reply.content}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm hover:text-blue-600"
                        >
                          <ThumbsUp className="mr-1 size-3" />
                          <span>0</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-sm hover:text-blue-600"
                        >
                          <ThumbsDown className="size-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <Reply className="mr-1 size-3" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
