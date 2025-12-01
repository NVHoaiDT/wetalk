import { Spinner } from '@/components/ui/spinner';
import {
  TableElement,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { CommunityMember } from '@/types/api';
import { formatDate } from '@/utils/format';

import { ApproveMemberButton } from './approve-member-button';
import { BanMemberButton } from './ban-member-button';
import { SetModeratorButton } from './set-moderator-button';

type MembersTableProps = {
  members: CommunityMember[];
  communityId: number;
  isLoading?: boolean;
  role: string;
};

export const MembersTable = ({
  members,
  communityId,
  isLoading,
  role,
}: MembersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p className="text-lg font-medium">No members found</p>
        <p className="text-sm text-gray-400">
          Try adjusting your search filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <TableElement>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-2/5 font-semibold text-gray-700">
              USERNAME
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              STATUS
            </TableHead>
            <TableHead className="font-semibold text-gray-700">ROLE</TableHead>
            <TableHead className="font-semibold text-gray-700">
              JOINED
            </TableHead>
            <TableHead className="w-[100px] text-right font-semibold text-gray-700">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.userId}
              className="transition-colors hover:bg-gray-50"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="size-10 rounded-full border-2 border-gray-200 object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      u/{member.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.karma} karma
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {member.status === 'approved' ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{member.role}</span>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {formatDate(member.subscribedAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {member.status === 'pending' ? (
                    <ApproveMemberButton
                      communityId={communityId}
                      memberId={member.userId}
                      memberName={member.username}
                    />
                  ) : (
                    /* admin | super */
                    <>
                      {role === 'super_admin' && (
                        <SetModeratorButton
                          communityId={communityId}
                          memberId={member.userId}
                          memberName={member.username}
                        />
                      )}

                      {role === 'super_admin' ||
                      (role === 'admin' && member.role === 'user') ? (
                        <BanMemberButton
                          communityId={communityId}
                          memberId={member.userId}
                          memberName={member.username}
                        />
                      ) : null}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableElement>
    </div>
  );
};
