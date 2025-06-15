import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle, RefreshCcw, Trash2, Database, BarChart } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useIndexInfo } from '../hooks/useIndexInfo';
import { useResetIndex } from '../hooks/useNlp';
import { toast } from 'sonner';
import { ErrorMessage } from '../components/ui/error-message';
import { LoadingIndicator } from '../components/ui/loading-indicator';

export default function IndexInfoPage() {
  const { selectedProject, useMockData } = useProject();
  const { data: indexInfo, isLoading, error, refetch } = useIndexInfo(selectedProject?.id, useMockData);
  const resetIndexMutation = useResetIndex();

  const handleResetIndex = async () => {
    if (!selectedProject) return;
    
    // Confirm before resetting
    if (!confirm('Are you sure you want to reset the index? This will delete all indexed documents.')) {
      return;
    }
    
    resetIndexMutation.mutate(selectedProject.id.toString(), {
        onSuccess: () => {
            toast.success("Index reset successfully.");
            refetch();
        },
        onError: (error) => {
            toast.error(`Failed to reset index: ${error.message}`);
        }
    });
  };
  
  const StatCard = ({ title, value, icon, isLoading, testId }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? 
          <Skeleton className="h-8 w-1/2" /> : 
          <p data-testid={testId} className="text-2xl font-bold">{value ?? 'N/A'}</p>
        }
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (!selectedProject) {
      return (
        <ErrorMessage 
          variant="info"
          message="Please select a project from the header to view its index information."
        />
      );
    }

    if (isLoading) {
      return <LoadingIndicator text="Loading index information..." />;
    }

    if (error) {
      return (
        <ErrorMessage 
          message={`Failed to load index information: ${error.message}`}
        />
      );
    }

    if (indexInfo && indexInfo.collection_info) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard 
            title="Collection Name" 
            value={indexInfo.collection_info.table_info?.tablename} 
            icon={<Database className="h-4 w-4 text-blue-500" />}
            isLoading={false} 
            testId="collection-name"
          />
          <StatCard 
            title="Indexed Records" 
            value={indexInfo.collection_info.record_count} 
            icon={<BarChart className="h-4 w-4 text-green-500" />}
            isLoading={false} 
            testId="total-records" 
          />
          <StatCard 
            title="Index Status" 
            value={indexInfo.collection_info.table_info?.hasindexes ? 'Active' : 'Not Active'} 
            icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
            isLoading={false} 
            testId="index-status"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Index Information</h2>
          <p className="text-muted-foreground mt-2">
            View details and statistics about your vector database collection.
          </p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="destructive" 
                onClick={handleResetIndex}
                disabled={resetIndexMutation.isLoading || !selectedProject || isLoading}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                {resetIndexMutation.isLoading ? 'Resetting...' : 'Reset Index'}
            </Button>
            <Button 
                onClick={() => refetch()} 
                disabled={isLoading || !selectedProject} 
                variant="outline"
            >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
        </div>
      </div>

      {renderContent()}

      {indexInfo && indexInfo.collection_info && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div data-testid="total-records" className="text-2xl font-bold">{indexInfo?.collection_info.record_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total number of items in the vector index.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 