import { formatDistanceToNow } from 'date-fns';
import { Check, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { fancyLog } from '@/helper/fancy-log';
import { useCurrentUser } from '@/lib/auth';
import { Post } from '@/types/api';
import { formatBigNumber } from '@/utils/format';

import { useUnvotePoll } from '../api/unvote-poll';
import { useVotePoll } from '../api/vote-poll';

type PollViewProps = {
  post: Post;
  isCompact?: boolean;
};

export const PollView = ({ post, isCompact = false }: PollViewProps) => {
  const { addNotification } = useNotifications();

  const votePollMutation = useVotePoll({
    postId: post.id,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Vote Submitted',
          message: 'Your vote has been recorded',
        });
      },
    },
  });

  const unvotePollMutation = useUnvotePoll({
    postId: post.id,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Vote Removed',
          message: 'Your vote has been removed',
        });
      },
    },
  });

  const userQuery = useCurrentUser();
  const isAuthenticated = !!userQuery.data?.data;
  const userId = userQuery.data?.data?.id;

  if (!post.pollData) return null;
  fancyLog('Poll-Data:', post.pollData);
  /* 
  TODO: Check if the option is voted by the current user, then display with different color
  {
    "question": "State Management library nào bạn đang dùng?",
    "options": [
        {
            "id": 1,
            "text": "Redux Toolkit",
            "votes": 1,
            "voters": [
                1 // user IDs who voted for this option
            ]
        },
        {
            "id": 2,
            "text": "Zustand",
            "votes": 0,
            "voters": []
        },
        {
            "id": 3,
            "text": "Jotai",
            "votes": 1,
            "voters": [
                5
            ]
        },
        {
            "id": 4,
            "text": "Recoil",
            "votes": 0,
            "voters": []
        },
        {
            "id": 5,
            "text": "Context API only",
            "votes": 0,
            "voters": []
        },
        {
            "id": 6,
            "text": "MobX",
            "votes": 0,
            "voters": []
        }
    ],
    "multipleChoice": false,
    "totalVotes": 2
}
  */

  const { question, options, multipleChoice, expiresAt, totalVotes } =
    post.pollData;

  const hasExpired = expiresAt && new Date(expiresAt) < new Date();
  const canVote = !hasExpired;

  const handleOptionClick = (optionId: number) => {
    if (!canVote || votePollMutation.isPending || unvotePollMutation.isPending)
      return;

    // Check if user has already voted for this option
    const hasUserVotedThisOption =
      userId &&
      options.find((opt) => opt.id === optionId)?.voters?.includes(userId);

    if (hasUserVotedThisOption) {
      // Unvote if already voted
      unvotePollMutation.mutate({ postId: post.id, optionId });
    } else {
      // Vote if not yet voted
      votePollMutation.mutate({ postId: post.id, optionId });
    }
  };

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div
      className={`${isCompact ? 'p-4' : 'p-6'} space-y-4 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-sm`}
    >
      {/* Poll Question */}
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="size-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold text-gray-900 ${isCompact ? 'text-base' : 'text-lg'}`}
          >
            {question}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            {/* <span>{formatBigNumber(totalVotes)} votes</span> */}
            <span>{totalVotes} votes</span>
            {expiresAt && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {hasExpired
                    ? 'Expired'
                    : `Expires ${formatDistanceToNow(new Date(expiresAt), { addSuffix: true })}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-3">
        {options.map((option) => {
          const percentage = getPercentage(option.votes);
          const hasUserVoted = userId && option.voters?.includes(userId);

          // For unauthenticated users, wrap in ConfirmationDialog
          if (!isAuthenticated && canVote) {
            return (
              <ConfirmationDialog
                key={option.id}
                icon="info"
                title="Vote in this poll!"
                body="Sign up to vote and share your opinion on this topic."
                illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763792572/vote_d9nmh4.jpg"
                triggerButton={
                  <button className="group relative w-full cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 bg-white transition-all duration-200 hover:border-blue-300">
                    {/* Progress bar background */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />

                    {/* Content */}
                    <div className="relative flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        {/* Checkbox/Radio indicator */}
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center border-2 border-gray-300 bg-white transition-colors group-hover:border-blue-400 ${multipleChoice ? 'rounded-md' : 'rounded-full'}`}
                        ></div>

                        <span className="text-left font-medium text-gray-900">
                          {option.text}
                        </span>
                      </div>

                      {/* Vote count and percentage */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {percentage}%
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatBigNumber(option.votes)}
                        </span>
                      </div>
                    </div>
                  </button>
                }
                confirmButton={
                  <Link
                    to={paths.auth.register.getHref(location.pathname)}
                    replace
                    className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                }
              />
            );
          }

          // For authenticated users, show regular button
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={
                !canVote ||
                votePollMutation.isPending ||
                unvotePollMutation.isPending
              }
              className={`group relative w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                hasUserVoted
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              } ${!canVote || votePollMutation.isPending || unvotePollMutation.isPending ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              {/* Progress bar background */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  hasUserVoted
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100'
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                }`}
                style={{ width: `${percentage}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {/* Checkbox/Radio indicator */}
                  <div
                    className={`flex size-5 shrink-0 items-center justify-center ${multipleChoice ? 'rounded-md' : 'rounded-full'} border-2 transition-colors ${
                      hasUserVoted
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 bg-white group-hover:border-blue-400'
                    }`}
                  >
                    {hasUserVoted && <Check className="size-3 text-white" />}
                  </div>

                  <span className="text-left font-medium text-gray-900">
                    {option.text}
                  </span>
                </div>

                {/* Vote count and percentage */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {percentage}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatBigNumber(option.votes)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expired message */}
      {hasExpired && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center text-sm font-medium text-orange-700">
          This poll has expired
        </div>
      )}
    </div>
  );
};
