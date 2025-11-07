import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import {
  TableElement,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { paths } from '@/config/paths';
import { ReportedPost } from '@/types/api';
import { formatDate } from '@/utils/format';

import { RemovePost } from '../manage-posts/remove-post';

import { RemoveReportButton } from './remove-report-button';

type ReportedPostsTableProps = {
  reportedPosts: ReportedPost[];
  communityId: number;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
};

export const ReportedPostsTable = ({
  reportedPosts,
  communityId,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: ReportedPostsTableProps) => {
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

  const toggleRow = (postId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
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

  if (!reportedPosts || reportedPosts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p className="text-lg font-medium">No reported posts</p>
        <p className="text-sm text-gray-400">
          All clear! No posts have been reported.
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
                POST
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                AUTHOR
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                REPORTS
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                LAST REPORTED
              </TableHead>
              <TableHead className="w-[140px] text-right font-semibold text-gray-700">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportedPosts.map((reportedPost) => {
              const isExpanded = expandedRows.has(reportedPost.postId);
              return (
                <>
                  <TableRow
                    key={reportedPost.postId}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableCell>
                      <button
                        onClick={() => toggleRow(reportedPost.postId)}
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
                      <Link
                        to={paths.app.post.getHref(reportedPost.postId)}
                        className="group block"
                      >
                        <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                          {reportedPost.postTitle}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={reportedPost.author.avatar}
                          alt={reportedPost.author.username}
                          className="size-8 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-sm text-gray-700">
                          {reportedPost.author.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                        {reportedPost.totalReports}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {reportedPost.lastReportedAt
                          ? formatDate(reportedPost.lastReportedAt)
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <RemoveReportButton
                          communityId={communityId}
                          reportId={reportedPost.reportId}
                          postTitle={reportedPost.postTitle}
                        />
                        <RemovePost
                          communityId={communityId}
                          postId={reportedPost.postId}
                          postTitle={reportedPost.postTitle}
                        />
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {isExpanded && (
                    <TableRow key={`${reportedPost.postId}-details`}>
                      <TableCell colSpan={6} className="bg-gray-50 p-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">
                            Report Details ({reportedPost.totalReports}{' '}
                            {reportedPost.totalReports === 1
                              ? 'report'
                              : 'reports'}
                            )
                          </h4>
                          <div className="space-y-3">
                            {reportedPost.reporters.map((reporter, idx) => (
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
                                      {reporter.reasons.map((reason) => (
                                        <span
                                          key={reason}
                                          className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                                        >
                                          {reason}
                                        </span>
                                      ))}
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
                            ))}
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
