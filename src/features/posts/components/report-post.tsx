import { Flag, Info } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { useDisclosure } from '@/hooks/use-disclosure';

import { useReportPost } from '../api/report-post';

type ReportPostProps = {
  postId: number;
  children?: React.ReactNode;
};

type ReportReason = {
  id: string;
  label: string;
  description: string;
};

const REPORT_REASONS: ReportReason[] = [
  {
    id: 'threatening-violence',
    label: 'Threatening violence',
    description:
      'Content that threatens, encourages, or incites violence against individuals or groups.',
  },
  {
    id: 'hate',
    label: 'Hate',
    description:
      'Content that promotes hate or discrimination based on identity or vulnerability.',
  },
  {
    id: 'minor-abuse',
    label: 'Minor abuse or sexualization',
    description:
      'Content that sexualizes, abuses, or otherwise exploits minors.',
  },
  {
    id: 'personal-info',
    label: 'Sharing personal information',
    description:
      "Content that shares or threatens to share someone's private personal information.",
  },
  {
    id: 'non-consensual-media',
    label: 'Non-consensual intimate media',
    description:
      'Content that shares intimate or sexually explicit media without consent.',
  },
  {
    id: 'prohibited-transaction',
    label: 'Prohibited transaction',
    description:
      'Content that facilitates or solicits illegal transactions or goods.',
  },
  {
    id: 'impersonation',
    label: 'Impersonation',
    description:
      'Content that impersonates individuals or entities in a misleading way.',
  },
  {
    id: 'copyright',
    label: 'Copyright violation',
    description:
      'Content that infringes on copyright or intellectual property rights.',
  },
  {
    id: 'trademark',
    label: 'Trademark violation',
    description: 'Content that infringes on trademark rights.',
  },
  {
    id: 'self-harm',
    label: 'Self-harm or suicide',
    description:
      'Content that encourages, glorifies, or provides instructions for self-harm or suicide.',
  },
  {
    id: 'spam',
    label: 'Spam',
    description:
      'Repeated, unwanted, or unsolicited content that negatively affects communities and users.',
  },
];

export const ReportPost = ({ postId, children }: ReportPostProps) => {
  const { isOpen, open, close } = useDisclosure();
  const { addNotification } = useNotifications();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [step, setStep] = useState<'reasons' | 'details'>('reasons');

  const reportPostMutation = useReportPost({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Post Reported Successfully',
          message: 'Thank you for helping keep our community safe.',
        });
        // Reset form and close dialog
        setSelectedReasons([]);
        setNote('');
        setStep('reasons');
        close();
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Failed to Report Post',
          message: error.message,
        });
      },
    },
  });

  const toggleReason = (reasonId: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reasonId)) {
        return prev.filter((id) => id !== reasonId);
      }
      // Limit to 5 reasons as per API schema
      if (prev.length >= 5) {
        addNotification({
          type: 'warning',
          title: 'Maximum Reasons Reached',
          message: 'You can select up to 5 reasons.',
        });
        return prev;
      }
      return [...prev, reasonId];
    });
  };

  const handleNext = () => {
    if (selectedReasons.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Reason Selected',
        message: 'Please select at least one reason to report this post.',
      });
      return;
    }
    setStep('details');
  };

  const handleBack = () => {
    setStep('reasons');
  };

  const handleSubmit = () => {
    reportPostMutation.mutate({
      postId,
      reasons: selectedReasons,
      note: note.trim() || undefined,
    });
  };

  const selectedReasonDetailsList = REPORT_REASONS.filter((reason) =>
    selectedReasons.includes(reason.id),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (isDialogOpen) {
          setSelectedReasons([]);
          setNote('');
          setStep('reasons');
          open();
        } else {
          close();
        }
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <button
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100"
            onClick={open}
          >
            <Flag className="size-4" />
            <span>Report</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Submit a report
          </DialogTitle>
          <p className="mt-2 text-sm text-gray-600">
            Thanks for looking out for yourself and your fellow redditors by
            reporting things that break the rules. Let us know what&apos;s
            happening, and we&apos;ll look into it.
          </p>
        </DialogHeader>

        {/* Content */}
        <div className="h-[calc(90vh-200px)] overflow-y-auto">
          {step === 'reasons' ? (
            /* Step 1: Reasons Selection */
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {REPORT_REASONS.map((reason) => {
                  const isSelected = selectedReasons.includes(reason.id);
                  return (
                    <button
                      key={reason.id}
                      onClick={() => toggleReason(reason.id)}
                      className={`rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{reason.label}</span>
                        {isSelected && (
                          <div className="flex size-5 items-center justify-center rounded-full bg-blue-600">
                            <svg
                              className="size-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Reasons Details - Stacked */}
              {selectedReasonDetailsList.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Selected violations:
                  </h3>
                  {selectedReasonDetailsList.map((reason) => (
                    <div
                      key={reason.id}
                      className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                    >
                      <h4 className="mb-1 font-semibold text-blue-900">
                        {reason.label}
                      </h4>
                      <p className="text-sm text-blue-700">
                        {reason.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="mt-6 flex gap-2 rounded-lg bg-blue-50 p-3">
                <Info className="mt-0.5 size-5 shrink-0 text-blue-600" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium text-gray-700">
                    Not sure if something is breaking the rules?
                  </p>
                  <p className="mt-1">
                    Review the community rules and platform guidelines before
                    reporting.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Step 2: Additional Details */
            <div className="p-6">
              {/* Show selected reasons summary */}
              <div className="mb-6">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Reporting for:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedReasonDetailsList.map((reason) => (
                    <span
                      key={reason.id}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                    >
                      {reason.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Note */}
              <div>
                <label
                  htmlFor="report-note"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Additional information (optional)
                </label>
                <textarea
                  id="report-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide any additional context that might help us review this report..."
                  maxLength={500}
                  rows={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {note.length}/500 characters
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-gray-200 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedReasons.length} reason
              {selectedReasons.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              {step === 'details' && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                onClick={close}
                disabled={reportPostMutation.isPending}
              >
                Cancel
              </Button>
              {step === 'reasons' ? (
                <Button
                  onClick={handleNext}
                  disabled={selectedReasons.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={reportPostMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Report
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
