import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Search, FileText, AlertCircle, FileQuestion, BarChart, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { searchDocuments, SearchResult, fetchIndexInfo } from '../api/db-client';
import { toast } from 'sonner';

/*
  TODO: Add a check to see if the project has indexed documents.
  This is currently blocked by a CORS issue preventing fetchIndexInfo from working.
  Once the backend is fixed, we should re-implement a check here to disable
  the search form if the index is not ready.
*/
export default function SearchPage() {
  const { selectedProject } = useProject();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isIndexReady, setIsIndexReady] = useState(false);
  const [isCheckingIndex, setIsCheckingIndex] = useState(true);

  useEffect(() => {
    const checkIndexStatus = async () => {
      if (!selectedProject) {
        setIsCheckingIndex(false);
        setIsIndexReady(false);
        return;
      }
      setIsCheckingIndex(true);
      try {
        const info = await fetchIndexInfo(selectedProject.toString());
        if (info && info.collection_info && info.collection_info.points_count > 0) {
          setIsIndexReady(true);
        } else {
          setIsIndexReady(false);
        }
      } catch (error) {
        console.error("Failed to fetch index status:", error);
        setIsIndexReady(false); // Assume not ready on error
      } finally {
        setIsCheckingIndex(false);
      }
    };
    checkIndexStatus();
  }, [selectedProject]);

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

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const response = await searchDocuments(selectedProject.toString(), query, limit);
      if (response && response.signal === 'vectordb_search_success') {
        setResults(response.results);
      } else {
        const errorMessage = response?.signal || 'An unknown error occurred during search.';
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred during search.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
        <p className="text-muted-foreground line-clamp-3">{result.payload?.text}</p>
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Documents</h2>
        <p className="text-muted-foreground mt-2">
          Perform a semantic search on your indexed documents.
        </p>
      </div>

      {!selectedProject ? (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>Please select a project to start searching.</p>
        </div>
      ) : isCheckingIndex ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="self-end">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>This project has no indexed documents. Please process documents before searching.</p>
        </div>
      )}

      <div className="space-y-4">
        {isLoading && Array.from({ length: limit }).map((_, i) => <ResultSkeleton key={i} />)}

        {!isLoading && hasSearched && results.length > 0 && (
          <>
            <h3 className="text-xl font-semibold">Found {results.length} result(s)</h3>
            {results.map((result) => <ResultCard key={result.id} result={result} />)}
          </>
        )}
        
        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
            <FileQuestion className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Results Found</h3>
            <p className="text-muted-foreground">Try a different search query or check if your documents are indexed.</p>
          </div>
        )}
      </div>
    </div>
  );
} 