import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useCommunityMembers } from '../../api/get-community-members';
import { MembersTable } from '../manage-members/members-table';

type MembersSectionProps = {
  communityId: number;
};

export const MembersSection = ({ communityId }: MembersSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'approved' | 'pending'
  >('all');

  // Fetch members based on status and search
  const membersQuery = useCommunityMembers({
    communityId,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery,
  });

  const members = membersQuery.data?.data || [];

  return (
    <div className="flex h-full flex-col">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-8 py-4">
        {/* Search Bar and Status Filter */}
        <div className="flex flex-1 items-center gap-3">
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

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as 'all' | 'approved' | 'pending')
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
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
    </div>
  );
};
