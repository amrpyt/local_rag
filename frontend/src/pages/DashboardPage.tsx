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
  CheckCircle2,
  BarChart2
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
import { useIndexInfo } from '../hooks/useStatistics';
import { fetchStatistics, Statistics } from '../api/db-client';
import { Spinner } from '../components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useError } from '../context/ErrorContext';

// الإحصائيات الافتراضية
const DEFAULT_STATS: Statistics = {
  totalDocuments: 0,
  totalQueries: 0,
  documentTypes: [],
  recentQueries: []
};

export default function DashboardPage() {
  const { selectedProject } = useProject();
  const { setError } = useError();
  
  const { 
    data: indexInfo, 
    isLoading: indexInfoLoading, 
    error: indexInfoError 
  } = useIndexInfo(selectedProject);

  const [statistics, setStatistics] = useState<Statistics | null>(DEFAULT_STATS);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  const loadStatistics = async () => {
    if (!selectedProject) return;

    setStatsLoading(true);
    setError(null); // Clear previous errors
    try {
      const stats = await fetchStatistics(selectedProject.toString());
      setStatistics(stats);
    } catch (err: any) {
      setError(err.message || "Failed to load statistics");
      setStatistics(DEFAULT_STATS);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      loadStatistics();
    } else {
      setStatistics(DEFAULT_STATS);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (indexInfoError) {
        setError(indexInfoError.message);
    }
  }, [indexInfoError, setError]);

  const isLoading = indexInfoLoading || statsLoading;

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

  // تكوين بيانات الإحصائيات للعرض
  const statsItems = [
    { 
      title: 'Documents', 
      value: statistics?.totalDocuments?.toString() || '0', 
      icon: <FileText className="h-5 w-5 text-green-500" />,
      description: 'Indexed documents',
    },
    { 
      title: 'Queries', 
      value: statistics?.totalQueries?.toString() || '0', 
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to Mini-RAG, a personal document question answering system
          </p>
        </div>
        <Button onClick={loadStatistics} disabled={isLoading || !selectedProject}>
          {isLoading ? <Spinner className="mr-2" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card data-testid="card-documents">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
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
                <div className="text-2xl font-bold">{statistics?.totalDocuments || 0}</div>
                <p className="text-xs text-muted-foreground">Indexed documents</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card data-testid="card-queries">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium">Queries</CardTitle>
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
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
                <div className="text-2xl font-bold">{statistics?.totalQueries || 0}</div>
                <p className="text-xs text-muted-foreground">Search queries</p>
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
                  {indexInfo?.signal === 'vectordb_collection_retrieved' ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Ready</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">Not Initialized</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Vector database collection status</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Upload className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-3 font-semibold text-lg">Upload Documents</h3>
              </div>
              <p className="text-sm text-center text-muted-foreground">Upload PDF documents to analyze</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button variant="outline" asChild>
                <a href="/upload">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <FileText className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-3 font-semibold text-lg">Process Documents</h3>
              </div>
              <p className="text-sm text-center text-muted-foreground">Split documents into chunks</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button variant="outline" asChild>
                <a href="/process">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Search className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-3 font-semibold text-lg">Search Documents</h3>
              </div>
              <p className="text-sm text-center text-muted-foreground">Search across your documents</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button variant="outline" asChild>
                <a href="/search">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <MessageSquare className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-3 font-semibold text-lg">Ask Questions</h3>
              </div>
              <p className="text-sm text-center text-muted-foreground">Get answers from your documents</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button variant="outline" asChild>
                <a href="/qa">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Database className="h-8 w-8 mx-auto text-primary" />
                <h3 className="mt-3 font-semibold text-lg">Manage Index</h3>
              </div>
              <p className="text-sm text-center text-muted-foreground">View and manage your vector index</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button variant="outline" asChild>
                <a href="/index/info">Get Started</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Project Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
          <CardDescription>Current status of project {selectedProject}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-1" /> Vector Database
                  </h4>
                  <div className="bg-muted rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Status:</div>
                      <div className="font-medium">
                        {indexInfo?.signal === 'vectordb_collection_retrieved' ? 'Active' : 'Not Initialized'}
                      </div>
                      <div className="text-muted-foreground">Documents:</div>
                      <div className="font-medium">{statistics?.totalDocuments || 0}</div>
                      <div className="text-muted-foreground">Collection:</div>
                      <div className="font-medium">
                        {indexInfo?.collection_info?.table_info?.tablename || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1" /> Usage Statistics
                  </h4>
                  <div className="bg-muted rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Queries:</div>
                      <div className="font-medium">{statistics?.totalQueries || 0}</div>
                      <div className="text-muted-foreground">Last Updated:</div>
                      <div className="font-medium">{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                <div className="text-sm text-muted-foreground">
                  {statistics?.totalDocuments === 0 ? (
                    <p>Start by uploading documents to your project from the Upload page.</p>
                  ) : (
                    <p>Your documents are indexed. You can now search or ask questions about your content.</p>
                  )}
                </div>
              </div>
            </div>
          )}
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