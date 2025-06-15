import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IndexInfoPage from './IndexInfoPage';
import IndexPushPage from './IndexPushPage';
import { Database, UploadCloud } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ErrorMessage } from '../components/ui/error-message';

const IndexPage = () => {
  const { selectedProject } = useProject();
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Index Management</h1>
      
      {!selectedProject && (
        <ErrorMessage 
          variant="warning"
          message="Please select a project from the header to manage its index." 
          className="mb-4"
        />
      )}
      
      <Tabs 
        defaultValue="info" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Index Info
          </TabsTrigger>
          <TabsTrigger value="push" className="flex items-center">
            <UploadCloud className="h-4 w-4 mr-2" />
            Push to Index
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <IndexInfoPage />
        </TabsContent>
        <TabsContent value="push" className="mt-6">
          <IndexPushPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndexPage; 