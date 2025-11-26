import { XCircle } from 'lucide-react';

import { useNotifications } from '@/components/ui/notifications';
import { useRemoveCommunityPostReport } from '@/features/communities/api/remove-community-post-report';

type RemoveReportButtonProps = {
  communityId: number;
  reportId: number;
};

export const RemoveReportButton = ({
  communityId,
  reportId,
}: RemoveReportButtonProps) => {
  const { addNotification } = useNotifications();
  const removeReportMutation = useRemoveCommunityPostReport({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Report Dismissed',
          message: `The report has been dismissed. The post remains visible.`,
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Dismiss Report',
          message: error.message || 'Something went wrong',
        });
      },
    },
  });

  return (
    <button
      onClick={() => removeReportMutation.mutate({ communityId, reportId })}
      disabled={removeReportMutation.isPending}
      className="flex flex-row items-center justify-center gap-2 rounded-md border border-input px-3 py-1.5 text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50"
      title="Dismiss reports but keep the post"
    >
      <XCircle className="size-4" />
      Dismiss
    </button>
  );
};
