import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/utils/cn';

import { useCommunitiesTopics } from '../api/get-communities-topics';

type SearchTopicsProps = {
  value: string[];
  onChange: (topics: string[]) => void;
  error?: FieldError;
  label?: string;
};

export const SearchTopics = ({
  value,
  onChange,
  error,
  label = 'Topics',
}: SearchTopicsProps) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Query for search results
  const { data: searchData, isLoading: isSearchLoading } = useCommunitiesTopics(
    {
      search: debouncedSearch,
      queryConfig: {
        enabled: isOpen && debouncedSearch.length > 0,
      },
    },
  );

  // Query for suggestions (empty search shows first 5 topics)
  const { data: suggestionsData, isLoading: isSuggestionsLoading } =
    useCommunitiesTopics({
      search: '',
      queryConfig: {
        enabled: isOpen && debouncedSearch.length === 0,
      },
    });

  // Use search results if available, otherwise use suggestions
  const topics =
    debouncedSearch.length > 0
      ? searchData?.data || []
      : (suggestionsData?.data || []).slice(0, 5);

  const isLoading =
    debouncedSearch.length > 0 ? isSearchLoading : isSuggestionsLoading;

  const handleSelectTopic = (topicName: string) => {
    if (!value.includes(topicName)) {
      onChange([...value, topicName]);
    }
    setSearch('');
  };

  const handleRemoveTopic = (topicName: string) => {
    onChange(value.filter((t) => t !== topicName));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow user to add custom topic by pressing Enter
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      handleSelectTopic(search.trim());
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Selected Topics Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              {topic}
              <button
                type="button"
                onClick={() => handleRemoveTopic(topic)}
                className="rounded-full hover:bg-blue-200"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay to allow click on dropdown items
            setTimeout(() => setIsOpen(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search or add topics..."
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            error && 'border-red-500',
          )}
        />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading topics...
              </div>
            ) : topics.length > 0 ? (
              <div className="p-1">
                {debouncedSearch.length === 0 && (
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                    Suggested Topics
                  </div>
                )}
                {topics
                  .filter((topic) => !value.includes(topic.name))
                  .map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic.name)}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-blue-50 hover:text-blue-700"
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            ) : debouncedSearch.length > 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Press Enter to add &quot;{search}&quot;
              </div>
            ) : null}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">
        Search for existing topics or type and press Enter to create new ones
      </p>
    </div>
  );
};
