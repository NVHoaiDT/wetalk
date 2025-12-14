import { AlertTriangle, Ban, ShieldAlert, ShieldX } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
  TableElement,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { formatDate } from '@/utils/format';

import { useBannedHistory } from '../../api/get-banned-history';

type ViewBannedHistoryButtonProps = {
  communityId: number;
  userId: number;
  username: string;
};

const restrictionIcons = {
  warning: <AlertTriangle className="size-5 text-yellow-500" />,
  temporary_ban: <ShieldAlert className="size-5 text-orange-500" />,
  permanent_ban: <Ban className="size-5 text-red-500" />,
};

const restrictionColors = {
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  temporary_ban: 'bg-orange-50 text-orange-700 border-orange-200',
  permanent_ban: 'bg-red-50 text-red-700 border-red-200',
};

const restrictionLabels = {
  warning: 'Warning',
  temporary_ban: 'Temporary Ban',
  permanent_ban: 'Permanent Ban',
};

export const ViewBannedHistoryButton = ({
  communityId,
  userId,
  username,
}: ViewBannedHistoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const bannedHistoryQuery = useBannedHistory({
    communityId,
    userId,
    queryConfig: {
      enabled: isOpen,
    },
  });

  const history = bannedHistoryQuery.data?.data || [];
  const isLoading = bannedHistoryQuery.isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="ml-2 flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition-all hover:bg-red-200"
          aria-label="View ban history"
        >
          <ShieldX className="size-3" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldX className="size-5 text-red-600" />
            Ban History: {username}
          </DialogTitle>
          <DialogDescription>
            View all warnings and bans issued to this user in this community.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-gray-500">
              <p className="text-lg font-medium">No ban history</p>
              <p className="text-sm text-gray-400">
                This user has no warnings or bans
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <TableElement>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      TYPE
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      REASON
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      ISSUED
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      EXPIRES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record) => (
                    <TableRow
                      key={record.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {
                            restrictionIcons[
                              record.restrictionType as keyof typeof restrictionIcons
                            ]
                          }
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                              restrictionColors[
                                record.restrictionType as keyof typeof restrictionColors
                              ]
                            }`}
                          >
                            {
                              restrictionLabels[
                                record.restrictionType as keyof typeof restrictionLabels
                              ]
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-900">
                          {record.reason || (
                            <span className="italic text-gray-400">
                              No reason provided
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(record.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {record.expiresAt ? (
                            formatDate(record.expiresAt)
                          ) : (
                            <span className="italic text-gray-400">N/A</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </TableElement>
            </div>
          )}
        </div>

        {!isLoading && history.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>Total restrictions:</strong> {history.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
