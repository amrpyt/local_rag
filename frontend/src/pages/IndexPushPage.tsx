import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertCircle, Loader2, Database, UploadCloud, CheckCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { usePushIndex } from '../hooks/useNlp';
import { toast } from 'sonner';
import { ResponseSignals } from '../constants/signals';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMessage } from '../components/ui/error-message';
import { LoadingIndicator } from '../components/ui/loading-indicator';
import { Progress } from '../components/ui/progress';

interface Project {
  id: number;
  name: string;
}

export default function IndexPushPage() {
  const { selectedProject } = useProject();
  const [doReset, setDoReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const pushIndexMutation = usePushIndex();
  const { handleApiError, handleException, isSuccessResponse } = useErrorHandler();

  // Reset state when component unmounts or when project changes
  useEffect(() => {
    setError(null);
    setProgress(0);
    setIsCompleted(false);
    
    return () => {
      setError(null);
      setProgress(0);
      setIsCompleted(false);
    };
  }, [selectedProject]);

  // Simulate progress when indexing
  const simulateProgress = () => {
    setProgress(0);
    setIsCompleted(false);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95; // Stop at 95% until we get confirmation from server
        }
        return newProgress;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };

  const handlePush = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first.');
      return;
    }

    setError(null);
    setIsCompleted(false);
    
    // Extract project ID
    const projectId = typeof selectedProject === 'object' && selectedProject !== null 
      ? (selectedProject as Project).id 
      : parseInt(String(selectedProject), 10);
    
    if (isNaN(projectId)) {
      const errorMsg = 'Invalid project ID';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    // Start progress simulation
    const stopSimulation = simulateProgress();

    pushIndexMutation.mutate({ projectId, doReset }, {
      onSuccess: (data) => {
        if (isSuccessResponse(data)) {
          setProgress(100);
          setIsCompleted(true);
          setError(null);
          toast.success(`Successfully indexed ${data.inserted_items_count} items.`);
        } else {
          stopSimulation();
          setProgress(0);
          setIsCompleted(false);
          setError(handleApiError(data, 'Failed to push to index. Please try again.'));
        }
      },
      onError: (error) => {
        stopSimulation();
        setProgress(0);
        setIsCompleted(false);
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

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Start Indexing
              </CardTitle>
              <CardDescription>
                This action will insert the processed document chunks into the vector database, making them available for semantic search and Q&A.
              </CardDescription>
            </div>
          </div>
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
          
          {pushIndexMutation.isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Indexing in progress...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={handlePush} 
            disabled={pushIndexMutation.isLoading || !selectedProject} 
            className="w-full"
            size="lg"
          >
            {pushIndexMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Indexing...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" />
                Push Project {typeof selectedProject === 'object' ? selectedProject.name : selectedProject} to Index
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {pushIndexMutation.isLoading && !isCompleted && !error && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-6">
            <LoadingIndicator text="Pushing documents to index..." />
          </CardContent>
        </Card>
      )}
      
      {isCompleted && pushIndexMutation.data && !error && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5 mr-2" />
              Indexing Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Successfully inserted <strong>{pushIndexMutation.data.inserted_items_count}</strong> items into the vector database.</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">You can now use the Search and Q&A features with these indexed documents.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 