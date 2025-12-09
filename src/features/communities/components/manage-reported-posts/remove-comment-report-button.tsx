import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { useRemoveCommunityCommentReport } from '../../api/remove-community-comment-report';

type RemoveCommentReportButtonProps = {
  communityId: number;
  reportId: number;
};

export const RemoveCommentReportButton = ({
  communityId,
  reportId,
}: RemoveCommentReportButtonProps) => {
  const { addNotification } = useNotifications();
  const removeReportMutation = useRemoveCommunityCommentReport({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Report Dismissed',
          message: `The report has been dismissed. The comment remains visible.`,
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
    <ConfirmationDialog
      icon="info"
      title="Dismiss Report"
      body="Are you sure you want to dismiss this report? The comment will remain visible."
      triggerButton={
        <button
          className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 hover:shadow-md"
          aria-label="Dismiss report"
        >
          <CheckCircle className="size-4" />
        </button>
      }
      confirmButton={
        <Button
          isLoading={removeReportMutation.isPending}
          type="button"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => removeReportMutation.mutate({ communityId, reportId })}
        >
          Dismiss Report
        </Button>
      }
      isDone={removeReportMutation.isSuccess}
    />
  );
};
