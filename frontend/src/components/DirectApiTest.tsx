import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useProject } from '../context/ProjectContext.jsx';

export function DirectApiTest() {
  const [apiStatus, setApiStatus] = useState<string>('Not tested');
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { selectedProject } = useProject();

  const testLocalApi = async () => {
    setApiStatus('Testing local API...');
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/projects/');
      const data = await response.json();
      
      setResponseData(data);
      setApiStatus('Local API test completed');
    } catch (err: any) {
      setError(`Local API error: ${err.message}`);
      setApiStatus('Local API test failed');
    }
  };

  const testRemoteApi = async () => {
    setApiStatus('Testing remote API...');
    setError(null);
    
    try {
      const response = await fetch('http://173.212.254.228:3001/api/v1/projects/');
      const data = await response.json();
      
      setResponseData(data);
      setApiStatus('Remote API test completed');
    } catch (err: any) {
      setError(`Remote API error: ${err.message}`);
      setApiStatus('Remote API test failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct API Test</CardTitle>
        <CardDescription>Test direct connection to API endpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p><strong>Current Project:</strong> {selectedProject ? `Project ${selectedProject}` : 'None'}</p>
            <p><strong>Status:</strong> {apiStatus}</p>
            
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
            
            {responseData && (
              <div className="mt-4 p-3 bg-gray-100 rounded overflow-auto max-h-40">
                <pre className="text-xs">{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testLocalApi} variant="outline">
              Test Local API
            </Button>
            <Button onClick={testRemoteApi} variant="outline">
              Test Remote API
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 