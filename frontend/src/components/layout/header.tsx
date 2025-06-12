import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { SimpleProjectSelector } from '../SimpleProjectSelector';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Upload Documents';
      case '/process':
        return 'Process Documents';
      case '/search':
        return 'Search Documents';
      case '/qa':
        return 'Q&A';
      case '/index/info':
        return 'Index Info';
      case '/index/push':
        return 'Index Push';
      case '/about':
        return 'About';
      default:
        return 'Mini-RAG';
    }
  };

  return (
    <header className={cn('flex h-14 items-center border-b border-border px-6', className)}>
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
        <SimpleProjectSelector />
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm">
          New Project
        </Button>
      </div>
    </header>
  );
} 