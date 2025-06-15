import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertCircle, Loader2, Database } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { usePushIndex } from '../hooks/useNlp';
import { toast } from 'sonner';
import { ResponseSignals } from '../constants/signals';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMessage } from '../components/ui/error-message';
import { LoadingIndicator } from '../components/ui/loading-indicator';

interface Project {
  id: number;
  name: string;
}

export default function IndexPushPage() {
  const { selectedProject } = useProject();
  const [doReset, setDoReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pushIndexMutation = usePushIndex();
  const { handleApiError, handleException, isSuccessResponse } = useErrorHandler();

  const handlePush = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first.');
      return;
    }

    setError(null);
    console.log('Selected Project Type:', typeof selectedProject);
    console.log('Selected Project Value:', selectedProject);
    
    // Extract project ID
    const projectId = typeof selectedProject === 'object' && selectedProject !== null 
      ? (selectedProject as Project).id 
      : parseInt(String(selectedProject), 10);
    
    console.log('Extracted Project ID:', projectId);

    if (isNaN(projectId)) {
      const errorMsg = 'Invalid project ID';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    pushIndexMutation.mutate({ projectId, doReset }, {
      onSuccess: (data) => {
        if (isSuccessResponse(data)) {
          toast.success(`Successfully indexed ${data.inserted_items_count} items.`);
        } else {
          setError(handleApiError(data, 'Failed to push to index. Please try again.'));
        }
      },
      onError: (error) => {
        setError(handleException(error, 'Failed to push to index. Please try again.'));
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Push to Index</h2>
        <p className="text-muted-foreground mt-2">
          Index the processed chunks into the vector database to make them searchable.
        </p>
      </div>

      {!selectedProject && (
        <ErrorMessage 
          message="Please select a project from the header to push its data to the index." 
        />
      )}

      {error && (
        <ErrorMessage message={error} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Start Indexing</CardTitle>
          <CardDescription>
            This action will insert the processed document chunks into the vector database, making them available for semantic search and Q&A.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 p-4 border bg-muted/50 rounded-lg">
            <Switch
              id="doReset"
              checked={doReset}
              onCheckedChange={setDoReset}
              disabled={!selectedProject || pushIndexMutation.isLoading}
            />
            <Label htmlFor="doReset" className="font-medium">
              Reset existing index before pushing
            </Label>
          </div>
          
          <Button onClick={handlePush} disabled={pushIndexMutation.isLoading || !selectedProject} className="w-full">
            {pushIndexMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Indexing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Push Project {typeof selectedProject === 'object' ? selectedProject.name : selectedProject} to Index
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {pushIndexMutation.isLoading && (
        <Card>
          <CardContent className="p-6">
            <LoadingIndicator text="Pushing documents to index..." />
          </CardContent>
        </Card>
      )}
      
      {pushIndexMutation.data && !pushIndexMutation.isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Indexing Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Successfully inserted <strong>{pushIndexMutation.data.inserted_items_count}</strong> items into the vector database.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 