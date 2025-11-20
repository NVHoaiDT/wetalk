import { Clock, TrendingUp, X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';

import { useCommunitiesTopics } from '../api/get-communities-topics';

import { CommunityGrid } from './community-grid';

const sortOptions = [
  {
    value: 'member_count',
    label: 'Top',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  { value: 'newest', label: 'New', icon: Clock, color: 'text-blue-500' },
] as const;

type SortType = (typeof sortOptions)[number]['value'];

export const CommunityTopicsSection = () => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortType>('member_count');

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

  // Query for suggestions (first 5 topics)
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
    if (!selectedTopics.includes(topicName)) {
      setSelectedTopics([...selectedTopics, topicName]);
    }
    setSearch('');
  };

  const handleRemoveTopic = (topicName: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topicName));
  };

  const currentSort = sortOptions.find((opt) => opt.value === sortBy);
  const CurrentSortIcon = currentSort?.icon || TrendingUp;

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Topics Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsOpen(false), 200);
            }}
            placeholder="Search topics..."
            className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-cyan-300 focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
          />

          {/* Topics Dropdown */}
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
                    .filter((topic) => !selectedTopics.includes(topic.name))
                    .map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelectTopic(topic.name)}
                        className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        {topic.name}
                      </button>
                    ))}
                </div>
              ) : debouncedSearch.length > 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No topics found
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2.5 rounded-lg border border-gray-200 px-4 py-2 shadow-sm transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50/50 hover:shadow-md">
              <CurrentSortIcon className={`size-4 ${currentSort?.color}`} />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-cyan-700">
                {currentSort?.label}
              </span>
              <ChevronDown className="size-4 text-gray-400 transition-transform group-hover:text-cyan-600 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200
                    ${
                      isActive
                        ? 'border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon
                    className={`size-4 ${isActive ? option.color : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-cyan-700' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto size-2 animate-pulse rounded-full bg-cyan-600" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected Topics Display */}
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTopics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-100 to-sky-100 px-3 py-1 text-sm font-medium text-cyan-700"
            >
              {topic}
              <button
                type="button"
                onClick={() => handleRemoveTopic(topic)}
                className="rounded-full transition-colors hover:bg-cyan-200"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Communities Grid */}
      {selectedTopics.length > 0 ? (
        <CommunityGrid filter={sortBy} topics={selectedTopics} />
      ) : (
        <div className="rounded-xl border-2 border-dashed border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-sky-50/30 p-12 text-center">
          <p className="text-sm text-gray-600">
            Select topics above to discover communities
          </p>
        </div>
      )}
    </div>
  );
};
