import { AlertCircle } from 'lucide-react';

import { fancyLog } from '@/helper/fancy-log';

import { useInfiniteCommunityReportedComments } from '../../api/get-community-reported-comments';
import { ReportedCommentsTable } from '../manage-reported-posts';

type ReportedCommentsSectionProps = {
  communityId: number;
};

export const ReportedCommentsSection = ({
  communityId,
}: ReportedCommentsSectionProps) => {
  const reportedCommentsQuery = useInfiniteCommunityReportedComments({
    communityId,
  });

  const reportedComments =
    reportedCommentsQuery.data?.pages.flatMap((page) => page.data) || [];
  const totalReports =
    reportedCommentsQuery.data?.pages[0]?.pagination?.total || 0;

  const handleLoadMore = () => {
    if (
      reportedCommentsQuery.hasNextPage &&
      !reportedCommentsQuery.isFetchingNextPage
    ) {
      reportedCommentsQuery.fetchNextPage();
    }
  };

  fancyLog('Reported-Comments', reportedComments);

  return (
    <div className="flex h-full flex-col">
      {/* Action Bar */}
      <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
        {/* Stats Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-red-500" />
            <span className="text-sm font-semibold text-gray-700">
              Reported Comments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Reports:</span>
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {totalReports}
            </span>
          </div>
          {totalReports > 0 && (
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-red-500"></span>
              <span className="text-sm text-red-700">
                {totalReports} comment{totalReports !== 1 ? 's' : ''} flagged
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reported Comments Table */}
      <div className="max-h-[calc(90vh-280px)] overflow-y-auto px-8 py-6">
        <ReportedCommentsTable
          reportedComments={reportedComments}
          isLoading={reportedCommentsQuery.isLoading}
          isFetchingNextPage={reportedCommentsQuery.isFetchingNextPage}
          hasNextPage={reportedCommentsQuery.hasNextPage}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
};
