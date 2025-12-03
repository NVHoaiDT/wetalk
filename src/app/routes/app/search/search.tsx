import { useState } from 'react';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { SearchAllList } from '@/features/search/components/search-all-list';
import { SearchCommunitiesList } from '@/features/search/components/search-communities-list';
import {
  SearchFilters,
  SearchType,
  PostSortType,
  CommunitySortType,
} from '@/features/search/components/search-filters';
import { SearchPostsList } from '@/features/search/components/search-posts-list';
import { SearchUsersList } from '@/features/search/components/search-users-list';

const SearchRoute = () => {
  const params = useParams();
  const query = params.query as string;
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [postSortType, setPostSortType] = useState<PostSortType>('new');
  const [communitySortType, setCommunitySortType] =
    useState<CommunitySortType>('member_count');

  return (
    <ContentLayout title={`Search results for "${query}"`}>
      <div className="mx-auto max-w-6xl">
        <SearchFilters
          type={searchType}
          postSortType={postSortType}
          communitySortType={communitySortType}
          onTypeChange={setSearchType}
          onPostSortChange={setPostSortType}
          onCommunitySortChange={setCommunitySortType}
        />

        <div className="min-h-[200px]">
          {searchType === 'all' && <SearchAllList query={query} />}
          {searchType === 'posts' && (
            <SearchPostsList query={query} sortType={postSortType} />
          )}
          {searchType === 'communities' && (
            <SearchCommunitiesList query={query} sortType={communitySortType} />
          )}
          {searchType === 'users' && <SearchUsersList query={query} />}
        </div>
      </div>
    </ContentLayout>
  );
};
export default SearchRoute;
