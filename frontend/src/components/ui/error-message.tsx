import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({ 
  title, 
  message, 
  className,
  variant = 'error'
}: ErrorMessageProps) {
  const variantStyles = {
    error: 'bg-destructive/10 text-destructive',
    warning: 'bg-orange-500/10 text-orange-500',
    info: 'bg-blue-500/10 text-blue-500'
  };

  const variantTitle = {
    error: title || 'Error',
    warning: title || 'Warning',
    info: title || 'Info'
  };

  return (
    <Alert className={cn(variantStyles[variant], className)}>
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>{variantTitle[variant]}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
} 