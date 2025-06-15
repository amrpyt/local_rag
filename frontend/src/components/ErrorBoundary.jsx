import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-destructive mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              The application encountered an error. This might be due to the backend server being unavailable.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Error details: {this.state.error?.message || 'Unknown error'}
            </p>
            <div className="flex justify-between">
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              <button
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 