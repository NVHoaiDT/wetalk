import { QueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { SearchCommunitiesList } from '@/features/search/components/search-communities-list';
import {
  SearchFilters,
  SearchType,
  SortType,
} from '@/features/search/components/search-filters';
import { SearchPostsList } from '@/features/search/components/search-posts-list';

export const clientLoader = (queryClient: QueryClient) => async () => {
  // No data to preload for now
  return null;
};

const SearchRoute = () => {
  const params = useParams();
  const query = params.query as string;
  const [searchType, setSearchType] = useState<SearchType>('posts');
  const [sortType, setSortType] = useState<SortType>('new');

  return (
    <ContentLayout title={`Search results for "${query}"`}>
      <div className="mx-auto max-w-5xl">
        <SearchFilters
          type={searchType}
          sortType={sortType}
          onTypeChange={setSearchType}
          onSortChange={setSortType}
        />

        <div className="min-h-[200px]">
          {searchType === 'posts' && (
            <SearchPostsList query={query} sortType={sortType} />
          )}
          {searchType === 'communities' && (
            <SearchCommunitiesList query={query} sortType={sortType} />
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
export default SearchRoute;
