import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="flex items-center gap-4 py-4">
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as SearchType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="communities">Communities</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={sortType}
        onValueChange={(value) => onSortChange(value as SortType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="top">Top</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
