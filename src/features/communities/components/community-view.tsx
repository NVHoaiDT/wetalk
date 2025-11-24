import { LockKeyhole, ClockFading, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

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
import { useCurrentUser } from '@/lib/auth';
import { Authorization, POLICIES } from '@/lib/authorization';
import { User } from '@/types/api';

import { useCommunity } from '../api/get-community';

import { CommunitySidebar } from './community-sidebar';
import { JoinCommunity } from './join-community';
import { ModToolsDialog } from './mod-tools/mod-tools-dialog';
import { SettingsCommunity } from './setting-community';
import { UnJoinCommunity } from './unjoin-community';
import { UpdateCommunity } from './update-community';

export const CommunityView = ({ communityId }: { communityId: number }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'rules'>(
    'posts',
  );
  const communityQuery = useCommunity({ communityId });
  const currentUserQuery = useCurrentUser();

  if (communityQuery.isLoading || currentUserQuery.isLoading) {
    <div className="flex h-48 w-full items-center justify-center">
      <Spinner size="lg" />
    </div>;
  }

  const community = communityQuery?.data?.data;
  const currentUser = currentUserQuery?.data?.data;

  if (!community) return null;

  const isPrivateAndNotRequest =
    community.isPrivate && !community.isFollow && !community.isRequestJoin;
  const isPrivateAndNotApproved =
    community.isPrivate && !community.isFollow && community.isRequestJoin;

  fancyLog('Community-Data:', community);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden rounded-xl bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-200">
        <div className="absolute inset-0 opacity-50">
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
                  src={
                    community.communityAvatar ||
                    'https://b.thumbs.redditmedia.com/J_fCwTYJkoM-way-eaOHv8AOHoF_jNXNqOvPrQ7bINY.png'
                  }
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

                {/* Super Admin (community's creator) cannot leave community (they're joined by default) */}
                <Authorization
                  policyCheck={
                    !POLICIES['community:superAdmin'](
                      currentUser as User,
                      community.moderators,
                    )
                  }
                >
                  {community.isFollow ? (
                    <UnJoinCommunity id={community.id} />
                  ) : (
                    <JoinCommunity id={community.id} />
                  )}
                </Authorization>

                {/* More Actions */}
                <Authorization
                  policyCheck={POLICIES['community:moderate'](
                    currentUser as User,
                    community.moderators,
                  )}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-semibold text-gray-600 shadow-lg transition-colors duration-200 hover:bg-gray-50">
                        <MoreHorizontal className="size-5 text-gray-600" />
                        <span>Moderate</span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent sideOffset={12} align="end">
                      {/* Update Community's Appearance */}
                      <Authorization
                        policyCheck={POLICIES['community:superAdmin'](
                          currentUser as User,
                          community.moderators,
                        )}
                      >
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          asChild
                        >
                          <UpdateCommunity communityId={community.id} />
                        </DropdownMenuItem>
                      </Authorization>

                      <Authorization
                        policyCheck={POLICIES['community:superAdmin'](
                          currentUser as User,
                          community.moderators,
                        )}
                      >
                        {/* Community Settings */}
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          asChild
                        >
                          <SettingsCommunity communityId={community.id} />
                        </DropdownMenuItem>
                      </Authorization>

                      {/* Mod Tools */}
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        asChild
                      >
                        <ModToolsDialog communityId={community.id} />
                      </DropdownMenuItem>

                      <Authorization
                        policyCheck={POLICIES['community:superAdmin'](
                          currentUser as User,
                          community.moderators,
                        )}
                      >
                        <DropdownMenuItem className="flex w-full flex-row justify-start gap-2 border-b border-gray-200 px-2 py-1.5 text-sm font-normal text-destructive focus:text-destructive">
                          <Trash className="size-5" />
                          Delete Community
                        </DropdownMenuItem>
                      </Authorization>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Authorization>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-8 border-t border-gray-100 text-sm font-medium">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-1 py-3 transition-colors ${
                activeTab === 'posts'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-1 py-3 transition-colors ${
                activeTab === 'about'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-1 py-3 transition-colors ${
                activeTab === 'rules'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Rules
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex gap-6">
          {/* Posts Area */}
          {activeTab === 'posts' && (
            <>
              {/* TODO: Switch between three conditions: Private and Not Request, Private and not Approved, Public */}
              {isPrivateAndNotRequest ? (
                <div className="flex-1">
                  <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto max-w-md space-y-4">
                      {/* Lock Icon */}
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50">
                        <LockKeyhole className="size-8 text-blue-600" />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          This is a Private Community
                        </h2>
                        <p className="text-gray-600">
                          Only members can view and participate in this
                          community&apos;s posts. Join to unlock exclusive
                          content and discussions.
                        </p>
                      </div>

                      <div className="pt-2">
                        <JoinCommunity id={community.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : isPrivateAndNotApproved ? (
                <div className="flex-1">
                  <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto max-w-md space-y-4">
                      {/* Lock Icon */}
                      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50">
                        <ClockFading className="size-8 text-amber-600" />
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Request Pending
                        </h2>
                        <p className="text-gray-600">
                          Your request to join this private community is pending
                          approval. You&apos;ll be notified once a moderator
                          reviews your request.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  <PostsList communityId={community.id}></PostsList>
                </div>
              )}
            </>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="flex-1">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <img
                  src="https://res.cloudinary.com/djwpst00v/image/upload/v1763964381/about_y2vtcs.svg"
                  alt="rules illustration"
                  className="mx-auto size-64 rounded-full"
                />
                <h2 className="mb-4 mt-8 text-center text-2xl font-bold text-gray-900">
                  About w/{community.name}
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {community.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="flex-1">
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto max-w-md space-y-4">
                  <img
                    src="https://res.cloudinary.com/djwpst00v/image/upload/v1763964103/rules_mzdcda.svg"
                    alt="rules illustration"
                    className="mx-auto size-64 rounded-full"
                  />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Community Rules
                    </h2>
                    <p className="text-gray-600">
                      This section will be coming soon. Stay tuned for community
                      guidelines and rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <CommunitySidebar community={community} />
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
