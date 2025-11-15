import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useUnJoinCommunity } from '../api/unjoin-community';

type JoinCommunityProps = {
  id: number;
};

export const UnJoinCommunity = ({ id }: JoinCommunityProps) => {
  const { addNotification } = useNotifications();
  const unJoinCommunityMutation = useUnJoinCommunity({
    communityId: id,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Left Community',
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      isDone={unJoinCommunityMutation.isSuccess}
      icon="info"
      title="Leave this community"
      body="Are you sure you want to leave this community?"
      triggerButton={
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-gray-500 to-slate-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-gray-600 hover:to-slate-600 hover:shadow-xl hover:shadow-slate-500/40"
        >
          Leave Community
        </Button>
      }
      confirmButton={
        <Button
          isLoading={unJoinCommunityMutation.isPending}
          type="button"
          variant="outline"
          onClick={() => unJoinCommunityMutation.mutate({ communityId: id })}
        >
          Leave
        </Button>
      }
    ></ConfirmationDialog>
  );
};
