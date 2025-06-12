import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface DocumentTypeData {
  doc_type: string;
  count: string;
}

interface DocumentTypeChartProps {
  data: DocumentTypeData[];
}

// ألوان المخطط
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function DocumentTypeChart({ data }: DocumentTypeChartProps) {
  // التأكد من وجود بيانات
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>أنواع المستندات</CardTitle>
          <CardDescription>توزيع المستندات حسب النوع</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </CardContent>
      </Card>
    );
  }

  // تحويل البيانات إلى التنسيق المطلوب للمخطط
  const chartData = data.map(item => ({
    type: item.doc_type || 'Unknown',
    count: parseInt(item.count)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>أنواع المستندات</CardTitle>
        <CardDescription>توزيع المستندات حسب النوع</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="type"
              label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} مستند`, `نوع: ${name}`]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 