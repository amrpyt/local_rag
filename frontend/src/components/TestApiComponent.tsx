import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import apiClient from '../api/client';

export function TestApiComponent() {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing...');
    setError(null);
    setData(null);
    setRequestDetails(null);
    
    try {
      // Log the request details
      const requestUrl = `${apiClient.defaults.baseURL}/projects/`;
      setRequestDetails(`Sending request to: ${requestUrl}`);
      
      // Test the connection to the projects endpoint
        const response = await apiClient.get('/projects/');
      
      setData(response.data);
      setStatus('Connection successful');
      setRequestDetails(`Request to ${requestUrl} succeeded with status ${response.status}`);
    } catch (err: any) {
      setStatus('Connection failed');
        
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        setRequestDetails(JSON.stringify(err.response.data, null, 2));
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. CORS or network issue.');
        } else {
        // Something happened in setting up the request
        setError(err.message || 'Unknown error');
      }
      
      console.error('API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
      </div>
          
          {requestDetails && (
            <div className="text-sm">
              <strong>Request Details:</strong>
              <div className="bg-muted p-2 rounded-md mt-1 overflow-auto max-h-24">
                {requestDetails}
              </div>
            </div>
          )}
      
      {error && (
            <div className="text-red-500">
          <strong>Error:</strong> {error}
        </div>
      )}
      
          {data && (
      <div>
              <strong>Response:</strong>
              <pre className="bg-muted p-2 rounded-md mt-2 overflow-auto max-h-48">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
          
          <Button 
            onClick={testConnection} 
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
      </div>
      </CardContent>
    </Card>
  );
} 

export default TestApiComponent; 