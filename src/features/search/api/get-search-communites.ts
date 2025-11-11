/* 
[
    {
        "id": 14,
        "name": "Startup Tech",
        "shortDescription": "Technical for startups",
        "isPrivate": false,
        "totalMembers": 4
    },
    {
        "id": 13,
        "name": "Tech Career",
        "shortDescription": "IT career and development",
        "isPrivate": false,
        "totalMembers": 6
    }
]
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig } from '@/lib/react-query';

export type SearchedCommunity = {
  id: number;
  name: string;
  shortDescription: string;
  isPrivate: boolean;
  totalMembers: number;
};

export type SearchCommunitiesResponse = {
  data: SearchedCommunity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    nextUrl: string;
  };
};

export const getSearchCommunities = ({
  query,
  page = 1,
  sortType,
}: {
  query: string;
  sortType: string;
  page?: number;
}): Promise<SearchCommunitiesResponse> => {
  return api.get(`/communities/search?name=${query}&sortBy=${sortType}`, {
    params: {
      page,
    },
  });
};

export const getInfiniteSearchCommunitiesOptions = (
  query: string,
  sortType: string,
) => {
  return infiniteQueryOptions({
    queryKey: ['searchCommunities', query, sortType],
    queryFn: ({ pageParam = 1 }) => {
      return getSearchCommunities({
        query,
        sortType,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage: SearchCommunitiesResponse) => {
      if (lastPage?.pagination?.page === lastPage?.pagination.total)
        return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseSearchCommunitiesOptions = {
  query: string;
  sortType: string;
  page?: number;
};

export const useInfiniteSearchCommunities = ({
  query,
  sortType,
}: UseSearchCommunitiesOptions) => {
  return useInfiniteQuery({
    ...getInfiniteSearchCommunitiesOptions(query, sortType),
    ...queryConfig,
  });
};
