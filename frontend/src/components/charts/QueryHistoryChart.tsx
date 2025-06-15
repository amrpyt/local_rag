import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface QueryHistoryData {
  query_text: string;
  created_at: string;
}

interface QueryHistoryChartProps {
  data: QueryHistoryData[];
}

export function QueryHistoryChart({ data }: QueryHistoryChartProps) {
  // التأكد من وجود بيانات
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>تاريخ الاستعلامات</CardTitle>
          <CardDescription>عدد الاستعلامات على مدار الوقت</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </CardContent>
      </Card>
    );
  }

  // تجميع البيانات حسب التاريخ
  const groupedData = data.reduce((acc, item) => {
    // استخراج التاريخ فقط بدون الوقت
    const date = new Date(item.created_at).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {} as Record<string, number>);

  // تحويل البيانات المجمعة إلى مصفوفة للمخطط
  const chartData = Object.entries(groupedData).map(([date, count]) => ({
    date,
    count
  }));

  // ترتيب البيانات حسب التاريخ
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // تنسيق التاريخ للعرض
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تاريخ الاستعلامات</CardTitle>
        <CardDescription>عدد الاستعلامات على مدار الوقت</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} استعلام`, 'عدد الاستعلامات']}
              labelFormatter={(label) => `التاريخ: ${formatDate(label)}`}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="عدد الاستعلامات"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 