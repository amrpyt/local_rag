import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Upload,
  Settings,
  Search,
  MessageSquare,
  Database,
  Info,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const links = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Upload',
      href: '/upload',
      icon: <Upload size={20} />,
    },
    {
      title: 'Process',
      href: '/process',
      icon: <Settings size={20} />,
    },
    {
      title: 'Search',
      href: '/search',
      icon: <Search size={20} />,
    },
    {
      title: 'Q&A',
      href: '/qa',
      icon: <MessageSquare size={20} />,
    },
    {
      title: 'Index',
      href: '/index',
      icon: <Database size={20} />,
    },
    {
      title: 'About',
      href: '/about',
      icon: <Info size={20} />,
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-full border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-[80px]' : 'w-[240px]',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 h-14 border-b border-border">
        <h1 
          className={cn(
            "font-bold text-xl transition-opacity duration-300",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}
        >
          Mini-RAG
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="flex flex-col gap-2 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-4 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                location.pathname === link.href && 'bg-accent text-foreground'
              )}
            >
              {link.icon}
              <span
                className={cn(
                  'transition-opacity duration-300',
                  collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                )}
              >
                {link.title}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-border flex items-center justify-between">
        <span
          className={cn(
            'text-xs text-muted-foreground transition-opacity duration-300',
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          )}
        >
          v1.0.0
        </span>
      </div>
    </div>
  );
} 