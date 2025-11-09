import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/utils/cn';

import { usePostsTags } from '../api/get-posts-tags';

type SelectPostTagsProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: FieldError;
  label?: string;
};

export const SelectPostTags = ({
  value,
  onChange,
  error,
  label = 'Tags',
}: SelectPostTagsProps) => {
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

  const { data: tagsData, isLoading } = usePostsTags({
    search: debouncedSearch,
    queryConfig: {
      enabled: isOpen && debouncedSearch.length > 0,
    },
  });

  const tags = tagsData?.data || [];

  const handleSelectTag = (tagName: string) => {
    if (!value.includes(tagName)) {
      onChange([...value, tagName]);
    }
    setSearch('');
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(value.filter((t) => t !== tagName));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow user to add custom tag by pressing Enter
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      handleSelectTag(search.trim());
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Selected Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
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
          placeholder="Search or add tags..."
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            error && 'border-red-500',
          )}
        />

        {/* Dropdown */}
        {isOpen && search.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading tags...
              </div>
            ) : tags.length > 0 ? (
              <div className="p-1">
                {tags
                  .filter((tag) => !value.includes(tag.name))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleSelectTag(tag.name)}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-blue-50 hover:text-blue-700"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Press Enter to add &quot;{search}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <p className="text-xs text-gray-500">
        Search for existing tags or type and press Enter to create new ones
      </p>
    </div>
  );
};
