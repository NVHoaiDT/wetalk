import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

import { usePostsTags } from '../../posts/api/get-posts-tags';

type SelectTagsProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
};

export const SelectTags = ({
  value,
  onChange,
  label = '',
}: SelectTagsProps) => {
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

  // Fetch tags when searching OR when dropdown first opens (for suggestions)
  const { data: tagsData, isLoading } = usePostsTags({
    search: debouncedSearch,
    queryConfig: {
      enabled: isOpen,
    },
  });

  const tags = tagsData?.data || [];
  // Show first 5 tags as suggestions when search is empty
  const displayTags =
    search.length === 0
      ? tags.slice(0, 5)
      : tags.filter((tag) => !value.includes(tag.name));

  const handleSelectTag = (tagName: string) => {
    if (!value.includes(tagName)) {
      const newTags = [...value, tagName];
      console.log('🏷️ [SelectTags] Adding tag:', { tagName, newTags });
      onChange(newTags);
    }
    setSearch('');
  };

  const handleRemoveTag = (tagName: string) => {
    const newTags = value.filter((t) => t !== tagName);
    console.log('🗑️ [SelectTags] Removing tag:', { tagName, newTags });
    onChange(newTags);
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

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          Clear all filters
        </button>
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
          placeholder="Search tags..."
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          )}
        />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading tags...
              </div>
            ) : displayTags.length > 0 ? (
              <div className="p-1">
                {search.length === 0 && (
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                    Popular tags
                  </div>
                )}
                {displayTags.map((tag) => (
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
            ) : search.length > 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Press Enter to add &quot;{search}&quot;
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No tags available
              </div>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};
