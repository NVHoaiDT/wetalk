/* 
{
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  topic: string[];
  communityAvatar: string;
  coverImage: string;
  isPrivate: boolean;
  createdAt: string;
  totalMembers: number;
  moderators: Moderators[];
};
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { MutationConfig } from '@/lib/react-query';
import { RecentCommunity } from '@/types/api';

export const addRecentCommunityInputSchema = z.object({
  id: z.number(),
  name: z.string(),
  communityAvatar: z.string().url(),
  isPrivate: z.boolean(),
  totalMembers: z.number(),
});

export type AddRecentCommunityInput = z.infer<
  typeof addRecentCommunityInputSchema
>;

export const addRecentCommunity = ({
  data,
}: {
  data: AddRecentCommunityInput;
}): Promise<RecentCommunity> => {
  return new Promise((resolve) => {
    /*
       Instead of call api as usual, we put the data into local storage
       Should store only 5 recent communities (the most recent ones, new items push out old ones)     
    */
    const STORAGE_KEY = 'recent-communities';
    const MAX_RECENT = 5;

    // Get existing recent communities from localStorage
    const existingData = localStorage.getItem(STORAGE_KEY);
    let recentCommunities: RecentCommunity[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Remove the community if it already exists (to re-add it at the front)
    recentCommunities = recentCommunities.filter(
      (community) => community.id !== data.id,
    );

    // Add the new community at the beginning
    recentCommunities.unshift(data);

    // Keep only the most recent MAX_RECENT communities
    if (recentCommunities.length > MAX_RECENT) {
      recentCommunities = recentCommunities.slice(0, MAX_RECENT);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCommunities));

    resolve(data);
  });
};

type UseAddRecentCommunityOptions = {
  mutationConfig?: MutationConfig<typeof addRecentCommunity>;
};

export const useAddRecentCommunity = ({
  mutationConfig,
}: UseAddRecentCommunityOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['recent-communities'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addRecentCommunity,
  });
};
