import { ExternalLink, Github, Server } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { Spinner } from '../components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { JsonDisplay } from '../components/JsonDisplay';
import apiClient from '../api/client';

export default function AboutPage() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTryIt = async () => {
    setLoading(true);
    setError(null);
    try {
      // Real API call
      const result = await apiClient.get('/');
      setResponse(result.data);
    } catch (err) {
      console.error('Error fetching welcome endpoint:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">About Rafiq</h2>
        <p className="text-muted-foreground mt-2">
          Learn about this project and how it works
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-3">What is Rafiq?</h3>
          <p className="text-muted-foreground">
            Rafiq (رفيق) means "companion" in Arabic. It is an advanced implementation of the Retrieval-Augmented Generation (RAG) model for question answering. 
            This project allows you to upload documents, process them into chunks, and perform semantic search 
            and question answering over your own data, making it your perfect knowledge companion.
          </p>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-3">How it Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary font-semibold">1</div>
              <div>
                <h4 className="font-medium">Upload Documents</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Upload PDF documents that you want to query
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary font-semibold">2</div>
              <div>
                <h4 className="font-medium">Process Documents</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Documents are split into smaller chunks for better retrieval
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary font-semibold">3</div>
              <div>
                <h4 className="font-medium">Index Chunks</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Text chunks are converted to vector embeddings and stored in a vector database
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center text-primary font-semibold">4</div>
              <div>
                <h4 className="font-medium">Search or Ask Questions</h4>
                <p className="text-muted-foreground text-sm mt-1">
                  Search across your documents or ask questions to get answers from your content
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-3">API Information</h3>
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <span className="font-medium">Welcome Endpoint</span>
          </div>
          
          <p className="mb-2"><strong>Endpoint:</strong> GET /api/v1/</p>
          <p className="mb-4"><strong>Description:</strong> Returns the application name and version.</p>
          
          <Button 
            onClick={handleTryIt}
            disabled={loading}
            className="mt-2"
          >
            {loading ? <><Spinner className="mr-2 h-4 w-4" /> Loading...</> : 'Try API'}
          </Button>

          {error && (
            <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {response && !error && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Response:</h4>
              <JsonDisplay className="bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(response, null, 2)}
              </JsonDisplay>
            </div>
          )}
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Frontend</h4>
              <ul className="text-muted-foreground text-sm mt-1 space-y-1">
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Shadcn/UI Components</li>
                <li>• React Router</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Backend</h4>
              <ul className="text-muted-foreground text-sm mt-1 space-y-1">
                <li>• FastAPI</li>
                <li>• Vector Database (PgVector)</li>
                <li>• PostgreSQL</li>
                <li>• Python</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Resources</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <a 
                href="https://github.com/bakrianoo/mini-rag" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                GitHub Repository
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              <a 
                href="https://www.youtube.com/playlist?list=PLvLvlVqNQGHCUR2p0b8a0QpVjDUg50wQj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                YouTube Tutorial Series
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <a 
              href="https://github.com/bakrianoo/mini-rag" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 