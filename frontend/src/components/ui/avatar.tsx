import React from 'react';
import { cn } from './utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-xl',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center font-semibold',
        'bg-[var(--color-accent-green)] text-[var(--ContrastColor)]',
        sizeClasses[size],
        className
      )}
    >
      {!showFallback ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        <span style={{ fontSize: '1.2em' }}>👤</span>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
