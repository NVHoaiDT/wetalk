import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';

import { useApproveMember } from '../../api/approve-member';

type ApproveMemberButtonProps = {
  communityId: number;
  memberId: number;
  memberName: string;
};

export const ApproveMemberButton = ({
  communityId,
  memberId,
  memberName,
}: ApproveMemberButtonProps) => {
  const { addNotification } = useNotifications();

  const approveMemberMutation = useApproveMember({
    communityId,
    mutationConfig: {
      onSuccess: (_, variables) => {
        const action =
          variables.status === 'approved' ? 'approved' : 'rejected';
        addNotification({
          type: 'success',
          title: `Member ${action}`,
          message: `${memberName} has been ${action}`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Action Failed',
          message: error.message,
        });
      },
    },
  });

  const handleApprove = () => {
    approveMemberMutation.mutate({
      communityId,
      userId: memberId,
      status: 'approved',
    });
  };

  const handleReject = () => {
    approveMemberMutation.mutate({
      communityId,
      userId: memberId,
      status: 'rejected',
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleApprove}
        size="sm"
        variant="ghost"
        disabled={approveMemberMutation.isPending}
        className="h-8 px-3 text-green-600 hover:bg-green-50 hover:text-green-700"
        icon={<Check className="size-4" />}
      >
        Approve
      </Button>
      <Button
        onClick={handleReject}
        size="sm"
        variant="ghost"
        disabled={approveMemberMutation.isPending}
        className="h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
        icon={<X className="size-4" />}
      >
        Reject
      </Button>
    </div>
  );
};
