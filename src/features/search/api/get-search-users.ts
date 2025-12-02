/* 
Endpoint: /users/search?search=...?&sortBy=...
[
    {
        "id": 3,
        "username": "Phạm Văn C",
        "avatar": "https://i.pravatar.cc/150?img=3",
        "bio": "DevOps Engineer, chuyên về Kubernetes và Docker",
        "karma": 65,
        "createdAt": "2025-10-01T12:05:51.356767Z"
    },
    ...
],
*/

import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { queryConfig } from '@/lib/react-query';
import { SearchUsersResponse } from '@/types/api';

export const getSearchUsers = ({
  query,
  page = 1,
  sortType,
}: {
  query: string;
  sortType: string;
  page?: number;
}): Promise<SearchUsersResponse> => {
  return api.get(`/users/search?search=${query}&sortBy=${sortType}`, {
    params: {
      page,
    },
  });
};

export const getInfiniteSearchUsersOptions = (
  query: string,
  sortType: string,
) => {
  return infiniteQueryOptions({
    queryKey: ['searched-users', query, sortType],
    queryFn: ({ pageParam = 1 }) => {
      return getSearchUsers({
        query,
        sortType,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage: SearchUsersResponse) => {
      if (lastPage?.pagination?.page === lastPage?.pagination.total)
        return undefined;
      const nextPage = lastPage.pagination.page + 1;
      return nextPage;
    },
    initialPageParam: 1,
  });
};

type UseSearchUsersOptions = {
  query: string;
  sortType: string;
  page?: number;
};

export const useInfiniteSearchUsers = ({
  query,
  sortType,
}: UseSearchUsersOptions) => {
  return useInfiniteQuery({
    ...getInfiniteSearchUsersOptions(query, sortType),
    ...queryConfig,
  });
};
