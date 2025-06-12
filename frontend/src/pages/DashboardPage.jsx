import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Database, 
  Upload, 
  Settings 
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { 
    title: 'Projects', 
    value: '2', 
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    description: 'Active projects',
  },
  { 
    title: 'Documents', 
    value: '15', 
    icon: <FileText className="h-5 w-5 text-green-500" />,
    description: 'Indexed documents',
  },
  { 
    title: 'Chunks', 
    value: '354', 
    icon: <FileText className="h-5 w-5 text-yellow-500" />,
    description: 'Document chunks',
  },
  { 
    title: 'Queries', 
    value: '27', 
    icon: <Search className="h-5 w-5 text-purple-500" />,
    description: 'Search queries',
  },
];

const features = [
  {
    title: 'Upload Documents',
    description: 'Upload PDF documents to analyze',
    icon: <Upload className="h-6 w-6" />,
    href: '/upload',
  },
  {
    title: 'Process Documents',
    description: 'Split documents into chunks',
    icon: <Settings className="h-6 w-6" />,
    href: '/process',
  },
  {
    title: 'Search Documents',
    description: 'Search across your documents',
    icon: <Search className="h-6 w-6" />,
    href: '/search',
  },
  {
    title: 'Ask Questions',
    description: 'Get answers from your documents',
    icon: <MessageSquare className="h-6 w-6" />,
    href: '/qa',
  },
  {
    title: 'Manage Index',
    description: 'View and manage your vector index',
    icon: <Database className="h-6 w-6" />,
    href: '/index/info',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Welcome to Mini-RAG, a personal document question answering system
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div 
            key={stat.title}
            className="rounded-xl border bg-card text-card-foreground shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{stat.title}</div>
              <div className="rounded-full bg-muted p-1.5">{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
          </div>
        ))}
      </div>
      
      {/* Features */}
      <div>
        <h3 className="text-xl font-medium mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="rounded-xl border bg-card text-card-foreground shadow"
            >
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {feature.description}
                </p>
              </div>
              <div className="px-6 py-4 border-t">
                <Button asChild className="w-full" variant="outline">
                  <a href={feature.href}>
                    Get Started
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 