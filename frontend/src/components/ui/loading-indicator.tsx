import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingIndicatorProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  className?: string;
}

export function LoadingIndicator({
  text = 'Loading...',
  size = 'md',
  fullPage = false,
  className
}: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10'
  };

  const containerClasses = fullPage 
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
        {text && <p className="text-muted-foreground text-sm font-medium">{text}</p>}
      </div>
    </div>
  );
} 