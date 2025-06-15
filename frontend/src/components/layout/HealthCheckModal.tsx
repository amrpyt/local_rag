import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Loader2, Server, CheckCircle, AlertCircle } from 'lucide-react';

interface HealthCheckResponse {
  app_name: string;
  app_version: string;
}

const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const { data } = await axios.get('/api/v1/');
  return data;
};

interface HealthCheckModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const HealthCheckModal = ({ isOpen, onOpenChange }: HealthCheckModalProps) => {
  const { data, isLoading, isError, error } = useQuery<HealthCheckResponse, Error>({
    queryKey: ['healthCheck'],
    queryFn: fetchHealthCheck,
    enabled: isOpen, // Only run the query when the modal is open
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Backend Status
          </DialogTitle>
          <DialogDescription>
            This modal displays the current status and version of the backend service.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking connection...</span>
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Error: {error.message}</span>
            </div>
          )}
          {data && (
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Connection successful</span>
                </div>
                <div className="pl-6 text-sm">
                    <div><strong>App Name:</strong> {data.app_name}</div>
                    <div><strong>App Version:</strong> {data.app_version}</div>
                </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 