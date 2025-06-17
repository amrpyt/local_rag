import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Search, FileText, AlertCircle, FileQuestion, BarChart, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useSearch, useAnswer } from '../hooks/useNlp';
import { useIndexInfo } from '../hooks/useIndexInfo';
import { toast } from 'sonner';
import { ResponseSignals } from '../constants/signals';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMessage } from '../components/ui/error-message';
import { LoadingIndicator } from '../components/ui/loading-indicator';

interface SearchResult {
  text: string;
  score: number;
  payload?: {
    file_name: string;
    [key: string]: any;
  };
}

/*
  TODO: Add a check to see if the project has indexed documents.
  This is currently blocked by a CORS issue preventing fetchIndexInfo from working.
  Once the backend is fixed, we should re-implement a check here to disable
  the search form if the index is not ready.
*/
export default function SearchPage() {
  const { selectedProject, useMockData } = useProject();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchMutation = useSearch(useMockData);
  const answerMutation = useAnswer(useMockData);
  const { data: indexInfo, isLoading: isIndexInfoLoading } = useIndexInfo(selectedProject?.id, useMockData);
  const { handleApiError, handleException, isSuccessResponse } = useErrorHandler();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    if (!selectedProject) {
      toast.error("Please select a project first.");
      return;
    }

    setHasSearched(true);
    setResults([]);
    setAnswer(null);
    setError(null);

    const projectId = typeof selectedProject === 'object' ? selectedProject.id : selectedProject;
    searchMutation.mutate({ projectId, text: query, limit }, {
      onSuccess: (data) => {
        if (isSuccessResponse(data)) {
          console.log("Search results received:", data.results);
          if (data.results && Array.isArray(data.results)) {
            setResults(data.results);
          } else {
            setError("Invalid search results format received");
          }
        } else {
          setError(handleApiError(data, 'Search failed. Please try again.'));
        }
      },
      onError: (err: any) => {
        setError(handleException(err, 'An unexpected error occurred during search.'));
      }
    });
  };

  // Log when results state changes
  useEffect(() => {
    console.log("Results state updated:", results);
    console.log("Results length:", results.length);
  }, [results]);

  const handleAnswer = async () => {
    if (!query.trim() || !selectedProject) return;

    setAnswer(null);
    setError(null);
    const projectId = typeof selectedProject === 'object' ? selectedProject.id : selectedProject;

    answerMutation.mutate({ projectId, text: query, limit }, {
      onSuccess: (data) => {
        if (isSuccessResponse(data)) {
          setAnswer(data.answer);
        } else {
          setError(handleApiError(data, 'Failed to generate answer. Please try again.'));
        }
      },
      onError: (err: any) => {
        setError(handleException(err, 'An unexpected error occurred while answering.'));
      }
    });
  };
  
  const ResultCard = ({ result }: { result: SearchResult }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-5 w-5 text-primary" />
          <span>Source: {result.payload?.file_name || 'Unknown'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{result.text}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
          <BarChart className="h-4 w-4" />
          Score: {result.score.toFixed(4)}
        </div>
      </CardFooter>
    </Card>
  );

  const ResultSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-1/4" />
      </CardFooter>
    </Card>
  )

  const isIndexReady = indexInfo && indexInfo.collection_info && 
    (indexInfo.collection_info.record_count > 0 || 
    indexInfo.collection_info.vector_count > 0 || 
    indexInfo.collection_info.points_count > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Documents</h2>
        <p className="text-muted-foreground mt-2">
          Perform a semantic search on your indexed documents.
        </p>
      </div>

      {!selectedProject ? (
        <ErrorMessage 
          message="Please select a project to start searching."
        />
      ) : isIndexInfoLoading ? (
        <div className="space-y-4">
          <LoadingIndicator text="Loading project information..." />
        </div>
      ) : isIndexReady ? (
        <form onSubmit={handleSearch} className="flex items-start gap-4">
          <div className="flex-grow space-y-2">
            <label htmlFor="search-query" className="sr-only">Search Query</label>
            <Input
              id="search-query"
              type="search"
              placeholder="Search for keywords, topics, or questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={searchMutation.isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="limit" className="sr-only">Limit</label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="w-24"
              disabled={searchMutation.isLoading}
            />
          </div>
          <Button type="submit" disabled={searchMutation.isLoading || !query.trim()} className="self-end">
            {searchMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </form>
      ) : (
        <ErrorMessage 
          variant="warning"
          message="This project has no indexed documents. Please process documents before searching."
        />
      )}

      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {searchMutation.isLoading && (
          <LoadingIndicator text="Searching documents..." />
        )}

        {!searchMutation.isLoading && hasSearched && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Found {results.length} result(s)</h3>
              <Button onClick={handleAnswer} disabled={answerMutation.isLoading}>
                {answerMutation.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileQuestion className="mr-2 h-4 w-4" />
                )}
                Generate Answer
              </Button>
            </div>
            <div className="space-y-4">
              {results.map((result, index) => (
                <ResultCard key={`result-${index}`} result={result} />
              ))}
            </div>
          </div>
        )}
        
        {!searchMutation.isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Results Found</h3>
            <p className="text-muted-foreground">Try a different search query or check if your documents are indexed.</p>
          </div>
        )}
      </div>

      {answerMutation.isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadingIndicator text="Generating answer..." />
          </CardContent>
        </Card>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 