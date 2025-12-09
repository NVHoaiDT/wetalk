import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import {
  TableElement,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { paths } from '@/config/paths';
import { ReportedComment } from '@/types/api';
import { formatDate } from '@/utils/format';

type ReportedCommentsTableProps = {
  reportedComments: ReportedComment[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
};

export const ReportedCommentsTable = ({
  reportedComments,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: ReportedCommentsTableProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const toggleRow = (commentId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!reportedComments || reportedComments.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p className="text-lg font-medium">No reported comments</p>
        <p className="text-sm text-gray-400">
          All clear! No comments have been reported.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <TableElement>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-2/5 font-semibold text-gray-700">
                COMMENT
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                AUTHOR
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                POST
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                REPORTS
              </TableHead>
              <TableHead className="w-[140px] text-right font-semibold text-gray-700">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedComments.map((reportedComment) => {
              const isExpanded = expandedRows.has(reportedComment.commentId);
              return (
                <>
                  <TableRow
                    key={reportedComment.commentId}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableCell>
                      <button
                        onClick={() => toggleRow(reportedComment.commentId)}
                        className="flex items-center justify-center rounded p-1 hover:bg-gray-100"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="size-4 text-gray-600" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="line-clamp-2 text-sm text-gray-900">
                        <MDPreview value={reportedComment.commentContent} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={reportedComment.commentAuthor.avatar}
                          alt={reportedComment.commentAuthor.username}
                          className="size-8 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-sm text-gray-700">
                          {reportedComment.commentAuthor.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        to={paths.app.post.getHref(reportedComment.postId)}
                        className="group block"
                      >
                        <div className="line-clamp-1 text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                          {reportedComment.postTitle}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                        {reportedComment.totalReports}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600">
                          Dismiss
                        </button>
                        <button className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600">
                          Remove
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <TableRow key={`${reportedComment.commentId}-details`}>
                      <TableCell colSpan={6} className="bg-gray-50 p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900">
                              Full Comment
                            </h4>
                            <MDPreview value={reportedComment.commentContent} />
                          </div>

                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900">
                              Report Details ({reportedComment.totalReports}{' '}
                              {reportedComment.totalReports === 1
                                ? 'report'
                                : 'reports'}
                              )
                            </h4>
                            <div className="space-y-3">
                              {reportedComment.reporters.map(
                                (reporter, idx) => (
                                  <div
                                    key={`${reporter.id}-${idx}`}
                                    className="rounded-lg border border-gray-200 bg-white p-4"
                                  >
                                    <div className="mb-3 flex items-center gap-3">
                                      <img
                                        src={reporter.avatar}
                                        alt={reporter.username}
                                        className="size-10 rounded-full border border-gray-200"
                                      />
                                      <div>
                                        <div className="font-medium text-gray-900">
                                          {reporter.username}
                                        </div>
                                        {reporter.reportedAt && (
                                          <div className="text-xs text-gray-500">
                                            Reported{' '}
                                            {formatDate(reporter.reportedAt)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">
                                          Reasons:
                                        </span>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                          {reporter.reasons.map(
                                            (reason, rIdx) => (
                                              <span
                                                key={rIdx}
                                                className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                                              >
                                                {reason}
                                              </span>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                      {reporter.note && (
                                        <div>
                                          <span className="text-sm font-medium text-gray-700">
                                            Note:
                                          </span>
                                          <p className="mt-1 text-sm text-gray-600">
                                            {reporter.note}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </TableElement>
      </div>

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-4 text-center">
          {isFetchingNextPage && <Spinner size="md" />}
        </div>
      )}
    </div>
  );
};
