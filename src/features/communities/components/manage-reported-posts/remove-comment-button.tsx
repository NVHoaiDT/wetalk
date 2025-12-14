import { AlertTriangle, Ban, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';

import { usePenalizeCommunityMember } from '../../api/penalize-community-members';
import { useRemoveCommunityComment } from '../../api/remove-community-comment';

type PenalizeOption = 'none' | 'warning' | 'temporary_ban' | 'permanent_ban';

type RemoveCommentButtonProps = {
  communityId: number;
  commentId: number;
  authorId: number;
};

export const RemoveCommentButton = ({
  communityId,
  commentId,
  authorId,
}: RemoveCommentButtonProps) => {
  const { addNotification } = useNotifications();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [penalizeOption, setPenalizeOption] = useState<PenalizeOption>('none');
  const [expiresAt, setExpiresAt] = useState('');
  const [reason, setReason] = useState('');

  const removeCommentMutation = useRemoveCommunityComment({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Removed',
          message: 'The comment has been permanently removed',
        });

        if (penalizeOption !== 'none') {
          handlePenalize();
        } else {
          resetAndClose();
        }
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Remove Comment',
          message: error.message || 'Something went wrong',
        });
      },
    },
  });

  const penalizeMutation = usePenalizeCommunityMember({
    communityId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'User Penalized',
          message: 'The user has been penalized successfully',
        });
        resetAndClose();
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Penalize User',
          message: error.message || 'Something went wrong',
        });
        resetAndClose();
      },
    },
  });

  const handlePenalize = () => {
    const payload: any = {
      userId: authorId,
      restrictionType: penalizeOption,
    };

    if (reason) {
      payload.reason = reason;
    }

    if (penalizeOption === 'temporary_ban' && expiresAt) {
      payload.expiresAt = new Date(expiresAt).toISOString();
    }

    penalizeMutation.mutate({ communityId, data: payload });
  };

  const handleConfirmRemove = () => {
    if (penalizeOption === 'temporary_ban' && !expiresAt) {
      addNotification({
        type: 'error',
        title: 'Expiration Date Required',
        message: 'Please select an expiration date for temporary ban',
      });
      return;
    }

    removeCommentMutation.mutate({ communityId, commentId });
  };

  const resetAndClose = () => {
    setIsConfirmOpen(false);
    setPenalizeOption('none');
    setExpiresAt('');
    setReason('');
  };

  const handleCancel = () => {
    resetAndClose();
  };

  const isLoading =
    removeCommentMutation.isPending || penalizeMutation.isPending;

  return (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogTrigger asChild>
        <button
          className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
          aria-label="Remove comment"
        >
          <Trash2 className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-red-600" />
            Remove Comment
          </DialogTitle>
          <DialogDescription>
            This action will permanently delete this comment. You can optionally
            penalize the author.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Penalize Author (Optional)
            </div>

            <div className="space-y-2">
              {/* None */}
              <button
                type="button"
                onClick={() => setPenalizeOption('none')}
                className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                  penalizeOption === 'none'
                    ? 'border-gray-400 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-5 items-center justify-center rounded-full border-2 ${
                    penalizeOption === 'none'
                      ? 'border-gray-600 bg-gray-600'
                      : 'border-gray-300'
                  }`}
                >
                  {penalizeOption === 'none' && (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Just delete comment
                  </div>
                  <div className="text-sm text-gray-600">
                    No additional action will be taken
                  </div>
                </div>
              </button>

              {/* Warning */}
              <button
                type="button"
                onClick={() => setPenalizeOption('warning')}
                className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                  penalizeOption === 'warning'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-5 items-center justify-center rounded-full border-2 ${
                    penalizeOption === 'warning'
                      ? 'border-yellow-600 bg-yellow-600'
                      : 'border-gray-300'
                  }`}
                >
                  {penalizeOption === 'warning' && (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <AlertTriangle
                  className={`mt-0.5 size-5 ${
                    penalizeOption === 'warning'
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Warning</div>
                  <div className="text-sm text-gray-600">
                    Issue a warning to the user
                  </div>
                </div>
              </button>

              {/* Temporary Ban */}
              <button
                type="button"
                onClick={() => setPenalizeOption('temporary_ban')}
                className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                  penalizeOption === 'temporary_ban'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-5 items-center justify-center rounded-full border-2 ${
                    penalizeOption === 'temporary_ban'
                      ? 'border-orange-600 bg-orange-600'
                      : 'border-gray-300'
                  }`}
                >
                  {penalizeOption === 'temporary_ban' && (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <ShieldAlert
                  className={`mt-0.5 size-5 ${
                    penalizeOption === 'temporary_ban'
                      ? 'text-orange-600'
                      : 'text-gray-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Temporary Ban</div>
                  <div className="text-sm text-gray-600">
                    Temporarily restrict user access
                  </div>
                </div>
              </button>

              {/* Permanent Ban */}
              <button
                type="button"
                onClick={() => setPenalizeOption('permanent_ban')}
                className={`flex w-full items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                  penalizeOption === 'permanent_ban'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-5 items-center justify-center rounded-full border-2 ${
                    penalizeOption === 'permanent_ban'
                      ? 'border-red-600 bg-red-600'
                      : 'border-gray-300'
                  }`}
                >
                  {penalizeOption === 'permanent_ban' && (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <Ban
                  className={`mt-0.5 size-5 ${
                    penalizeOption === 'permanent_ban'
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Permanent Ban</div>
                  <div className="text-sm text-gray-600">
                    Permanently ban the user
                  </div>
                </div>
              </button>
            </div>

            {/* Temporary Ban Date Picker */}
            {penalizeOption === 'temporary_ban' && (
              <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <label
                  htmlFor="expiresAt"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Ban Expiration Date *
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {/* Reason (optional for all penalize types) */}
            {penalizeOption !== 'none' && (
              <div className="mt-3">
                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Reason (Optional)
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this action is being taken..."
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmRemove}
            isLoading={isLoading}
          >
            Remove Comment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
