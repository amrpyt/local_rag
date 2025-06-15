import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useProject } from '../context/ProjectContext.jsx';

const DirectApiTest = () => {
  const [status, setStatus] = useState('Not tested');
  const [data, setData] = useState(null);
  const { selectedProject } = useProject();
  const [apiStatus, setApiStatus] = useState('Not tested');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const testRemoteApi = async () => {
    setApiStatus('Testing remote API...');
    setError(null);
    
    try {
      const response = await fetch('http://173.212.254.228:5000/api/v1/projects/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
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
            <p><strong>Current Project:</strong> {selectedProject ? `Project ${typeof selectedProject === 'object' ? selectedProject.name : selectedProject}` : 'None'}</p>
            <p><strong>Status:</strong> {apiStatus}</p>
            
            {error && (
              <div className="mt-2 text-red-500">
                <p>{error}</p>
              </div>
            )}
            
            {responseData && (
              <div className="mt-4 p-3 bg-gray-100 rounded overflow-auto max-h-40">
                <pre className="text-xs">{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testRemoteApi}>Test API</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectApiTest; 