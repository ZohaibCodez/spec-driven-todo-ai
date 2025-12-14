import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden rounded-lg bg-surface/50', className)}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface to-transparent animate-shimmer" />
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
