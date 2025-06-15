import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertCircle, Loader2, Database } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { usePushIndex } from '../hooks/useNlp';
import { toast } from 'sonner';

export default function IndexPushPage() {
  const { selectedProject } = useProject();
  const [doReset, setDoReset] = useState(false);
  const pushIndexMutation = usePushIndex();

  const handlePush = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first.');
      return;
    }

    pushIndexMutation.mutate({ projectId: selectedProject, doReset }, {
      onSuccess: (data) => {
        toast.success(`Successfully indexed ${data.inserted_items_count} items.`);
      },
      onError: (error) => {
        toast.error(`Failed to push to index: ${error.message}`);
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
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>Please select a project from the header to push its data to the index.</p>
        </div>
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
      
      {pushIndexMutation.data && (
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