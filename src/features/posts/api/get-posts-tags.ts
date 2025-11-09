/* 
REQUEST: `GET /posts/tags?search=a`
RESPONSE:
{
    "success": true,
    "message": "Tags retrieved successfully",
    "data": [
        {
            "id": 3,
            "name": "ai"
        },
        {
            "id": 15,
            "name": "automation"
        },
        ...
    ]
}
*/
import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Tag } from '@/types/api';

export const getPostsTags = ({
  search,
}: {
  search: string;
}): Promise<{ data: Tag[] }> => {
  return api.get('/posts/tags', {
    params: {
      search,
    },
  });
};

export const getPostsTagsQueryOptions = (search: string) => {
  return {
    queryKey: ['posts-tags', search],
    queryFn: () => getPostsTags({ search }),
  };
};

type GetPostsTagsOptions = {
  search: string;
  queryConfig?: QueryConfig<typeof getPostsTagsQueryOptions>;
};

export const usePostsTags = ({ search, queryConfig }: GetPostsTagsOptions) => {
  return useQuery({
    ...getPostsTagsQueryOptions(search),
    ...queryConfig,
  });
};
