import {
  ArrowLeft,
  BookOpen,
  FileText,
  Pencil,
  Play,
  Plus,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';

import { useContent } from '../api/get-content';
import { useLesson } from '../api/get-lesson';
import { useQuizzesByLesson } from '../api/get-quizzes';
import { useTopic } from '../api/get-topic';

import { CodePlayground } from './code-playground';
import { ContentEditor } from './content-editor';
import { ContentRenderer } from './content-renderer';
import { EditLesson } from './edit-lesson';
import { QuizEditor } from './quiz-editor';
import { QuizView } from './quiz-view';

type LessonViewProps = {
  topicSlug: string;
  lessonSlug: string;
};

const LessonViewPlaceholder = () => (
  <div className="mx-auto max-w-4xl">
    <div className="mb-6 h-6 w-32 animate-pulse rounded bg-gray-200" />
    <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-gray-200" />
    <div className="space-y-4">
      <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-40 w-full animate-pulse rounded bg-gray-200" />
    </div>
  </div>
);

export const LessonView = ({ topicSlug, lessonSlug }: LessonViewProps) => {
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'playground'>(
    'content',
  );
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  const lessonQuery = useLesson({ slug: lessonSlug });
  const contentQuery = useContent({ lessonSlug });
  const quizzesQuery = useQuizzesByLesson({ lessonSlug });
  const topicQuery = useTopic({ slug: topicSlug });
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data?.data;
  const topic = topicQuery.data?.data;
  const isOwner =
    currentUser && topic && currentUser.id === topic.author.userId;

  if (lessonQuery.isLoading) {
    return <LessonViewPlaceholder />;
  }

  if (lessonQuery.isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900">
            Lesson Not Found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This lesson may not exist or has been deleted.
          </p>
          <Link
            to={paths.app.academyTopic.getHref(topicSlug)}
            className="mt-4 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  const lesson = lessonQuery.data?.data;
  const content = contentQuery.data?.data;
  const quizzes = quizzesQuery.data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back link */}
      <Link
        to={paths.app.academyTopic.getHref(topicSlug)}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="size-4" />
        Back to Topic
      </Link>

      {/* Lesson Header */}
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{lesson?.title}</h1>
        {isOwner && lesson && (
          <EditLesson
            lessonSlug={lessonSlug}
            topicSlug={topicSlug}
            currentTitle={lesson.title}
            currentOrderIndex={lesson.orderIndex}
            onSuccess={() => {}}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="size-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'quiz'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy className="size-4" />
          Quiz
          {quizzes.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
              {quizzes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'playground'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Play className="size-4" />
          Playground
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'content' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {isOwner && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowContentEditor(!showContentEditor)}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <Pencil className="size-3" />
                {showContentEditor ? 'View Content' : 'Edit Content'}
              </button>
            </div>
          )}
          {showContentEditor && isOwner ? (
            <ContentEditor
              lessonSlug={lessonSlug}
              existingContent={
                content?.sections ? { sections: content.sections } : null
              }
              onSuccess={() => setShowContentEditor(false)}
            />
          ) : (
            <>
              {contentQuery.isLoading && (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              )}
              {!contentQuery.isLoading && content?.sections ? (
                <ContentRenderer sections={content.sections} />
              ) : (
                !contentQuery.isLoading && (
                  <div className="flex flex-col items-center gap-4 py-12 text-center">
                    <BookOpen className="size-12 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      No content yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isOwner
                        ? 'Click "Edit Content" to start adding content.'
                        : "Content for this lesson hasn't been added yet."}
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          {showQuizEditor || editingQuizId ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingQuizId ? 'Edit Quiz' : 'Create Quiz'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuizEditor(false);
                    setEditingQuizId(null);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
              <QuizEditor
                lessonSlug={lessonSlug}
                editQuizId={editingQuizId}
                onSuccess={() => {
                  setShowQuizEditor(false);
                  setEditingQuizId(null);
                }}
              />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Trophy className="size-12 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">
                No quizzes available
              </h3>
              <p className="text-sm text-gray-500">
                {isOwner
                  ? 'Create a quiz for this lesson.'
                  : 'There are no quizzes for this lesson yet.'}
              </p>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setShowQuizEditor(true)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
                >
                  <Plus className="size-4" /> Create Quiz
                </button>
              )}
            </div>
          ) : selectedQuizId ? (
            <QuizView
              quizId={selectedQuizId}
              onBack={() => setSelectedQuizId(null)}
            />
          ) : (
            <div className="space-y-3">
              {isOwner && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowQuizEditor(true)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                  >
                    <Plus className="size-4" /> Add Quiz
                  </button>
                </div>
              )}
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <button
                    onClick={() => setSelectedQuizId(quiz.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <Trophy className="size-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Time limit: {quiz.timeLimit} min
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => setEditingQuizId(quiz.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                      >
                        <Pencil className="size-3" /> Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedQuizId(quiz.id)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'playground' && <CodePlayground />}
    </div>
  );
};
