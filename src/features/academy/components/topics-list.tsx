import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Plus, User2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { MDPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';

import { useInfiniteTopics } from '../api/get-topics';

import { CreateTopic } from './create-topic';

const TopicCardPlaceholder = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
    <div className="mb-4 space-y-2">
      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
    </div>
    <div className="flex items-center gap-2">
      <div className="size-8 animate-pulse rounded-full bg-gray-200" />
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </div>
  </div>
);

export const TopicsList = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const topicsQuery = useInfiniteTopics();
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.data;

  const topics = topicsQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academy</h1>
          <p className="mt-1 text-gray-500">
            Explore topics, learn new skills, and test your knowledge
          </p>
        </div>
        {currentUser && (
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus className="size-4" />
            New Topic
          </button>
        )}
      </div>

      {showCreateForm && currentUser && (
        <div className="mb-8">
          <CreateTopic onSuccess={() => setShowCreateForm(false)} />
        </div>
      )}

      {topicsQuery.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopicCardPlaceholder key={i} />
          ))}
        </div>
      )}

      {topics.length === 0 && !topicsQuery.isLoading && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <BookOpen className="size-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">No topics yet</h3>
          <p className="text-sm text-gray-500">
            Be the first to create a learning topic!
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={paths.app.academyTopic.getHref(topic.slug)}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {topic.title}
            </h3>
            <div className="mb-4 line-clamp-2 text-sm text-gray-500">
              <MDPreview value={topic.description} maxLines={2} />
            </div>
            <div className="flex items-center gap-2">
              {topic.author.avatar ? (
                <img
                  src={topic.author.avatar}
                  alt={topic.author.name}
                  className="size-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-6 items-center justify-center rounded-full bg-gray-100">
                  <User2 className="size-4 text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-600">{topic.author.name}</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(topic.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {topicsQuery.hasNextPage && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => topicsQuery.fetchNextPage()}
            disabled={topicsQuery.isFetchingNextPage}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {topicsQuery.isFetchingNextPage ? (
              <Spinner size="sm" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
