import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { UseFormSetValue, FieldErrors } from 'react-hook-form';

import { Switch } from '@/components/ui/form';

import { CreatePostInput } from '../api/create-post';

type CreatePollProps = {
  setValue: UseFormSetValue<CreatePostInput>;
  errors: FieldErrors<CreatePostInput>;
};

export const CreatePoll = ({ setValue, errors }: CreatePollProps) => {
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<
    Array<{ id: number; text: string }>
  >([
    { id: 1, text: '' },
    { id: 2, text: '' },
  ]);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');

  // Update form value whenever poll data changes
  const updatePollData = (
    question: string,
    options: Array<{ id: number; text: string }>,
    multiple: boolean,
    expires: string,
  ) => {
    setValue('pollData', {
      question,
      options: options.map((opt) => ({
        ...opt,
        votes: 0,
        voters: [],
      })),
      multipleChoice: multiple,
      expiresAt: expires || undefined,
      totalVotes: 0,
    });
  };

  const handleQuestionChange = (value: string) => {
    setPollQuestion(value);
    updatePollData(value, pollOptions, multipleChoice, expiresAt);
  };

  const handleOptionChange = (id: number, text: string) => {
    const updatedOptions = pollOptions.map((opt) =>
      opt.id === id ? { ...opt, text } : opt,
    );
    setPollOptions(updatedOptions);
    updatePollData(pollQuestion, updatedOptions, multipleChoice, expiresAt);
  };

  const handleAddOption = () => {
    const newOption = {
      id: Math.max(...pollOptions.map((o) => o.id), 0) + 1,
      text: '',
    };
    const updatedOptions = [...pollOptions, newOption];
    setPollOptions(updatedOptions);
    updatePollData(pollQuestion, updatedOptions, multipleChoice, expiresAt);
  };

  const handleRemoveOption = (id: number) => {
    if (pollOptions.length <= 2) return; // Keep minimum 2 options
    const updatedOptions = pollOptions.filter((opt) => opt.id !== id);
    setPollOptions(updatedOptions);
    updatePollData(pollQuestion, updatedOptions, multipleChoice, expiresAt);
  };

  const handleMultipleChoiceToggle = (checked: boolean) => {
    setMultipleChoice(checked);
    updatePollData(pollQuestion, pollOptions, checked, expiresAt);
  };

  const handleExpiresAtChange = (value: string) => {
    setExpiresAt(value);
    updatePollData(pollQuestion, pollOptions, multipleChoice, value);
  };

  return (
    <div className="space-y-6">
      {/* Poll Question */}
      <div>
        <label
          className="mb-2 block text-sm font-medium text-gray-700"
          htmlFor="question"
        >
          Poll Question
        </label>
        <input
          id="question"
          type="text"
          placeholder="Ask a question..."
          value={pollQuestion}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
        />
        {errors.pollData?.question && (
          <p className="mt-1 text-sm text-red-500">
            {errors.pollData.question.message}
          </p>
        )}
      </div>

      {/* Poll Options */}
      <div className="space-y-3">
        <legend className="block text-sm font-medium text-gray-700">
          Poll Options
        </legend>
        {pollOptions.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
              {index + 1}
            </div>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
            />
            {pollOptions.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveOption(option.id)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}
        {errors.pollData?.options && (
          <p className="text-sm text-red-500">
            {errors.pollData.options.message}
          </p>
        )}

        {/* Add Option Button */}
        {pollOptions.length < 6 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="size-4" />
            Add Option
          </button>
        )}
      </div>

      {/* Poll Settings */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
        <h4 className="text-sm font-semibold text-gray-700">Poll Settings</h4>

        {/* Multiple Choice Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <legend className="text-sm font-medium text-gray-700">
              Multiple Choice
            </legend>
            <p className="text-xs text-gray-500">
              Allow users to select multiple options
            </p>
          </div>
          <Switch
            checked={multipleChoice}
            onCheckedChange={handleMultipleChoiceToggle}
          />
        </div>

        {/* Expiration Date */}
        <div>
          <label
            className="mb-2 block text-sm font-medium text-gray-700"
            htmlFor="expiresAt"
          >
            Expiration Date (Optional)
          </label>
          <input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => handleExpiresAtChange(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for no expiration
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500">
          <svg
            className="size-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-xs leading-relaxed text-blue-700">
          Polls should be clear and unbiased. Make sure your options cover all
          reasonable choices.
        </p>
      </div>
    </div>
  );
};
