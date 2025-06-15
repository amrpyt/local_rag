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
import { useProject } from '../context/ProjectContext';
import { Spinner } from '../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useError } from '../context/ErrorContext';
import { SimpleProjectSelector } from '../components/SimpleProjectSelector';
import MockDataSwitch from '../components/MockDataSwitch';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Define the Project type to match the API response
interface Project {
  id: number;
  name: string;
}

// Define the index info response type
interface IndexInfo {
  signal: string;
  collection_info: {
    vector_count?: number;
    indexed_vector_count?: number;
    points_count?: number;
    record_count?: number;
    table_info?: {
      tablename?: string;
      hasindexes?: boolean;
    };
  };
}

// Mock data generation
const generateMockIndexInfo = (projectId: string): IndexInfo => ({
    "signal": "success",
    "collection_info": {
      "vector_count": Math.floor(Math.random() * 10000) + 1000,
      "indexed_vector_count": Math.floor(Math.random() * 1000) + 100,
      "points_count": Math.floor(Math.random() * 10000) + 1000,
    }
});

const fetchIndexInfo = async (projectId: string, useMockData: boolean): Promise<IndexInfo> => {
    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockIndexInfo(projectId);
    }
    const { data } = await apiClient.get(`/nlp/index/info/${projectId}`);
    return data;
};

const useIndexInfo = (projectId: string | number | null, useMockData: boolean) => {
    return useQuery<IndexInfo, Error>({
      queryKey: ['indexInfo', projectId, useMockData],
      queryFn: () => fetchIndexInfo(projectId ? String(projectId) : '', useMockData),
      enabled: !!projectId,
      retry: useMockData ? 0 : 2,
      refetchInterval: false,
      staleTime: 60000,
    });
};

export default function DashboardPage() {
  const { selectedProject } = useProject();
  const { setError } = useError();
  
  // Default to false if useMockData is not available in ProjectContext
  const useMockData = (useProject() as any).useMockData || false;
  
  const projectId = selectedProject && typeof selectedProject === 'object' ? selectedProject.id : selectedProject;
  const { data: indexInfo, isLoading: isIndexInfoLoading } = useIndexInfo(projectId, useMockData);
  
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
    return typeof selectedProject === 'object' && selectedProject.name 
      ? selectedProject.name 
      : `Project ${selectedProject}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to Rafiq, a personal document question answering system
          </p>
        </div>
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
            {isIndexInfoLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{indexInfo?.collection_info?.points_count || 0}</div>
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
            {isIndexInfoLoading ? (
              <div className="flex items-center space-x-2">
                <Spinner className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center text-lg">
                  {indexInfo?.collection_info?.points_count && indexInfo.collection_info.points_count > 0 ? (
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