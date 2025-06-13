import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Send, User, Bot, Loader2, AlertCircle, Sparkles, MessageSquare, Info } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { askQuestion, QAResult, SearchResult } from '../api/db-client';
import Markdown from 'react-markdown';
import { SplineSceneBasic } from '../components/ui/demo';

interface Message {
  role: 'user' | 'bot';
  content: string;
  prompt?: string;
  error?: boolean;
}

export default function QAPage() {
  const { selectedProject } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedProject) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion(selectedProject.toString(), input);

      if (response && response.signal === 'rag_answer_success') {
      const botMessage: Message = { 
        role: 'bot', 
        content: response.answer,
          prompt: response.full_prompt
      };
      setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = response?.signal || 'Sorry, I ran into an error.';
        const errorBotMessage: Message = { role: 'bot', content: errorMessage, error: true };
        setMessages((prev) => [...prev, errorBotMessage]);
      }
    } catch (err) {
      const errorBotMessage: Message = { role: 'bot', content: 'Sorry, I ran into an error. Please try again.', error: true };
      setMessages((prev) => [...prev, errorBotMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const Message = ({ message }: { message: Message }) => (
    <div className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
      {message.role === 'bot' && (
        <Avatar>
          <AvatarFallback><Bot /></AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] rounded-lg p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : (message.error ? 'bg-destructive/10 border border-destructive' : 'bg-muted')}`}>
        <div className="prose text-sm max-w-none">
          <Markdown>{message.content}</Markdown>
        </div>
        {message.prompt && (
          <Accordion type="single" collapsible className="w-full mt-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xs flex items-center gap-1">
                <Info className="h-3 w-3" /> View Prompt
              </AccordionTrigger>
              <AccordionContent className="text-xs bg-background/50 p-2 rounded prose-sm">
                <pre className="whitespace-pre-wrap font-mono">{message.prompt}</pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
       {message.role === 'user' && (
        <Avatar>
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
             {!selectedProject ? (
              <>
                <SplineSceneBasic />
                <AlertCircle className="h-12 w-12 text-destructive mb-4 mt-4" />
                <h3 className="text-xl font-semibold">No Project Selected</h3>
                <p className="text-muted-foreground">Please select a project from the header to start a conversation.</p>
              </>
            ) : (
              <>
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Ready to Answer</h3>
                <p className="text-muted-foreground">Ask a question about the documents in Project {selectedProject}.</p>
              </>
            )}
          </div>
        ) : (
          messages.map((msg, index) => <Message key={index} message={msg} />)
        )}
         {isLoading && (
            <div className="flex items-start gap-4">
                <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>
                <div className="max-w-[75%] rounded-lg p-4 bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSend} className="flex items-center gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            disabled={isLoading || !selectedProject}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim() || !selectedProject} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
} 