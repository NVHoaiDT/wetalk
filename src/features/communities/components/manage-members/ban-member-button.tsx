import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useBanCommunityMember } from '../../api/ban-community-member';

type BanMemberButtonProps = {
  communityId: number;
  memberId: number;
  memberName: string;
};

export const BanMemberButton = ({
  communityId,
  memberId,
  memberName,
}: BanMemberButtonProps) => {
  const { addNotification } = useNotifications();
  const banMemberMutation = useBanCommunityMember({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Member Removed',
          message: `${memberName} has been removed from the community`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Remove Member',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      icon="danger"
      title="Remove Member"
      body={`Are you sure you want to remove ${memberName} from this community? This action cannot be undone.`}
      triggerButton={
        <button
          className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
          aria-label="Remove member"
        >
          <Trash2 className="size-4" />
        </button>
      }
      confirmButton={
        <Button
          isLoading={banMemberMutation.isPending}
          type="button"
          variant="destructive"
          onClick={() => banMemberMutation.mutate({ communityId, memberId })}
        >
          Remove Member
        </Button>
      }
      isDone={banMemberMutation.isSuccess}
    />
  );
};
