import React from 'react';
import { cn } from './utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

function Skeleton({ className, width, height, rounded = 'rounded-[12px]', style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[rgba(45,74,45,0.08)]',
        rounded,
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    >
      <div className="absolute inset-0 animate-shimmer" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="fake-glass rounded-[24px] p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton width={120} height={20} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton width="80%" height={14} />
      <div className="flex gap-2">
        <Skeleton width={40} height={24} rounded="rounded-full" />
        <Skeleton width={60} height={24} rounded="rounded-full" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard };
export type { SkeletonProps };
