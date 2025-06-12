import { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function IndexInfoPage() {
  const { selectedProject } = useProject();
  const [indexInfo, setIndexInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIndexInfo = useCallback(async () => {
    if (!selectedProject) {
      setIndexInfo(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/nlp/index/info/${selectedProject}`);
      if (response.data && response.data.signal === 'success') {
        setIndexInfo(response.data.collection_info);
      } else {
        const errorMessage = response.data.signal || 'Failed to fetch index info.';
        setError(errorMessage);
        setIndexInfo(null);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An unexpected error occurred.';
      setError(errorMessage);
      setIndexInfo(null);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject]);
  
  useEffect(() => {
    fetchIndexInfo();
  }, [fetchIndexInfo]);
  
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
          <StatCard title="Total Vectors" isLoading={true} />
          <StatCard title="Indexed Vectors" isLoading={true} />
          <StatCard title="Vector Size" isLoading={true} />
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

    if (indexInfo) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard title="Total Vectors" value={indexInfo.vectors_count} />
          <StatCard title="Indexed Vectors" value={indexInfo.indexed_vectors_count} />
          <StatCard title="Vector Size" value={indexInfo.vectors_dim} />
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
        <Button onClick={fetchIndexInfo} disabled={isLoading || !selectedProject} variant="outline">
          <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {renderContent()}
    </div>
  );
} 