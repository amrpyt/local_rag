import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Send, User, Bot, Loader2, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAnswer } from '../hooks/useNlp';
import { useIndexInfo } from '../hooks/useIndexInfo';
import Markdown from 'react-markdown';
import { Textarea } from '../components/ui/textarea';
import remarkGfm from 'remark-gfm';
import { ResponseSignals } from '../constants/signals';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMessage } from '../components/ui/error-message';
import { LoadingIndicator } from '../components/ui/loading-indicator';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  sources?: Answer['sources'];
}

interface Answer {
  answer: string;
  sources: Array<{
    content: string;
    metadata: {
      source: string;
      page?: number;
    };
  }>;
}

/*
  TODO: Add a check to see if the project has indexed documents.
  This is currently blocked by a CORS issue preventing fetchIndexInfo from working.
  Once the backend is fixed, we should re-implement a check here to disable
  the Q&A form if the index is not ready.
*/
export default function QAPage() {
  const { selectedProject, useMockData } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const answerMutation = useAnswer(useMockData);
  const { data: indexInfo, isLoading: isIndexInfoLoading } = useIndexInfo(selectedProject?.id, useMockData);
  const { handleApiError, handleException, isSuccessResponse } = useErrorHandler();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const isIndexReady = indexInfo && indexInfo.collection_info && 
    (indexInfo.collection_info.record_count > 0 || 
    indexInfo.collection_info.vector_count > 0 || 
    indexInfo.collection_info.points_count > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedProject) return;

    setError(null);
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerMutation.mutateAsync({
        projectId: selectedProject.id,
        text: input,
      });

      // Check if the response was successful
      if (isSuccessResponse(response)) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response.answer || "Sorry, I couldn't generate an answer.",
          sources: response.sources,
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Handle error response
        const errorMsg = handleApiError(response, 'Failed to generate an answer. Please try again.');
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: `Sorry, I ran into an error: ${errorMsg}`,
        };
        setMessages(prev => [...prev, errorMessage]);
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = handleException(error, 'An unexpected error occurred while generating an answer.');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `Sorry, there was an error processing your question: ${errorMsg}`,
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex items-start gap-4 my-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
      {message.role === 'bot' && (
        <Avatar className="w-8 h-8">
          <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
        </div>
        {message.role === 'bot' && message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-muted-foreground/20">
            <h4 className="text-xs font-semibold mb-1">Sources:</h4>
            <div className="space-y-1">
              {message.sources.map((source, index) => (
                <div key={index} className="text-xs bg-background/50 p-1.5 rounded-md">
                   <p className="font-bold">
                    {source.metadata?.source || 'Unknown source'}
                    {source.metadata?.page && ` (Page ${source.metadata.page})`}
                  </p>
                  <p className="italic opacity-80 line-clamp-2">"{source.content || 'No content available'}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
       {message.role === 'user' && (
        <Avatar className="w-8 h-8">
          <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex-1 flex flex-col h-full w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="text-primary"/>
                Ask Your Documents
            </CardTitle>
          <CardDescription>
            Ask questions about the content of{' '}
            <span className="font-bold text-primary">{selectedProject ? (typeof selectedProject === 'object' ? selectedProject.name : selectedProject) : 'your selected project'}</span>.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 relative">
          {isIndexInfoLoading && (
            <LoadingIndicator text="Loading project information..." />
          )}
          
          {!selectedProject && (
            <ErrorMessage 
              variant="error" 
              message="Please select a project to start asking questions." 
            />
          )}
          
          {selectedProject && !isIndexInfoLoading && !isIndexReady && (
            <ErrorMessage 
              variant="warning" 
              message="This project has no indexed documents. Please process and index documents before asking questions." 
            />
          )}
          
          {error && (
            <ErrorMessage 
              message={error} 
              className="mb-4" 
            />
          )}
          
          <div className="space-y-4">
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground pt-16">
                    <MessageSquare size={48} className="mx-auto" />
                    <p className="mt-4">No messages yet. Start by asking a question below.</p>
                </div>
            ) : (
                messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={!selectedProject || isLoading}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || !selectedProject || isLoading}
              size="icon"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
           {!selectedProject && (
              <p className="text-xs text-destructive text-center mt-2">Please select a project from the dropdown in the header to begin.</p>
           )}
        </div>
      </Card>
    </div>
  );
} 