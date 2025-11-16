import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  Share2,
  Clock,
  Flame,
  Star,
  TrendingUp,
  ChevronDown,
  MoreHorizontal,
  EyeOff,
} from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { MDPreview } from '@/components/ui/md-preview';
import { MediaViewer } from '@/components/ui/media-viewer';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { usePreferences } from '@/features/settings/api';
import { UserHoverCard } from '@/features/users/components/user-hover-card';
import { fancyLog } from '@/helper/fancy-log';
import { formatBigNumber } from '@/utils/format';

import { useAddRecentPost } from '../api/add-recent-post';
import { useInfinitePosts } from '../api/get-sorted-posts';

import { DownVotePost } from './downvote-post';
import { FollowPost } from './follow-post';
import { PollView } from './poll-view';
import { ReportPost } from './report-post';
import { SavePost } from './save-post';
import { SharePost } from './share-post';
import { UpVotePost } from './upvote-post';

const sortOptions = [
  { value: 'hot', label: 'Hot', icon: Flame, color: 'text-orange-500' },
  { value: 'new', label: 'New', icon: Clock, color: 'text-blue-500' },
  { value: 'top', label: 'Top', icon: TrendingUp, color: 'text-green-500' },
  { value: 'best', label: 'Best', icon: Star, color: 'text-yellow-500' },
];

type PostsListProps = {
  communityId: number;
};

export const PostsList = ({ communityId }: PostsListProps) => {
  const [sortType, setSortType] = React.useState('new');

  const postsQuery = useInfinitePosts({ communityId, sortType });
  const preferencesQueryClient = usePreferences();
  const addRecentPostMutation = useAddRecentPost();

  const preferences = preferencesQueryClient.data;

  /* Check if user allow to store recent posts */
  const handleAddToRecentPosts = (post: {
    id: number;
    title: string;
    community: { id: number; name: string };
    createdAt: string;
  }) => {
    if (preferences?.isStoreRecentPosts) {
      addRecentPostMutation.mutate({
        data: {
          id: post.id,
          title: post.title,
          community: {
            id: post.community.id,
            name: post.community.name,
          },
          createdAt: post.createdAt,
        },
      });
    } else {
      console.log('User preferences do not allow to store recent posts');
    }
  };

  const handleJoinCommunity = (communityId: number) => {
    console.log('Join community:', communityId);
  };

  const handleHide = (postId: number) => {
    console.log('Hide post:', postId);
  };

  const handleSave = (postId: number) => {
    console.log('Save post:', postId);
  };

  if (postsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const posts = postsQuery.data?.pages.flatMap((page) => page.data);

  const handleSortChange = (newSortType: string) => {
    setSortType(newSortType);
    postsQuery.refetch();
  };

  const currentSort = sortOptions.find((opt) => opt.value === sortType);
  const CurrentSortIcon = currentSort?.icon || Flame;

  fancyLog('PostsList-Posts:', posts);
  return (
    <div className="space-y-4">
      {/* ____________________SortBar____________________ */}
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md">
              <CurrentSortIcon className={`size-4 ${currentSort?.color}`} />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                {currentSort?.label}
              </span>
              <ChevronDown className="size-4 text-gray-400 transition-transform group-hover:text-blue-600 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortType === option.value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
                    ${
                      isActive
                        ? 'border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon
                    className={`size-4 ${isActive ? option.color : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto size-2 animate-pulse rounded-full bg-blue-600" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ____________________Posts____________________ */}
      <div className="flex-1 space-y-4">
        {posts?.map((post) => (
          <article
            className="group mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
            key={post.id}
          >
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
                        <img
                          alt={post.community.name}
                          className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white"
                          src={
                            post.community.avatar ||
                            'https://b.thumbs.redditmedia.com/J_fCwTYJkoM-way-eaOHv8AOHoF_jNXNqOvPrQ7bINY.png'
                          }
                        />
                      </Link>

                      {/* Community Name & Author */}
                      <div className="flex flex-col">
                        <Link
                          to={paths.app.community.getHref(post.community.id)}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                        >
                          w/{post.community.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <UserHoverCard userId={post.author.id}>
                            <Link
                              to={paths.app.userProfile.getHref(post.author.id)}
                              className="hover:text-blue-600"
                            >
                              u/{post.author.username}
                            </Link>
                          </UserHoverCard>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleJoinCommunity(post.community.id)}
                        className="rounded-xl border border-sky-300 bg-cyan-50 px-4 py-1 text-xs font-semibold text-gray-600 hover:bg-cyan-100 hover:text-gray-700"
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
                            onClick={() => handleSave(post.id)}
                            className="flex items-center gap-2"
                          >
                            <span>Save</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleHide(post.id)}
                            className="flex items-center gap-2"
                          >
                            <EyeOff className="size-4" />
                            <span>Hide</span>
                          </DropdownMenuItem>
                          <ReportPost postId={post.id}>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <span>Report</span>
                            </DropdownMenuItem>
                          </ReportPost>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Post Title */}
                  <Link
                    to={paths.app.post.getHref(post.id)}
                    onClick={() =>
                      handleAddToRecentPosts({
                        id: post.id,
                        title: post.title,
                        community: {
                          id: post.community.id,
                          name: post.community.name,
                        },
                        createdAt: post.createdAt,
                      })
                    }
                  >
                    <h2 className="mb-3 cursor-pointer text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Post Content Preview (for text posts) */}
                  {post.type === 'text' && post.content && (
                    <MDPreview
                      value={post.content}
                      maxLines={3}
                      className="mb-3 text-sm"
                    />
                  )}

                  {/* For type poll */}
                  {post.type === 'poll' && post.pollData && (
                    <div className="mb-3">
                      <PollView post={post} isCompact={true} />
                    </div>
                  )}

                  {/* For type media */}
                  {post.type === 'media' && post.mediaUrls.length > 0 && (
                    <MediaViewer
                      mediaUrls={post.mediaUrls}
                      title={post.title}
                      className="mb-3"
                    />
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
                      <span>{post.commentCount} Comments</span>
                    </Link>
                    <SharePost link={paths.app.post.getHref(post.id)}>
                      <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                        <Share2 className="size-4" />
                        <span>Share</span>
                      </button>
                    </SharePost>
                    <SavePost postId={post.id} />
                    <FollowPost postId={post.id} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
