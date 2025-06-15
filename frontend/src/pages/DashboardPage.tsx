import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { 
  FileText, 
  Search, 
  MessageSquare, 
  Database, 
  Upload, 
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { TestApiComponent } from '../components/TestApiComponent';
import DirectApiTest from '../components/DirectApiTest';
import { useProject } from '../context/ProjectContext';
import { useIndexInfo } from '../hooks/useIndexInfo';
import { Spinner } from '../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useError } from '../context/ErrorContext';
import { SimpleProjectSelector } from '../components/SimpleProjectSelector';
import MockDataSwitch from '../components/MockDataSwitch';

export default function DashboardPage() {
  const { selectedProject, projectStatus, isStatusLoading, fetchProjectStatus } = useProject();
  const { setError } = useError();
  
  const loadProjectData = () => {
    if (selectedProject?.id) {
        fetchProjectStatus(selectedProject.id);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [selectedProject]);

  const isLoading = isStatusLoading;

  if (!selectedProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="mt-8 w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>No Project Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Please select a project from the header or create a new one to get started.
              </p>
              <p className="text-muted-foreground mt-2">
                You can also visit the <a href="/test" className="text-primary underline">Test Connection</a> page to verify connectivity to the backend.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
      href: '/index',
    },
  ];

  const getProjectName = () => {
    if (!selectedProject) return "No project selected";
    return typeof selectedProject === 'object' ? selectedProject.name : `Project ${selectedProject}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to Mini-RAG, a personal document question answering system
          </p>
        </div>
        <Button onClick={loadProjectData} disabled={isLoading || !selectedProject}>
          {isLoading ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card data-testid="card-documents">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">Indexed Chunks</CardTitle>
              <FileText className="ml-2 h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{projectStatus?.points_count || 0}</div>
                <p className="text-xs text-muted-foreground">Chunks in the vector database</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card data-testid="card-vectordb">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">Vector DB Status</CardTitle>
              <Database className="ml-2 h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center text-lg">
                  {projectStatus?.points_count > 0 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Ready</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium">Not Indexed</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getProjectName()}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>
            Navigate to the core functionalities of the application from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <a href={feature.href} key={index} className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  {feature.icon}
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backend Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <TestApiComponent />
          </CardContent>
        </Card>
        <DirectApiTest />
      </div>

      <div className="mt-8 border-t pt-6">
        <MockDataSwitch />
      </div>
    </div>
  );
}

// Custom CardFooter component since it wasn't defined earlier
function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center p-6 pt-0 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
} 