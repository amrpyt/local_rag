import { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { fetchIndexInfo, IndexInfo } from '../api/db-client';
import { toast } from 'sonner';

export default function IndexInfoPage() {
  const { selectedProject } = useProject();
  const [indexInfo, setIndexInfo] = useState<IndexInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadIndexInfo = useCallback(async () => {
    if (!selectedProject) {
      setIndexInfo(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchIndexInfo(selectedProject);
      setIndexInfo(data);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      setIndexInfo(null);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject]);
  
  useEffect(() => {
    loadIndexInfo();
  }, [loadIndexInfo]);
  
  const StatCard = ({ title, value, isLoading }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p className="text-2xl font-bold">{value ?? 'N/A'}</p>}
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
          <p>{error}</p>
        </div>
      );
    }

    if (indexInfo && indexInfo.collection_info) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard title="Collection Name" value={indexInfo.collection_info.table_info.tablename} isLoading={false} />
          <StatCard title="Indexed Records" value={indexInfo.collection_info.record_count} isLoading={false} />
          <StatCard title="Index Status" value={indexInfo.collection_info.table_info.hasindexes ? 'Active' : 'Not Active'} isLoading={false} />
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
        <Button onClick={loadIndexInfo} disabled={isLoading || !selectedProject} variant="outline">
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {renderContent()}
    </div>
  );
} 