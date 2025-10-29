import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
/* import { Authorization, ROLES } from '@/lib/authorization'; */

import { useJoinCommunity } from '../api/join-community';

type JoinCommunityProps = {
  id: number;
};

export const JoinCommunity = ({ id }: JoinCommunityProps) => {
  const { addNotification } = useNotifications();
  const joinCommunityMutation = useJoinCommunity({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Joined Community',
        });
      },
    },
  });

  return (
    /* <Authorization allowedRoles={[ROLES.ADMIN]}> */
    <ConfirmationDialog
      icon="info"
      title="Join this community"
      body="Are you sure you want to join this community?"
      triggerButton={
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Join Community
        </Button>
      }
      confirmButton={
        <Button
          isLoading={joinCommunityMutation.isPending}
          type="button"
          variant="outline"
          onClick={() => joinCommunityMutation.mutate({ communityId: id })}
        >
          Join
        </Button>
      }
    ></ConfirmationDialog>
    /* </Authorization> */
  );
};
