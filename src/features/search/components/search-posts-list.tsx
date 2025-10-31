import { Spinner } from '@/components/ui/spinner';
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
    <div className="flex-1 space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-md border p-4 hover:bg-accent hover:text-accent-foreground"
        >
          <h3 className="text-lg font-medium">{post.title}</h3>
        </div>
      ))}
    </div>
  );
};
