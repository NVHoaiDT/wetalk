import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Share2, Bookmark } from 'lucide-react';
import * as React from 'react';

import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';
import { formatBigNumber } from '@/utils/format';

import { useInfinitePosts } from '../api/get-posts';

type PostsListProps = {
  communityId: number;
};

export const PostsList = ({ communityId }: PostsListProps) => {
  const postQuery = useInfinitePosts({ communityId });
  const [currentMediaIndex, setcurrentMediaIndex] = React.useState<
    Record<string, number>
  >({});

  if (postQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const posts = postQuery.data?.pages.flatMap((page) => page.data);
  fancyLog('Posts', posts);

  return (
    <div className="flex-1 space-y-4">
      {posts?.map((post) => (
        <article
          key={post.id}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
        >
          <div className="flex">
            {/* Vote Section */}
            <div className="flex w-12 flex-col items-center gap-1 border-r border-gray-200 bg-gray-50 py-3">
              <button className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3l6 6H4l6-6z" />
                </svg>
              </button>
              <span className="text-xs font-bold text-gray-700">
                {formatBigNumber(post.vote)}
              </span>
              <button className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 17l-6-6h12l-6 6z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                  <span className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">
                    {post.author.username}
                  </span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
                </div>

                <h2 className="mb-3 cursor-pointer text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                  {post.title}
                </h2>

                {/* For type media */}
                {post.type === 'media' && post.mediaUrls.length > 0 && (
                  <div className="group/carousel relative mb-3">
                    <div className="overflow-hidden rounded-lg">
                      {post.mediaUrls[currentMediaIndex[post.id] || 0].endsWith(
                        '.mp4',
                      ) ? (
                        <video
                          src={post.mediaUrls[currentMediaIndex[post.id] || 0]}
                          controls
                          className="h-64 w-full object-cover"
                          preload="metadata"
                        >
                          {' '}
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
                          src={post.mediaUrls[currentMediaIndex[post.id] || 0]}
                          alt={post.title}
                          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Image counter */}
                    {post.mediaUrls.length > 1 && (
                      <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                        {(currentMediaIndex[post.id] || 0) + 1} /{' '}
                        {post.mediaUrls.length}
                      </div>
                    )}

                    {/* Navigation buttons */}
                    {post.mediaUrls.length > 1 && (
                      <>
                        {/* Previous button */}
                        {(currentMediaIndex[post.id] || 0) > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setcurrentMediaIndex((prev) => ({
                                ...prev,
                                [post.id]: (prev[post.id] || 0) - 1,
                              }));
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

                        {/* Next button */}
                        {(currentMediaIndex[post.id] || 0) <
                          post.mediaUrls.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setcurrentMediaIndex((prev) => ({
                                ...prev,
                                [post.id]: (prev[post.id] || 0) + 1,
                              }));
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

                    {/* Dot indicators */}
                    {post.mediaUrls.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {post.mediaUrls.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setcurrentMediaIndex((prev) => ({
                                ...prev,
                                [post.id]: idx,
                              }));
                            }}
                            className={`size-1.5 rounded-full transition-all duration-200 ${
                              idx === (currentMediaIndex[post.id] || 0)
                                ? 'w-4 bg-white'
                                : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Post Actions */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                    <MessageCircle className="size-4" />
                    <span>10 Comments</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                    <Share2 className="size-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                    <Bookmark className="size-4" />
                    <span>Save</span>
                  </button>
                  {true && (
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-yellow-500">🏆</span>
                      <span className="font-medium">{1}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
