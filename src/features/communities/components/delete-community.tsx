import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useDeleteCommunity } from '../api/delete-community';

type DeleteCommunityProps = {
  communityId: number;
};

export const DeleteCommunity = ({ communityId }: DeleteCommunityProps) => {
  const { addNotification } = useNotifications();
  const deleteCommunityMutation = useDeleteCommunity({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Community Deleted',
        });
      },

      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Deleting Community',
          message: error.message,
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      isDone={deleteCommunityMutation.isSuccess}
      icon="danger"
      title="Delete Community"
      body="Are you sure you want to delete this community?"
      triggerButton={
        <Button
          variant="destructive"
          size="sm"
          icon={<Trash className="size-4" />}
        >
          Delete Community
        </Button>
      }
      confirmButton={
        <Button
          isLoading={deleteCommunityMutation.isPending}
          type="button"
          variant="destructive"
          onClick={() =>
            deleteCommunityMutation.mutate({ communityId: communityId })
          }
        >
          Delete Community
        </Button>
      }
    />
  );
};
