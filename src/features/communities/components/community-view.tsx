import { MoreHorizontal, Trash } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Spinner } from '@/components/ui/spinner';
import { CreatePost } from '@/features/posts/components/create-post';
import { PostsList } from '@/features/posts/components/posts-list';
import { fancyLog } from '@/helper/fancy-log';
import { Authorization, POLICIES } from '@/lib/authorization';

import { useCommunity } from '../api/get-community';

import { CommunitySidebar } from './community-sidebar';
import { JoinCommunity } from './join-community';
import { ModToolsDialog } from './mod-tools/mod-tools-dialog';
import { SettingsCommunity } from './setting-community';
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

  fancyLog('Community-Data:', community);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-r from-blue-400 via-blue-400 to-indigo-400">
        <div className="absolute inset-0 opacity-20">
          <img
            src={community.coverImage}
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
                <Authorization
                  policyCheck={POLICIES['post:create'](community.isFollow)}
                >
                  <CreatePost communityId={community.id} />
                </Authorization>

                <JoinCommunity id={community.id}></JoinCommunity>

                {/* More Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex size-10 items-center justify-center rounded-full border border-gray-300 transition-colors duration-200 hover:bg-gray-50">
                      <MoreHorizontal className="size-5 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent sideOffset={12} align="end">
                    {/* Update Community's Appearance */}
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      asChild
                    >
                      <UpdateCommunity communityId={community.id} />
                    </DropdownMenuItem>

                    {/* Community Settings */}
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      asChild
                    >
                      <SettingsCommunity communityId={community.id} />
                    </DropdownMenuItem>

                    {/* Mod Tools */}
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      asChild
                    >
                      <ModToolsDialog communityId={community.id} />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex w-full flex-row justify-start gap-2 border-b border-gray-200 px-2 py-1.5 text-sm font-normal text-destructive focus:text-destructive">
                      <Trash className="size-5" />
                      Delete Community
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
          <CommunitySidebar community={community} />
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
