import { useError } from '../../context/ErrorContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

export const ErrorBanner = () => {
  const { error, setError } = useError();

  if (!error) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 p-4">
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setError(null)}
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </Button>
        </Alert>
    </div>
  );
}; 