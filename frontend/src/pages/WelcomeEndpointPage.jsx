import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { JsonDisplay } from '../components/JsonDisplay';
import apiClient from '../api/client';

const WelcomeEndpointPage = () => {
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
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome Endpoint</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2"><strong>Endpoint:</strong> GET /api/v1/</p>
          <p className="mb-4"><strong>Description:</strong> Returns the application name and version.</p>
          
          <Button 
            onClick={handleTryIt}
            disabled={loading}
            className="mt-2"
          >
            {loading ? <><Spinner className="mr-2 h-4 w-4" /> Loading...</> : 'Try it'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {response && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <JsonDisplay className="mt-4 bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(response, null, 2)}
            </JsonDisplay>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomeEndpointPage; 