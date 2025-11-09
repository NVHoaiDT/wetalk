import { Edit2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useSetCommunityMod } from '../../api/set-community-mod';

type SetModeratorButtonProps = {
  communityId: number;
  memberId: number;
  memberName: string;
};

export const SetModeratorButton = ({
  communityId,
  memberId,
  memberName,
}: SetModeratorButtonProps) => {
  const { isOpen, open, close } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>(
    'member',
  );
  const { addNotification } = useNotifications();

  const setModeratorMutation = useSetCommunityMod({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Role Updated',
          message: `${memberName}'s role has been updated to ${selectedRole}`,
        });
        close();
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Update Role',
          message: error.message,
        });
      },
    },
  });

  const handleConfirm = () => {
    setModeratorMutation.mutate({
      communityId,
      userId: memberId,
      role: selectedRole,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (isDialogOpen) {
          setSelectedRole('member');
          open();
        } else {
          close();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:shadow-md"
          aria-label="Edit member"
        >
          <Edit2 className="size-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Moderator Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Change the role for{' '}
            <span className="font-semibold">{memberName}</span> in this
            community.
          </p>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role
            </label>
            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setSelectedRole(value as 'admin' | 'member')
              }
            >
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={close}
            disabled={setModeratorMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            isLoading={setModeratorMutation.isPending}
          >
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
