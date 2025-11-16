/* 
{
  id: number;
  title: string;
  community: {
    id: number;
    name: string;
  };
  createdAt: string;
}
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { MutationConfig } from '@/lib/react-query';
import { RecentPost } from '@/types/api';

export const addRecentPostInputSchema = z.object({
  id: z.number(),
  title: z.string(),
  community: z.object({
    id: z.number(),
    name: z.string(),
  }),
  createdAt: z.string(),
});

export type AddRecentPostInput = z.infer<typeof addRecentPostInputSchema>;

export const addRecentPost = ({
  data,
}: {
  data: AddRecentPostInput;
}): Promise<RecentPost> => {
  return new Promise((resolve) => {
    /*
       Instead of call api as usual, we put the data into local storage
       Should store only 5 recent posts (the most recent ones, new items push out old ones)     
    */
    const STORAGE_KEY = 'recent-posts';
    const MAX_RECENT = 5;
    // Get existing recent posts from localStorage
    const existingData = localStorage.getItem(STORAGE_KEY);
    let recentPosts: RecentPost[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Remove the post if it already exists (to re-add it at the front)
    recentPosts = recentPosts.filter((post) => post.id !== data.id);

    // Add the new post at the beginning
    recentPosts.unshift(data);

    // Keep only the most recent MAX_RECENT posts
    if (recentPosts.length > MAX_RECENT) {
      recentPosts = recentPosts.slice(0, MAX_RECENT);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentPosts));

    resolve(data);
  });
};

type UseAddRecentPostOptions = {
  mutationConfig?: MutationConfig<typeof addRecentPost>;
};

export const useAddRecentPost = ({
  mutationConfig,
}: UseAddRecentPostOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['recent-posts'],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addRecentPost,
  });
};
