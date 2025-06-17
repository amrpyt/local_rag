"use client"

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
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  X,
  Home
} from 'lucide-react';
import { useLayout } from '../../context/LayoutContext';
import FocusTrap from 'focus-trap-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isSidebarOpen, setSidebarOpen } = useLayout();
  const location = useLocation();

  const isMobile = window.innerWidth < 768;

  const links = [
    {
      title: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard size={20} aria-hidden="true" />,
    },
    {
      title: 'Upload',
      href: '/upload',
      icon: <Upload size={20} aria-hidden="true" />,
    },
    {
      title: 'Process',
      href: '/process',
      icon: <Settings size={20} aria-hidden="true" />,
    },
    {
      title: 'Index',
      href: '/index',
      icon: <Database size={20} aria-hidden="true" />,
    },
    {
      title: 'Search',
      href: '/search',
      icon: <Search size={20} aria-hidden="true" />,
    },
    {
      title: 'Q&A',
      href: '/qa',
      icon: <MessageSquare size={20} aria-hidden="true" />,
    },
    {
      title: 'Test Connection',
      href: '/test',
      icon: <Globe size={20} aria-hidden="true" />,
    },
    {
      title: 'About',
      href: '/about',
      icon: <Info size={20} aria-hidden="true" />,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <FocusTrap active={isSidebarOpen && isMobile}>
        <aside
          className={cn(
              'flex flex-col h-full border-r border-border bg-card transition-all duration-300 z-40',
              'fixed md:relative',
              isSidebarOpen ? 'w-[240px]' : 'w-0 md:w-[80px]',
              'overflow-hidden md:overflow-visible',
            className
          )}
          data-testid="sidebar"
            data-collapsed={!isSidebarOpen}
        >
          <div className="flex items-center justify-between p-4 h-14 border-b border-border">
            <h1 
              className={cn(
                  "font-bold text-xl transition-opacity duration-300 whitespace-nowrap",
                  isSidebarOpen ? "opacity-100" : "opacity-0"
              )}
            >
              Rafiq
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="ml-auto"
                aria-label={!isSidebarOpen ? "Expand sidebar" : "Collapse sidebar"}
            >
                {!isSidebarOpen ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </Button>
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
            </Button>
          </div>

          <div className="flex-1 overflow-auto py-4">
            <nav className="flex flex-col gap-2 px-2" data-testid="sidebar-links">
              {links.map((link) =>
                isSidebarOpen ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => {
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={cn(
                      'flex items-center gap-4 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                      location.pathname === link.href && 'bg-accent text-foreground'
                    )}
                  >
                    {link.icon}
                    <span className="whitespace-nowrap">{link.title}</span>
                  </Link>
                ) : (
                  <Tooltip key={link.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        to={link.href}
                        onClick={() => {
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={cn(
                          'flex items-center justify-center h-10 w-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                          location.pathname === link.href && 'bg-accent text-foreground'
                        )}
                      >
                        {link.icon}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{link.title}</TooltipContent>
                  </Tooltip>
                )
              )}
            </nav>
          </div>

          <div className="p-4 mt-auto border-t border-border flex items-center justify-between">
            <span
              className={cn(
                  'text-xs text-muted-foreground transition-opacity duration-300 whitespace-nowrap',
                  isSidebarOpen ? 'opacity-100' : 'opacity-0'
              )}
            >
              v1.0.0
            </span>
          </div>
        </aside>
      </FocusTrap>
    </>
  );
} 