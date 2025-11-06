import {
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  EyeOff,
} from 'lucide-react';
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
import { paths } from '@/config/paths';
import { DownVotePost } from '@/features/posts/components/downvote-post';
import { FollowPost } from '@/features/posts/components/follow-post';
import { SavePost } from '@/features/posts/components/save-post';
import { SharePost } from '@/features/posts/components/share-post';
import { UpVotePost } from '@/features/posts/components/upvote-post';
import { UserHoverCard } from '@/features/users/components/user-hover-card';
import { Post } from '@/types/api';
import { formatBigNumber } from '@/utils/format';

import { CommunityHoverCard } from './community-hover-card';

type DashboardPostCardProps = {
  post: Post;
};

export const DashboardPostCard = ({ post }: DashboardPostCardProps) => {
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
                  <CommunityHoverCard
                    communityId={post.community.id}
                    communityName={post.community.name}
                  >
                    <Link
                      to={paths.app.community.getHref(post.community.id)}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                    >
                      w/{post.community.name}
                    </Link>
                  </CommunityHoverCard>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <UserHoverCard userId={post.author.id}>
                      <Link
                        to={paths.app.userProfile.getHref(post.author.id)}
                        className="hover:text-blue-600"
                      >
                        u/{post.author.username}
                      </Link>
                    </UserHoverCard>
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
              <MDPreview
                value={post.content}
                maxLines={3}
                className="mb-3 text-sm"
              />
            )}

            {/* Media Carousel (for media posts) */}
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
                <span>10 Comments</span>
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
  );
};
