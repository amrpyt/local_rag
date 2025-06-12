import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { ProjectProvider } from './context/ProjectContext';
import { Toaster } from 'sonner';

// Pages
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ProcessPage from './pages/ProcessPage';
import SearchPage from './pages/SearchPage';
import QAPage from './pages/QAPage';
import IndexInfoPage from './pages/IndexInfoPage';
import IndexPushPage from './pages/IndexPushPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Import global styles
import './styles/globals.css';

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="qa" element={<QAPage />} />
            <Route path="index/info" element={<IndexInfoPage />} />
            <Route path="index/push" element={<IndexPushPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App; 