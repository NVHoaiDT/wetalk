import { MoreHorizontal, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useCommunityMembers } from '../api/get-community-members';

import { MembersTable } from './manage-members/members-table';

type TabType = 'member' | 'moderator' | 'invites' | 'banned';

type ManageCommunityMembersProps = {
  communityId: number;
};

export const ManageCommunityMembers = ({
  communityId,
}: ManageCommunityMembersProps) => {
  const { isOpen, open, close } = useDisclosure();
  const [activeTab, setActiveTab] = useState<TabType>('member');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch members based on active tab and search
  const membersQuery = useCommunityMembers({
    communityId,
    search: searchQuery,
  });

  const members = membersQuery.data?.data || [];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'member', label: 'Member' },
    { id: 'moderator', label: 'Moderator' },
    { id: 'invites', label: 'Invites' },
    { id: 'banned', label: 'Banned' },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (isDialogOpen) {
          setActiveTab('member');
          setSearchQuery('');
          open();
        } else {
          close();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={open}
          size="sm"
          variant="outline"
          icon={<Users className="size-4" />}
          className="border-gray-300 bg-white font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
        >
          Manage Members
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[90vh] max-w-5xl overflow-hidden p-0">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white">
              {tabs.find((tab) => tab.id === activeTab)?.label || 'Members'}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200 bg-white px-8">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-8 py-4">
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              icon={<Plus className="size-4" />}
              className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              Invite Member
            </Button>
            <button
              className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-50"
              aria-label="More options"
            >
              <MoreHorizontal className="size-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="max-h-[calc(90vh-300px)] overflow-y-auto px-8 py-6">
          <MembersTable
            members={members}
            communityId={communityId}
            isLoading={membersQuery.isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
