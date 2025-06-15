import { Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/layout/sidebar';
import { Header } from './components/layout/header';
import { ProjectProvider } from './context/ProjectContext.jsx';
import { LayoutProvider, useLayout } from './context/LayoutContext.tsx';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ErrorBanner } from './components/layout/ErrorBanner';
import { cn } from './lib/utils';

// Import pages with .tsx extension
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProcessPage from './pages/ProcessPage';
import IndexInfoPage from './pages/IndexInfoPage';
import IndexPushPage from './pages/IndexPushPage';
import SearchPage from './pages/SearchPage';
import QAPage from './pages/QAPage';
import AboutPage from './pages/AboutPage.jsx';
import TestConnectionPage from './pages/TestConnectionPage';
import IndexPage from './pages/IndexPage';

function App() {
  return (
    <ProjectProvider>
      <LayoutProvider>
        <TooltipProvider>
          <ErrorBanner />
          <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-8 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/process" element={<ProcessPage />} />
                  <Route path="/index" element={<IndexPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/qa" element={<QAPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/test" element={<TestConnectionPage />} />
                </Routes>
              </main>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </LayoutProvider>
    </ProjectProvider>
  );
}

export default App; 