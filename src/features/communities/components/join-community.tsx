import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

import { useJoinCommunity } from '../api/join-community';

type JoinCommunityProps = {
  id: number;
};

export const JoinCommunityFallback = ({ id }: JoinCommunityProps) => {
  const { addNotification } = useNotifications();
  const joinCommunityMutation = useJoinCommunity({
    communityId: id,
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
    <ConfirmationDialog
      isDone={joinCommunityMutation.isSuccess}
      icon="info"
      title="Join this community"
      body="By joining this community you agree to our terms and conditions"
      triggerButton={
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
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
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Seem like you're not logged in 🤔"
      body="Sign up or log in to join this community and participate in discussions"
      triggerButton={
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Join Community
        </Button>
      }
      confirmButton={
        <Link to={paths.auth.register.getHref(location.pathname)} replace>
          Sign up
        </Link>
      }
    ></ConfirmationDialog>
  );
};

export const JoinCommunity = ({ id }: JoinCommunityProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={<JoinCommunityFallback id={id} />}
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
