import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select/select';
import { cn } from '@/utils/cn';

export type SearchType = 'all' | 'posts' | 'communities' | 'users';
export type PostSortType = 'hot' | 'new' | 'top';
export type CommunitySortType = 'member_count' | 'newest';

type SearchFiltersProps = {
  type: SearchType;
  postSortType: PostSortType;
  communitySortType: CommunitySortType;
  onTypeChange: (value: SearchType) => void;
  onPostSortChange: (value: PostSortType) => void;
  onCommunitySortChange: (value: CommunitySortType) => void;
};

export const SearchFilters = ({
  type,
  postSortType,
  communitySortType,
  onTypeChange,
  onPostSortChange,
  onCommunitySortChange,
}: SearchFiltersProps) => {
  // Determine if we should show the sort filter
  const showSortFilter = type === 'posts' || type === 'communities';

  return (
    <div className="sticky top-0 z-10 mb-4 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 rounded-md border-b p-4 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          {['all', 'posts', 'communities', 'users'].map((t) => (
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

        {/* Sort Filter - Only show for posts and communities */}
        {showSortFilter && (
          <div className="ml-auto">
            {type === 'posts' && (
              <Select
                value={postSortType}
                onValueChange={(value) =>
                  onPostSortChange(value as PostSortType)
                }
              >
                <SelectTrigger className="h-8 gap-1 border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {type === 'communities' && (
              <Select
                value={communitySortType}
                onValueChange={(value) =>
                  onCommunitySortChange(value as CommunitySortType)
                }
              >
                <SelectTrigger className="h-8 gap-1 border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    <SelectItem value="member_count">Most Members</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
