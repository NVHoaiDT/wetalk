import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAI } from '@/lib/api-client';

export type SuggestionPost = {
  id: number;
  communityId: number;
  communityName: string;
  communityAvatar: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  title: string;
  type: string;
  tags: string[];
  vote: number;
  commentCount: number;
  createdAt: string;
  score: number;
};

export type SuggestionCommunity = {
  id: number;
  name: string;
  shortDescription: string;
  topic: string[];
  communityAvatar: string;
  isPrivate: boolean;
  totalMembers: number;
  score: number;
};

export type SearchSuggestionsResponse = {
  success: boolean;
  message: string;
  data: {
    posts: SuggestionPost[];
    communities: SuggestionCommunity[];
  };
};

const getSearchSuggestions = (
  query: string,
): Promise<SearchSuggestionsResponse> => {
  return apiAI.get(`/search?query=${encodeURIComponent(query)}`);
};

export const getSearchSuggestionsOptions = (query: string) =>
  queryOptions({
    queryKey: ['search-suggestions', query],
    queryFn: () => getSearchSuggestions(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30,
  });

export const useSearchSuggestions = (query: string) => {
  return useQuery(getSearchSuggestionsOptions(query));
};
