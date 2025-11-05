import {
  Calendar,
  Globe,
  MoreHorizontal,
  TrendingUp,
  MessageCircle,
  Trash,
} from 'lucide-react';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Spinner } from '@/components/ui/spinner';
import { CreatePost } from '@/features/posts/components/create-post';
import { PostsList } from '@/features/posts/components/posts-list';
import { formatBigNumber } from '@/utils/format';

import { useCommunity } from '../api/get-community';

import { JoinCommunity } from './join-community';
import { ManageCommunityMembers } from './manage-community-members';
import { UpdateCommunity } from './update-community';

export const CommunityView = ({ communityId }: { communityId: number }) => {
  const communityQuery = useCommunity({ communityId });

  if (communityQuery.isLoading) {
    <div className="flex h-48 w-full items-center justify-center">
      <Spinner size="lg" />
    </div>;
  }
  const community = communityQuery?.data?.data;

  if (!community) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 opacity-20">
          <img
            src={
              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop'
            }
            alt="W/"
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="-mt-6 flex items-end gap-6 pb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                <img
                  src={community.communityAvatar}
                  alt={community.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-7 rounded-full border-4 border-white bg-green-500" />
            </div>

            {/* Title and Actions */}
            <div className="flex flex-1 items-end justify-between pb-1">
              <div>
                <h1 className="mb-1 text-3xl font-bold text-gray-900">
                  w/{community.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {community.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreatePost communityId={community.id} />
                <JoinCommunity id={community.id}></JoinCommunity>
                <ManageCommunityMembers communityId={community.id} />

                {/* Moderation Actions */}
                <button className="flex size-10 items-center justify-center rounded-full border border-gray-300 transition-colors duration-200 hover:bg-gray-50">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="size-5 text-gray-600" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        asChild
                      >
                        <div>
                          <UpdateCommunity communityId={community.id} />
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash className="size-5 text-gray-600" />
                        Delete Community
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-8 border-t border-gray-100 text-sm font-medium">
            <button className="border-b-2 border-blue-600 px-1 py-3 text-blue-600">
              Posts
            </button>
            <button className="px-1 py-3 text-gray-500 transition-colors hover:text-gray-900">
              About
            </button>
            <button className="px-1 py-3 text-gray-500 transition-colors hover:text-gray-900">
              Rules
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex gap-6">
          {/* Posts Area */}
          <div className="flex-1 space-y-4">
            <PostsList communityId={community.id}></PostsList>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-6 w-80 space-y-4 self-start">
            {/* About Community */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h3 className="font-bold text-white">About Community</h3>
              </div>
              <div className="space-y-4 p-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {community.shortDescription}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="size-4" />
                  {/* 2025-10-29T05:42:19.919581Z */}
                  <span>Created {community.createdAt}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {community.isPrivate ? (
                    <>
                      <Globe className="size-4" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Globe className="size-4" />
                      <span>Public</span>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatBigNumber(community.totalMembers)}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                      {formatBigNumber(12000)}
                      <TrendingUp className="size-4 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500">Weekly posts</div>
                  </div>
                </div>

                <button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700">
                  Create Post
                </button>
              </div>
            </div>

            {/* Moderators */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900">MODERATORS</h3>
              </div>
              <div className="p-4">
                <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
                  <MessageCircle className="size-4" />
                  Message Mods
                </button>
                <div className="space-y-3">
                  {community.moderators.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-50"
                    >
                      <img
                        src={
                          mod.avatar ||
                          'https://avatar.iran.liara.run/public/17'
                        }
                        alt={mod.username}
                        className="size-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {mod.username}
                      </span>
                    </div>
                  ))}
                  <button className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
                    View all moderators
                  </button>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
                  <svg
                    className="size-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-blue-900">
                    Community Guidelines
                  </h4>
                  <p className="text-xs leading-relaxed text-blue-700">
                    Please be respectful and constructive. Read our rules before
                    posting.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
