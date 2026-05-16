import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useNotifications } from '@/components/ui/notifications';
import { QuizQuestion } from '@/types/api';

import { useCreateQuiz, CreateQuizInput } from '../api/create-quiz';
import { useQuiz } from '../api/get-quiz';
import { useUpdateQuiz, UpdateQuizInput } from '../api/update-quiz';
import { useDeleteQuiz } from '../api/delete-quiz';

type QuizEditorProps = {
  lessonSlug: string;
  editQuizId?: string | null;
  onSuccess: () => void;
};

type EditableQuestion = {
  question: string;
  point: number;
  options: string[];
  correctAnswer: string;
};

const emptyQuestion: EditableQuestion = {
  question: '',
  point: 10,
  options: ['', ''],
  correctAnswer: '',
};

export const QuizEditor = ({
  lessonSlug,
  editQuizId,
  onSuccess,
}: QuizEditorProps) => {
  const isUpdate = !!editQuizId;
  const { addNotification } = useNotifications();

  const quizQuery = useQuiz({
    id: editQuizId ?? '',
    queryConfig: { enabled: !!editQuizId },
  });
  const existingQuiz = quizQuery.data?.data;

  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState<EditableQuestion[]>([
    { ...emptyQuestion },
  ]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existingQuiz && !initialized) {
      setTitle(existingQuiz.title);
      setTimeLimit(existingQuiz.timeLimit);
      setQuestions(
        existingQuiz.questions.map((q: QuizQuestion) => ({
          question: q.question,
          point: q.point,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      );
      setInitialized(true);
    }
  }, [existingQuiz, initialized]);

  if (editQuizId && quizQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const createQuizMutation = useCreateQuiz({
    lessonSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Quiz Created',
          message: 'Quiz has been created successfully.',
        });
        onSuccess();
      },
    },
  });

  const updateQuizMutation = useUpdateQuiz({
    quizId: editQuizId ?? '',
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Quiz Updated',
          message: 'Quiz has been updated successfully.',
        });
        onSuccess();
      },
    },
  });

  const deleteQuizMutation = useDeleteQuiz({
    lessonSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Quiz Deleted',
          message: 'Quiz has been deleted successfully.',
        });
        onSuccess();
      },
    },
  });

  const addQuestion = () => {
    setQuestions([...questions, { ...emptyQuestion }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof EditableQuestion,
    value: string | number | string[],
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      options: [...updated[qIndex].options, ''],
    };
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length <= 2) return;
    const updated = [...questions];
    const newOptions = updated[qIndex].options.filter((_, i) => i !== oIndex);
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    if (updated[qIndex].correctAnswer === questions[qIndex].options[oIndex]) {
      updated[qIndex].correctAnswer = '';
    }
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const oldValue = updated[qIndex].options[oIndex];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    if (updated[qIndex].correctAnswer === oldValue) {
      updated[qIndex].correctAnswer = value;
    }
    setQuestions(updated);
  };

  const handleSubmit = () => {
    if (isUpdate && editQuizId) {
      const data: UpdateQuizInput = { title, timeLimit, questions };
      updateQuizMutation.mutate({ id: editQuizId, data });
    } else {
      const data: CreateQuizInput = { lessonSlug, title, timeLimit, questions };
      createQuizMutation.mutate({ data });
    }
  };

  const isPending =
    createQuizMutation.isPending || updateQuizMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Quiz metadata */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quiz Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Go Basics Quiz"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            min={1}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <div
          key={qIndex}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Question {qIndex + 1}
            </span>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          <div className="mb-3">
            <input
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, 'question', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter question..."
            />
          </div>

          <div className="mb-3 flex items-center gap-4">
            <div>
              <label className="text-xs text-gray-500">Points</label>
              <input
                type="number"
                min={1}
                value={q.point}
                onChange={(e) =>
                  updateQuestion(qIndex, 'point', Number(e.target.value))
                }
                className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm"
              />
            </div>
          </div>

          {/* Options */}
          <div className="mb-3 space-y-2">
            <label className="text-xs font-medium text-gray-500">Options</label>
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctAnswer === option && option !== ''}
                  onChange={() =>
                    updateQuestion(qIndex, 'correctAnswer', option)
                  }
                  className="size-4 accent-blue-600"
                  title="Mark as correct answer"
                />
                <input
                  value={option}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Option ${oIndex + 1}`}
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
            >
              <Plus className="size-3" /> Add Option
            </button>
          </div>

          {q.correctAnswer && (
            <p className="text-xs text-green-600">Correct: {q.correctAnswer}</p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <Plus className="size-4" /> Add Question
      </button>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div>
          {isUpdate && editQuizId && (
            <button
              type="button"
              onClick={() => deleteQuizMutation.mutate({ id: editQuizId })}
              disabled={deleteQuizMutation.isPending}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {deleteQuizMutation.isPending ? 'Deleting...' : 'Delete Quiz'}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : isUpdate ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </div>
    </div>
  );
};
