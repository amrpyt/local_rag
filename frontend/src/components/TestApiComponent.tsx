import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export function TestApiComponent() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [projects, setProjects] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API connection...');
        const response = await apiClient.get('/projects/');
        console.log('API Response:', response.data);
        
        if (response.data && response.data.signal === 'success') {
          setApiStatus('Connected successfully!');
          setProjects(response.data.projects || []);
        } else {
          setApiStatus('Connected, but received unexpected data format');
          setError(JSON.stringify(response.data));
        }
      } catch (error: any) {
        console.error('API Connection Error:', error);
        setApiStatus('Connection failed');
        setError(error.message || 'Unknown error');
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-bold mb-2">API Connection Test</h3>
      <div className="mb-2">
        <strong>Status:</strong> {apiStatus}
      </div>
      
      {error && (
        <div className="mb-2 text-red-500">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div>
        <strong>Projects:</strong>
        {projects.length > 0 ? (
          <ul className="list-disc pl-5">
            {projects.map(project => (
              <li key={project}>Project {project}</li>
            ))}
          </ul>
        ) : (
          <p>No projects found or using default project</p>
        )}
      </div>
    </div>
  );
} 