import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { paths } from '@/config/paths';
import { DownVotePost } from '@/features/posts/components/downvote-post';
import { UpVotePost } from '@/features/posts/components/upvote-post';
import { Post } from '@/types/api';
import { formatBigNumber } from '@/utils/format';

type DashboardPostCardProps = {
  post: Post;
};

export const DashboardPostCard = ({ post }: DashboardPostCardProps) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleJoinCommunity = () => {
    console.log('Join community:', post.community.id);
  };

  const handleReport = () => {
    console.log('Report post:', post.id);
  };

  const handleHide = () => {
    console.log('Hide post:', post.id);
  };

  const handleSave = () => {
    console.log('Save post:', post.id);
  };

  return (
    <article className="group mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
      <div className="flex">
        {/* Vote Section */}
        <div className="flex w-12 flex-col items-center gap-1 border-r border-gray-200 bg-gray-50 py-3">
          <UpVotePost postId={post.id} />
          <span className="text-xs font-bold text-gray-700">
            {formatBigNumber(post.vote)}
          </span>
          <DownVotePost postId={post.id} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="p-4">
            {/* Header: Community Info + Actions */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Community Avatar */}
                <Link
                  to={paths.app.community.getHref(post.community.id)}
                  className="shrink-0"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                    {post.community.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                {/* Community Name & Post Date */}
                <div className="flex flex-col">
                  <Link
                    to={paths.app.community.getHref(post.community.id)}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  >
                    r/{post.community.name}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      Posted by u/{post.author.username} •{' '}
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleJoinCommunity}
                  className="rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Join
                </Button>

                {/* More Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Bookmark className="size-4" />
                      <span>Save</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleHide}
                      className="flex items-center gap-2"
                    >
                      <EyeOff className="size-4" />
                      <span>Hide</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleReport}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <Flag className="size-4" />
                      <span>Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Post Title */}
            <Link to={paths.app.post.getHref(post.id)}>
              <h2 className="mb-3 cursor-pointer text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {post.title}
              </h2>
            </Link>

            {/* Post Content Preview (for text posts) */}
            {post.type === 'text' && post.content && (
              <div
                className="prose prose-sm mb-3 line-clamp-3 max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: post.content.substring(0, 200),
                }}
              />
            )}

            {/* Media Carousel (for media posts) */}
            {post.type === 'media' && post.mediaUrls.length > 0 && (
              <div className="group/carousel relative mb-3">
                <div className="overflow-hidden rounded-lg">
                  {post.mediaUrls[currentMediaIndex].endsWith('.mp4') ? (
                    <video
                      src={post.mediaUrls[currentMediaIndex]}
                      controls
                      className="h-96 w-full object-cover"
                      preload="metadata"
                    >
                      <track
                        kind="captions"
                        src="/captions/example.vtt"
                        srcLang="en"
                        label="English"
                        default
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={post.mediaUrls[currentMediaIndex]}
                      alt={post.title}
                      className="h-96 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Media Counter */}
                {post.mediaUrls.length > 1 && (
                  <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                    {currentMediaIndex + 1} / {post.mediaUrls.length}
                  </div>
                )}

                {/* Navigation Buttons */}
                {post.mediaUrls.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMediaIndex((prev) => prev - 1);
                        }}
                        className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity duration-200 hover:bg-white group-hover/carousel:opacity-100"
                      >
                        <svg
                          className="size-5 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}

                    {currentMediaIndex < post.mediaUrls.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMediaIndex((prev) => prev + 1);
                        }}
                        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg transition-opacity duration-200 hover:bg-white group-hover/carousel:opacity-100"
                      >
                        <svg
                          className="size-5 text-gray-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Dot Indicators */}
                {post.mediaUrls.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {post.mediaUrls.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentMediaIndex(idx);
                        }}
                        className={`size-1.5 rounded-full transition-all duration-200 ${
                          idx === currentMediaIndex
                            ? 'w-4 bg-white'
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link
                to={paths.app.post.getHref(post.id)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
              >
                <MessageCircle className="size-4" />
                <span>10 Comments</span>
              </Link>
              <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                <Share2 className="size-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
              >
                <Bookmark className="size-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
