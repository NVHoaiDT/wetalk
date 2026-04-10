import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';

import { useQuiz } from '../api/get-quiz';
import { useSubmitQuiz } from '../api/submit-quiz';

type QuizViewProps = {
  quizId: string;
  onBack: () => void;
};

export const QuizView = ({ quizId, onBack }: QuizViewProps) => {
  const { addNotification } = useNotifications();
  const quizQuery = useQuiz({ id: quizId });
  const submitQuizMutation = useSubmitQuiz({
    mutationConfig: {
      onSuccess: (response) => {
        setSubmissionResult(response.data);
        addNotification({
          type: 'success',
          title: 'Quiz Submitted',
          message: `Your score: ${response.data.totalScore.toFixed(1)}%`,
        });
      },
    },
  });

  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    totalScore: number;
    answers: string[];
  } | null>(null);

  const quiz = quizQuery.data?.data;

  useEffect(() => {
    if (quiz && answers.length === 0) {
      setAnswers(new Array(quiz.questions.length).fill(''));
    }
  }, [quiz]);

  useEffect(() => {
    if (!isStarted || submissionResult) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, submissionResult]);

  if (quizQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Quiz not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    submitQuizMutation.mutate({
      data: {
        quizId: quiz.id,
        answers,
        totalTime: timeElapsed,
      },
    });
  };

  // Start screen
  if (!isStarted) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {quiz.title}
          </h2>
          <p className="mb-6 text-gray-500">
            {quiz.questions.length} questions &middot; {quiz.timeLimit} min time
            limit
          </p>
          <div className="mb-6 flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {quiz.questions.length}
              </p>
              <p className="text-xs text-gray-500">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {quiz.questions.reduce((sum, q) => sum + q.point, 0)}
              </p>
              <p className="text-xs text-gray-500">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {quiz.timeLimit}
              </p>
              <p className="text-xs text-gray-500">Minutes</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button
              type="button"
              onClick={() => setIsStarted(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (submissionResult) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto max-w-lg text-center">
          <div
            className={`mx-auto mb-4 flex size-20 items-center justify-center rounded-full ${
              submissionResult.totalScore >= 70
                ? 'bg-green-100'
                : submissionResult.totalScore >= 40
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
            }`}
          >
            {submissionResult.totalScore >= 70 ? (
              <CheckCircle2 className="size-10 text-green-600" />
            ) : (
              <XCircle className="size-10 text-red-600" />
            )}
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Quiz Complete!
          </h2>
          <p className="mb-1 text-4xl font-bold text-blue-600">
            {submissionResult.totalScore.toFixed(1)}%
          </p>
          <p className="mb-6 text-sm text-gray-500">
            Time: {formatTime(timeElapsed)}
          </p>

          {/* Review answers */}
          <div className="mb-6 space-y-3 text-left">
            {quiz.questions.map((question, index) => {
              const isCorrect =
                submissionResult.answers[index] === question.correctAnswer;
              return (
                <div
                  key={index}
                  className={`rounded-lg border p-3 ${
                    isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {index + 1}. {question.question}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Your answer:{' '}
                    <span
                      className={
                        isCorrect
                          ? 'font-medium text-green-700'
                          : 'font-medium text-red-700'
                      }
                    >
                      {submissionResult.answers[index] || '(no answer)'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-green-700">
                      Correct: {question.correctAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onBack}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Question screen
  const question = quiz.questions[currentQuestion];
  const timeLimitSeconds = quiz.timeLimit * 60;
  const timeRemaining = timeLimitSeconds - timeElapsed;

  if (timeRemaining <= 0 && !submitQuizMutation.isPending) {
    handleSubmit();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Quiz header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold text-gray-900">{quiz.title}</h2>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
            timeRemaining < 60
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Clock className="size-4" />
          {formatTime(Math.max(timeRemaining, 0))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{
            width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="mb-2 text-sm text-gray-500">
          Question {currentQuestion + 1} of {quiz.questions.length} &middot;{' '}
          {question.point} pts
        </div>
        <h3 className="mb-6 text-lg font-medium text-gray-900">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectAnswer(option)}
              className={`w-full rounded-lg border p-4 text-left text-sm transition-all ${
                answers[currentQuestion] === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <button
          type="button"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`size-8 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[index]
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitQuizMutation.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {submitQuizMutation.isPending ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentQuestion(
                Math.min(quiz.questions.length - 1, currentQuestion + 1),
              )
            }
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
