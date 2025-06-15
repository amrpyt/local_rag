import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorProvider } from './context/ErrorContext';
import App from './App.tsx';
import './styles/globals.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorProvider>
      <App />
        </ErrorProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
); 