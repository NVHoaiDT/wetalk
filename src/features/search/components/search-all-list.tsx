import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router';

import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useAddRecentCommunity } from '@/features/communities/api/add-recent-community';
import { useAddRecentPost } from '@/features/posts/api/add-recent-post';
import { DownVotePost } from '@/features/posts/components/downvote-post';
import { UpVotePost } from '@/features/posts/components/upvote-post';
import { usePreferences } from '@/features/settings/api';
import { fancyLog } from '@/helper/fancy-log';

import { useInfiniteSearchCommunities } from '../api/get-search-communites';
import { useInfiniteSearchPosts } from '../api/get-search-posts';

type SearchAllListProps = {
  query: string;
};

export const SearchAllList = ({ query }: SearchAllListProps) => {
  const searchPostsQuery = useInfiniteSearchPosts({ query, sortType: 'new' });
  const searchCommunitiesQuery = useInfiniteSearchCommunities({
    query,
    sortType: 'member_count',
  });
  const preferencesQueryClient = usePreferences();
  const addRecentPostMutation = useAddRecentPost();
  const addRecentCommunityMutation = useAddRecentCommunity();

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

  /* Check if user allow to store recent communities */
  const handleAddToRecentCommunities = (community: {
    id: number;
    name: string;
    communityAvatar: string;
    isPrivate: boolean;
    totalMembers: number;
  }) => {
    if (preferences?.isStoreRecentCommunities) {
      addRecentCommunityMutation.mutate({
        data: {
          id: community.id,
          name: community.name,
          communityAvatar: community.communityAvatar,
          isPrivate: community.isPrivate,
          totalMembers: community.totalMembers,
        },
      });
    } else {
      console.log('User preferences do not allow to store recent communities');
    }
  };

  const isLoading =
    searchPostsQuery.isLoading || searchCommunitiesQuery.isLoading;
  const isError = searchPostsQuery.isError || searchCommunitiesQuery.isError;

  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        Error loading search results:{' '}
        {searchPostsQuery.error?.message ||
          searchCommunitiesQuery.error?.message}
      </div>
    );
  }

  const allPosts =
    searchPostsQuery.data?.pages.flatMap((page) => page.data) || [];
  const mediaPosts = allPosts.filter((post) => post.type === 'media');
  const textPosts = allPosts.filter((post) => post.type !== 'media');
  const communities =
    searchCommunitiesQuery.data?.pages.flatMap((page) => page.data) || [];

  fancyLog('SearchAllList-AllPosts:', allPosts);
  fancyLog('SearchAllList-MediaPosts:', mediaPosts);
  fancyLog('SearchAllList-Communities:', communities);

  const renderMediaPost = (post: (typeof allPosts)[0]) => (
    <Link
      key={post.id}
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
      className="group block overflow-hidden rounded-md border bg-card transition-colors hover:border-blue-200 hover:shadow-md"
    >
      {/* Media thumbnail */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={post.mediaUrls[0]}
            alt={post.title}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Post info */}
      <div className="space-y-1 p-3">
        <Link
          to={paths.app.community.getHref(post.communityId)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-blue-100 text-[10px] text-blue-600">
            w
          </span>
          {post.community.name}
        </Link>
        <h3 className="line-clamp-2 text-sm font-medium leading-tight group-hover:text-blue-700">
          {post.title}
        </h3>
      </div>
    </Link>
  );

  const renderTextPost = (post: (typeof allPosts)[0]) => (
    <div
      key={post.id}
      className="group rounded-md border-b bg-card transition-colors hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div className="flex gap-4 p-4">
        <div className="flex min-w-[40px] flex-col items-center gap-1 text-sm text-muted-foreground">
          <UpVotePost postId={post.id} />
          <span>{post.vote || 0}</span>
          <DownVotePost postId={post.id} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to={paths.app.community.getHref(post.communityId)}
              className="font-medium hover:underline"
            >
              w/{post.community.name}
            </Link>
            <span>•</span>
            <span>Posted by {post.author.username}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
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
            <h3 className="text-lg font-medium leading-tight group-hover:text-blue-700">
              {post.title}
            </h3>
          </Link>
          {post.content && <MDPreview value={post.content} maxLines={2} />}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to={paths.app.post.getHref(post.id)}
              className="flex items-center gap-1 rounded-md p-2 hover:bg-blue-100 hover:text-blue-700"
            >
              <MessageCircle className="size-4" /> {post.commentCount || 0}{' '}
              Comments
            </Link>
            <button className="flex items-center gap-1 rounded-md p-2 hover:bg-blue-100 hover:text-blue-700">
              <Share2 className="size-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunity = (community: (typeof communities)[0]) => (
    <div
      key={community.id}
      className="flex items-start gap-4 rounded-md border-y p-4 hover:border-blue-200 hover:bg-blue-50/50"
    >
      <Link
        to={paths.app.community.getHref(community.id)}
        onClick={() =>
          handleAddToRecentCommunities({
            id: community.id,
            name: community.name,
            communityAvatar:
              community.communityAvatar ||
              'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
            isPrivate: community.isPrivate,
            totalMembers: community.totalMembers,
          })
        }
      >
        <img
          src={
            community.communityAvatar ||
            'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg'
          }
          alt={community.name}
          className="size-16 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <Link
          to={paths.app.community.getHref(community.id)}
          onClick={() =>
            handleAddToRecentCommunities({
              id: community.id,
              name: community.name,
              communityAvatar:
                community.communityAvatar ||
                'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg',
              isPrivate: community.isPrivate,
              totalMembers: community.totalMembers,
            })
          }
        >
          <h3 className="text-lg font-medium hover:text-blue-600">
            w/{community.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {community.shortDescription}
        </p>
        <div className="mt-2 text-sm text-muted-foreground">
          {community.totalMembers} members
        </div>
      </div>
      {community.isPrivate && (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Private
        </span>
      )}
    </div>
  );

  return (
    <div className="flex gap-6">
      {/* Main content area - Media and Posts combined */}
      <div className="flex-1 space-y-6">
        {/* Media Section */}
        {mediaPosts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Media</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {mediaPosts.map(renderMediaPost)}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {textPosts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Posts</h2>
            {textPosts.map(renderTextPost)}
          </div>
        )}

        {/* Empty state */}
        {mediaPosts.length === 0 && textPosts.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No posts found
          </div>
        )}

        {/* Communities section - Mobile only */}
        <div className="space-y-4 md:hidden">
          <h2 className="text-lg font-semibold">Communities</h2>
          {communities.length > 0 ? (
            communities.map(renderCommunity)
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No communities found
            </div>
          )}
        </div>
      </div>

      {/* Communities sidebar - Desktop only */}
      <div className="hidden w-80 md:block">
        <div className="sticky top-4">
          <h2 className="mb-4 text-lg font-semibold">
            Communities ({communities.length})
          </h2>
          <div className="space-y-4">
            {communities.length > 0 ? (
              communities.map(renderCommunity)
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No communities found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
