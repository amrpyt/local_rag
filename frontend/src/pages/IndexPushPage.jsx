import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Loader2, Database } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import apiClient from '@/api/client';
import { toast } from 'sonner';

export default function IndexPushPage() {
  const { selectedProject } = useProject();
  const [doReset, setDoReset] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [result, setResult] = useState(null);

  const handlePush = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first.');
      return;
    }

    setIsPushing(true);
    setResult(null);
    const toastId = toast.loading('Indexing in progress...');

    try {
      const response = await apiClient.post(`/nlp/index/push/${selectedProject}`, {
        do_reset: doReset ? 1 : 0,
      });

      if (response.data && response.data.signal === 'success') {
        const resultData = { count: response.data.inserted_items_count };
        setResult(resultData);
        toast.success(`Successfully indexed ${resultData.count} items.`, { id: toastId });
      } else {
        toast.error(response.data.signal || 'An unknown error occurred.', { id: toastId });
      }
    } catch (error) {
      console.error("Indexing failed:", error);
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsPushing(false);
    }
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
              disabled={!selectedProject || isPushing}
            />
            <Label htmlFor="doReset" className="font-medium">
              Reset existing index before pushing
            </Label>
          </div>
          
          <Button onClick={handlePush} disabled={isPushing || !selectedProject} className="w-full">
            {isPushing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Indexing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Push Project {selectedProject} to Index
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Indexing Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Successfully inserted <strong>{result.count}</strong> items into the vector database.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 