import { ArchiveX } from 'lucide-react';
import * as React from 'react';

import { BaseEntity } from '@/types/api';
import { cn } from '@/utils/cn';

import { TablePagination, TablePaginationProps } from '../table/pagination';

const GridElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {children}
    </div>
  </div>
));
GridElement.displayName = 'GridElement';

const GridContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className,
    )}
    {...props}
  />
));
GridContainer.displayName = 'GridContainer';

// Individual grid item wrapper
const GridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border rounded-lg p-4 transition-colors hover:bg-muted/50',
      className,
    )}
    {...props}
  />
));
GridItem.displayName = 'GridItem';

export { GridElement, GridContainer, GridItem };

export type GridProps<Entry> = {
  data: Entry[];
  renderItem: (entry: Entry) => React.ReactElement;
  pagination?: TablePaginationProps;
  gridClassName?: string;
  emptyMessage?: string;
};

export const Grid = <Entry extends BaseEntity>({
  data,
  renderItem,
  pagination,
  gridClassName,
  emptyMessage = 'No Entries Found',
}: GridProps<Entry>) => {
  if (!data?.length) {
    return (
      <div className="flex h-80 flex-col items-center justify-center bg-white text-gray-500">
        <ArchiveX className="size-16" />
        <h4>{emptyMessage}</h4>
      </div>
    );
  }

  return (
    <>
      <GridElement>
        <GridContainer className={gridClassName}>
          {data.map((entry) => (
            <React.Fragment key={entry?.id}>{renderItem(entry)}</React.Fragment>
          ))}
        </GridContainer>
      </GridElement>

      {pagination && <TablePagination {...pagination} />}
    </>
  );
};
