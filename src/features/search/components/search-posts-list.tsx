import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Share2 } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { DownVotePost } from '@/features/posts/components/downvote-post';
import { UpVotePost } from '@/features/posts/components/upvote-post';
import { fancyLog } from '@/helper/fancy-log';

import { useInfiniteSearchPosts } from '../api/get-search-posts';

type SearchPostsListProps = {
  query: string;
  sortType: string;
};

export const SearchPostsList = ({ query, sortType }: SearchPostsListProps) => {
  const searchPostQuery = useInfiniteSearchPosts({ query, sortType });

  if (searchPostQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (searchPostQuery.isError) {
    return (
      <div>Error loading search results: {searchPostQuery.error.message}</div>
    );
  }

  const posts = searchPostQuery.data?.pages.flatMap((page) => page.data) || [];
  fancyLog('SearchPostsList-Posts:', posts);
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group rounded-md border bg-card transition-colors hover:border-blue-200 hover:bg-blue-50/50"
        >
          <div className="flex gap-4 p-4">
            <div className="flex min-w-[40px] flex-col items-center gap-1 text-sm text-muted-foreground">
              <UpVotePost postId={post.id} />
              <span>{post.vote || 0}</span>
              <DownVotePost postId={post.id} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Posted by {post.author.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </div>
              <h3 className="text-lg font-medium leading-tight group-hover:text-blue-700">
                {post.title}
              </h3>
              {post.content && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {post.content}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 rounded-md p-2 hover:bg-blue-100 hover:text-blue-700">
                  <MessageCircle className="size-4" /> {0} Comments
                </button>
                <button className="flex items-center gap-1 rounded-md p-2 hover:bg-blue-100 hover:text-blue-700">
                  <Share2 className="size-4" /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
