import { Settings } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useCommunity } from '../api/get-community';
import { useToggleApprovalMember } from '../api/toggle-approval-member';
import { useToggleApprovalPost } from '../api/toggle-approval-post';

type SettingsCommunityProps = {
  communityId: number;
};

export const SettingsCommunity = ({ communityId }: SettingsCommunityProps) => {
  const { isOpen, open, close } = useDisclosure();
  const { addNotification } = useNotifications();

  const communityQuery = useCommunity({ communityId });
  const community = communityQuery?.data?.data;

  const [isRequiresMemberApproval, setIsRequiresMemberApproval] = useState(
    community?.isRequiresMemberApproval ?? false,
  );
  const [isRequiresPostApproval, setIsRequiresPostApproval] = useState(
    community?.isRequiresPostApproval ?? false,
  );

  const toggleApprovalMemberMutation = useToggleApprovalMember({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Member Approval Setting Updated',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Updating Setting',
          message: error.message,
        });
        setIsRequiresMemberApproval(!isRequiresMemberApproval);
      },
    },
  });

  const toggleApprovalPostMutation = useToggleApprovalPost({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Approval Setting Updated',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Updating Setting',
          message: error.message,
        });
        setIsRequiresPostApproval(!isRequiresPostApproval);
      },
    },
  });

  const handleMemberApprovalToggle = (checked: boolean) => {
    setIsRequiresMemberApproval(checked);
    toggleApprovalMemberMutation.mutate({
      communityId,
      requiresMemberApproval: checked,
    });
  };

  const handlePostApprovalToggle = (checked: boolean) => {
    setIsRequiresPostApproval(checked);
    toggleApprovalPostMutation.mutate({
      communityId,
      requiresPostApproval: checked,
    });
  };

  if (!community) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (isDialogOpen) {
          setIsRequiresMemberApproval(community.isRequiresMemberApproval);
          setIsRequiresPostApproval(community.isRequiresPostApproval);
          open();
        } else {
          close();
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex w-full flex-row justify-start gap-2 border-b border-gray-200 px-2 py-1.5 text-sm font-normal">
          <Settings className="size-5 text-gray-600" />
          Community Settings
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Community Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Member Approval Setting */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-medium leading-none">
                Require Member Approval
              </h4>
              <p className="text-sm text-muted-foreground">
                New members must be approved by moderators before joining
              </p>
            </div>
            <Switch
              checked={isRequiresMemberApproval}
              onCheckedChange={handleMemberApprovalToggle}
              disabled={toggleApprovalMemberMutation.isPending}
            />
          </div>

          {/* Post Approval Setting */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-medium leading-none">
                Require Post Approval
              </h4>
              <p className="text-sm text-muted-foreground">
                Posts must be approved by moderators before being published
              </p>
            </div>
            <Switch
              checked={isRequiresPostApproval}
              onCheckedChange={handlePostApprovalToggle}
              disabled={toggleApprovalPostMutation.isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
