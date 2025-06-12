import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Search, FileText, AlertCircle, FileQuestion, BarChart, Loader2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function SearchPage() {
  const { selectedProject } = useProject();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
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
      const response = await apiClient.post(`/nlp/index/search/${selectedProject}`, {
        text: query,
        limit: limit,
      });

      if (response.data && response.data.signal === 'success') {
        setResults(response.data.results);
      } else {
        toast.error(response.data.signal || 'Search failed due to an unknown error.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An unexpected error occurred during search.';
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const ResultCard = ({ result }) => (
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

      <form onSubmit={handleSearch} className="flex items-start gap-4">
        <div className="flex-grow space-y-2">
          <label htmlFor="search-query" className="sr-only">Search Query</label>
          <Input
            id="search-query"
            type="search"
            placeholder="Search for keywords, topics, or questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!selectedProject || isLoading}
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
            disabled={!selectedProject || isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !query.trim() || !selectedProject} className="self-end">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>

      {!selectedProject && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
          <AlertCircle className="h-5 w-5" />
          <p>Please select a project to start searching.</p>
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