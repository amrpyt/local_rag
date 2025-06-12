import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function ProcessPage() {
  const { selectedProject } = useProject();
  const [chunkSize, setChunkSize] = useState(100);
  const [overlapSize, setOverlapSize] = useState(20);
  const [doReset, setDoReset] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleProcess = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first.');
      return;
    }

    if (overlapSize >= chunkSize) {
      toast.error("Overlap size cannot be larger than or equal to chunk size.");
      return;
    }

    setIsProcessing(true);
    setResult(null);
    const toastId = toast.loading('Processing documents...');

    try {
      const response = await apiClient.post(`/data/process/${selectedProject}`, {
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        do_reset: doReset ? 1 : 0,
      });

      if (response.data && response.data.signal === 'success') {
        const resultData = {
          processed_files: response.data.processed_files,
          inserted_chunks: response.data.inserted_chunks,
        };
        setResult(resultData);
        toast.success(
          `Processed ${resultData.processed_files} file(s) and created ${resultData.inserted_chunks} chunks.`,
          { id: toastId }
        );
      } else {
        toast.error(response.data.signal || 'An unknown error occurred.', { id: toastId });
      }
    } catch (error) {
      console.error("Processing failed:", error);
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Process Documents</h2>
        <p className="text-muted-foreground mt-2">
          Split uploaded documents into chunks for indexing. This step is crucial for effective search and retrieval.
        </p>
      </div>

      {!selectedProject && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>Please select a project from the header to start processing.</p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Processing Settings</CardTitle>
          <CardDescription>Configure how your documents will be chunked.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="chunkSize">Chunk Size</Label>
              <Input
                id="chunkSize"
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value, 10))}
                placeholder="e.g., 100"
                disabled={!selectedProject || isProcessing}
              />
              <p className="text-xs text-muted-foreground">The number of characters in each chunk.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overlapSize">Overlap Size</Label>
              <Input
                id="overlapSize"
                type="number"
                value={overlapSize}
                onChange={(e) => setOverlapSize(parseInt(e.target.value, 10))}
                placeholder="e.g., 20"
                disabled={!selectedProject || isProcessing}
              />
              <p className="text-xs text-muted-foreground">The number of characters to overlap between chunks.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="doReset"
              checked={doReset}
              onCheckedChange={setDoReset}
              disabled={!selectedProject || isProcessing}
            />
            <Label htmlFor="doReset">Reset existing chunks</Label>
          </div>
          
          <Button onClick={handleProcess} disabled={isProcessing || !selectedProject} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Process Project ${selectedProject}`
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Processing Complete</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Processed Files: <strong>{result.processed_files}</strong></p>
                <p>Inserted Chunks: <strong>{result.inserted_chunks}</strong></p>
            </CardContent>
        </Card>
      )}
    </div>
  );
} 