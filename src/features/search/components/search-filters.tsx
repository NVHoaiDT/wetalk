import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import { cn } from '@/utils/cn';

export type SearchType = 'posts' | 'communities';
export type SortType = 'relevance' | 'hot' | 'new' | 'top';

type SearchFiltersProps = {
  type: SearchType;
  sortType: SortType;
  onTypeChange: (value: SearchType) => void;
  onSortChange: (value: SortType) => void;
};

export const SearchFilters = ({
  type,
  sortType,
  onTypeChange,
  onSortChange,
}: SearchFiltersProps) => {
  return (
    <div className="sticky top-0 z-10 mb-4 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 rounded-md border-b p-4 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          {['posts', 'communities'].map((t) => (
            <button
              key={t}
              onClick={() => onTypeChange(t as SearchType)}
              className={cn(
                'rounded-full px-4 py-2 text-default font-medium transition-colors',
                type === t
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Select
            value={sortType}
            onValueChange={(value) => onSortChange(value as SortType)}
          >
            <SelectTrigger className="h-8 gap-1 border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="top">Top</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
