import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IndexInfoPage from './IndexInfoPage';
import IndexPushPage from './IndexPushPage';

const IndexPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Index Management</h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Index Info</TabsTrigger>
          <TabsTrigger value="push">Push to Index</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <IndexInfoPage />
        </TabsContent>
        <TabsContent value="push">
          <IndexPushPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IndexPage; 