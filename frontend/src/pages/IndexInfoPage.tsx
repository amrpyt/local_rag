import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle, RefreshCcw, UploadCloud, Trash2, Users } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useIndexInfo } from '../hooks/useIndexInfo';
import { useResetIndex } from '../hooks/useNlp';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function IndexInfoPage() {
  const { selectedProject, useMockData } = useProject();
  const { data: indexInfo, isLoading, error, refetch } = useIndexInfo(selectedProject?.id, useMockData);
  const resetIndexMutation = useResetIndex();

  const handleResetIndex = async () => {
    if (!selectedProject) return;
    
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
  
  const StatCard = ({ title, value, isLoading, testId }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p data-testid={testId} className="text-2xl font-bold">{value ?? 'N/A'}</p>}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (!selectedProject) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No Project Selected</h3>
          <p className="text-muted-foreground">Please select a project from the header to view its index information.</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard title="Collection Name" isLoading={true} />
          <StatCard title="Indexed Records" isLoading={true} />
          <StatCard title="Index Status" isLoading={true} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-destructive rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold">An Error Occurred</h3>
          <p>{error.message}</p>
        </div>
      );
    }

    if (indexInfo && indexInfo.collection_info) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard title="Collection Name" value={indexInfo.collection_info.table_info?.tablename} isLoading={false} />
          <StatCard title="Indexed Records" value={indexInfo.collection_info.record_count} isLoading={false} testId="total-records" />
          <StatCard title="Index Status" value={indexInfo.collection_info.table_info?.hasindexes ? 'Active' : 'Not Active'} isLoading={false} />
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
            <Button asChild>
                <Link to="/index/push">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Push to Index
                </Link>
            </Button>
            <Button 
                variant="destructive" 
                onClick={handleResetIndex}
                disabled={resetIndexMutation.isLoading || !selectedProject}
            >
                <Trash2 className="h-4 w-4 mr-2" />
                {resetIndexMutation.isLoading ? 'Resetting...' : 'Reset Index'}
            </Button>
            <Button onClick={() => refetch()} disabled={isLoading || !selectedProject} variant="outline">
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        </div>
      </div>

      {renderContent()}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div data-testid="total-records" className="text-2xl font-bold">{indexInfo?.collection_info.record_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total number of items in the vector index.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 