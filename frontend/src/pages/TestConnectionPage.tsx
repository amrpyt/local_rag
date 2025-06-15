import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import apiClient from '../api/client';
import TestApiComponent from '../components/TestApiComponent';
import DirectApiTest from '../components/DirectApiTest';
import { testDirectConnection, testProxyConnection, testCorsConnection } from '../api/test-connection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleDirectTest = async () => {
    setLoading(true);
    setStatus('Testing direct connection...');
    setError(null);
    
    try {
      const data = await testDirectConnection();
      setData(data);
      setStatus('Direct connection successful');
    } catch (err: any) {
      setStatus('Direct connection failed');
      setError(err.message || 'Unknown error');
      console.error('Direct API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProxyTest = async () => {
    setLoading(true);
    setStatus('Testing proxy connection...');
    setError(null);
    
    try {
      const data = await testProxyConnection();
      setData(data);
      setStatus('Proxy connection successful');
    } catch (err: any) {
      setStatus('Proxy connection failed');
      setError(err.message || 'Unknown error');
      console.error('Proxy API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCorsTest = async () => {
    setLoading(true);
    setStatus('Testing CORS connection...');
    setError(null);
    
    try {
      const data = await testCorsConnection();
      setData(data);
      setStatus('CORS connection successful');
    } catch (err: any) {
      setStatus('CORS connection failed');
      setError(err.message || 'Unknown error');
      console.error('CORS API connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Backend Connection Test</h1>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Tests</TabsTrigger>
          <TabsTrigger value="component">Component Test</TabsTrigger>
          <TabsTrigger value="direct">Direct API Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Tests</CardTitle>
              <CardDescription>Test basic connectivity to the backend API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Status:</strong> {status}
                </div>
                
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
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handleDirectTest} 
                    disabled={loading}
                  >
                    {loading ? 'Testing...' : 'Test Direct Connection'}
                  </Button>
                  
                  <Button 
                    onClick={handleProxyTest} 
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? 'Testing...' : 'Test Proxy Connection'}
                  </Button>

                  <Button 
                    onClick={handleCorsTest} 
                    disabled={loading}
                    variant="secondary"
                  >
                    {loading ? 'Testing...' : 'Test CORS Connection'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="component">
          <Card>
            <CardHeader>
              <CardTitle>Component Test</CardTitle>
              <CardDescription>Test API connection using the TestApiComponent</CardDescription>
            </CardHeader>
            <CardContent>
              <TestApiComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="direct">
          <DirectApiTest />
        </TabsContent>
      </Tabs>
    </div>
  );
} 