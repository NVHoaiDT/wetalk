import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, BookOpen, ChevronRight, Plus, User2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { MDPreview } from '@/components/ui/md-preview';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';

import { useLessons } from '../api/get-lessons';
import { useTopic } from '../api/get-topic';

import { CreateLesson } from './create-lesson';
import { DeleteLesson } from './delete-lesson';
import { DeleteTopic } from './delete-topic';
import { EditTopic } from './edit-topic';

type TopicViewProps = {
  topicSlug: string;
};

const TopicViewPlaceholder = () => (
  <div className="mx-auto max-w-4xl">
    <div className="mb-8">
      <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-gray-200" />
      <div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-16 w-full animate-pulse rounded-xl bg-gray-200"
        />
      ))}
    </div>
  </div>
);

export const TopicView = ({ topicSlug }: TopicViewProps) => {
  const [showCreateLesson, setShowCreateLesson] = useState(false);

  const topicQuery = useTopic({ slug: topicSlug });
  const lessonsQuery = useLessons({ topicSlug, limit: 50 });
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.data;

  if (topicQuery.isLoading || lessonsQuery.isLoading) {
    return <TopicViewPlaceholder />;
  }

  if (topicQuery.isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900">
            Topic Not Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This topic may not exist or has been deleted.
          </p>
          <Link
            to={paths.app.academy.getHref()}
            className="mt-4 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            Back to Academy
          </Link>
        </div>
      </div>
    );
  }

  const topic = topicQuery.data?.data;
  const lessons = lessonsQuery.data?.data ?? [];
  const isOwner =
    currentUser && topic && currentUser.id === topic.author.userId;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back link */}
      <Link
        to={paths.app.academy.getHref()}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="size-4" />
        Back to Academy
      </Link>

      {/* Topic Header */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{topic?.title}</h1>
          {isOwner && topic && (
            <div className="flex items-center gap-2">
              <EditTopic
                slug={topicSlug}
                currentTitle={topic.title}
                currentDescription={topic.description}
              />
              <DeleteTopic slug={topicSlug} title={topic.title} />
            </div>
          )}
        </div>
        {topic?.description && (
          <div className="mb-4">
            <MDPreview value={topic.description} />
          </div>
        )}
        <div className="flex items-center gap-2">
          {topic?.author.avatar ? (
            <img
              src={topic.author.avatar}
              alt={topic.author.name}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
              <User2 className="size-5 text-gray-500" />
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-gray-700">
              {topic?.author.name}
            </span>
            {topic?.createdAt && (
              <span className="ml-2 text-xs text-gray-400">
                Created{' '}
                {formatDistanceToNow(new Date(topic.createdAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Lessons ({lessons.length})
        </h2>
        {isOwner && (
          <button
            type="button"
            onClick={() => setShowCreateLesson(!showCreateLesson)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <Plus className="size-4" />
            Add Lesson
          </button>
        )}
      </div>

      {showCreateLesson && isOwner && (
        <div className="mb-6">
          <CreateLesson
            topicSlug={topicSlug}
            nextOrderIndex={lessons.length + 1}
            onSuccess={() => setShowCreateLesson(false)}
          />
        </div>
      )}

      {lessons.length === 0 && !lessonsQuery.isLoading && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <BookOpen className="size-12 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700">
            No lessons yet
          </h3>
          <p className="text-sm text-gray-500">
            {isOwner
              ? 'Start adding lessons to this topic!'
              : 'Lessons will appear here once the author adds them.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {lessons
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson, index) => (
            <div
              key={lesson.id}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <Link
                to={paths.app.academyLesson.getHref(topicSlug, lesson.slug)}
                className="flex flex-1 items-center gap-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600 group-hover:bg-blue-100">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {lesson.title}
                  </h3>
                  {lesson.updatedAt && (
                    <p className="text-xs text-gray-400">
                      Updated{' '}
                      {formatDistanceToNow(new Date(lesson.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </Link>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <DeleteLesson
                    lessonSlug={lesson.slug}
                    topicSlug={topicSlug}
                    title={lesson.title}
                  />
                )}
                <ChevronRight className="size-5 text-gray-400 group-hover:text-blue-500" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
