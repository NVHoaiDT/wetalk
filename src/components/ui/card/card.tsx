import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const cardVariants = cva(
  'rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'border-gray-200',
        horizontal: 'flex flex-row items-center gap-3 p-3',
        vertical: 'flex flex-col gap-2 p-4',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card, cardVariants };
