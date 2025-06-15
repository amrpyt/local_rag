import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useStatistics } from '../hooks/useStatistics';
import { useProject } from '../context/ProjectContext';
import { Loader2, AlertCircle } from 'lucide-react';

const StatisticsPage = () => {
    const { selectedProject } = useProject();
    const { data: stats, isLoading, isError, error } = useStatistics(selectedProject);

    const documentTypesData = stats?.document_types 
        ? Object.entries(stats.document_types).map(([name, count]) => ({ name, count })) 
        : [];

    const queriesOverTimeData = stats?.queries_over_time
        ? stats.queries_over_time.map(item => ({ name: new Date(item.date).toLocaleDateString(), queries: item.query_count }))
        : [];

    const renderChart = (title: string, data: any[], chart: React.ReactNode) => (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {isError && (
                    <div className="flex items-center justify-center h-[300px] text-destructive">
                        <AlertCircle className="h-8 w-8 mr-2" />
                        <p>Error: {error?.message || 'Could not load data'}</p>
                    </div>
                )}
                {!isLoading && !isError && data.length > 0 && (
                     <ResponsiveContainer width="100%" height={300}>
                        {chart}
                    </ResponsiveContainer>
                )}
                 {!isLoading && !isError && data.length === 0 && (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-muted-foreground">No data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (!selectedProject) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Please select a project to view statistics.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Statistics for {selectedProject}</h1>
            <div className="grid gap-8 md:grid-cols-2">
                {renderChart("Document Types", documentTypesData, (
                    <BarChart data={documentTypesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                ))}
                {renderChart("Query History", queriesOverTimeData, (
                     <LineChart data={queriesOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="queries" stroke="hsl(var(--primary))" />
                    </LineChart>
                ))}
            </div>
        </div>
    );
};

export default StatisticsPage; 