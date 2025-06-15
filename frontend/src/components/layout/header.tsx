import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ChevronRight, X, Server, Menu } from 'lucide-react';
import { SimpleProjectSelector } from '../SimpleProjectSelector';
import { useProject } from '../../context/ProjectContext';
import { HealthCheckModal } from './HealthCheckModal';
import { useLayout } from '../../context/LayoutContext';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const location = useLocation();
  const { setSelectedProject } = useProject();
  const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
  const { toggleSidebar } = useLayout();

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
        return 'Rafiq';
    }
  };

  return (
    <>
      <header className={cn('flex h-14 items-center border-b border-border px-4 md:px-6', className)}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="hidden md:flex items-center">
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
        <SimpleProjectSelector />
          <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)} className="ml-2" aria-label="Clear selected project">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
          <div className="md:hidden">
            <SimpleProjectSelector />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsHealthCheckOpen(true)} aria-label="Open backend status">
            <Server className="h-4 w-4" />
          </Button>
      </div>
    </header>
      <HealthCheckModal isOpen={isHealthCheckOpen} onOpenChange={setIsHealthCheckOpen} />
    </>
  );
} 