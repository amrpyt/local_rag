import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

// واجهة لبيانات المشروع
export interface Project {
  id: number;
  name: string;
}

// واجهة لنوع المستند
export interface DocumentTypeData {
  doc_type: string;
  count: string;
}

// واجهة لبيانات الاستعلام
export interface QueryHistoryData {
  query_text: string;
  created_at: string;
}

// واجهة للإحصائيات
export interface Statistics {
  totalDocuments: number;
  totalQueries: number;
  documentTypes: DocumentTypeData[];
  recentQueries: QueryHistoryData[];
}

// واجهة للخطأ
export interface ApiError {
  message: string;
  status?: number;
}

// إنشاء عميل API خاص بالاتصال بقاعدة البيانات
const dbClient = axios.create({
  baseURL: 'http://localhost:3001/api/v1/db',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// دالة لاختبار الاتصال بقاعدة البيانات
export async function testDbConnection() {
  try {
    const response = await dbClient.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error testing DB connection:', error);
    return { success: false, error: error.message };
  }
}

// دالة مساعدة لمعالجة أخطاء API
const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // الخادم استجاب برمز حالة خارج نطاق 2xx
    return {
      message: error.response.data?.error || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // الطلب تم إرساله لكن لم يتم استلام استجابة
    return {
      message: 'No response from server. Please check your connection.',
      status: 0
    };
  } else {
    // حدث خطأ أثناء إعداد الطلب
    return {
      message: error.message || 'Unknown error occurred',
      status: 0
    };
  }
};

// جلب قائمة المشاريع
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', handleApiError(error));
    // إرجاع مصفوفة فارغة في حالة الخطأ
    return [];
  }
};

// إنشاء مشروع جديد
export const createProject = async (name: string): Promise<Project | null> => {
  try {
    const response = await axios.post(`${API_URL}/projects`, { name });
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error('Error creating project:', apiError);
    
    // إعادة رمي الخطأ ليتم معالجته في المكون
    throw new Error(apiError.message);
  }
};

// جلب إحصائيات المشروع
export const fetchStatistics = async (projectId: number): Promise<Statistics | null> => {
  try {
    const response = await axios.get(`${API_URL}/statistics/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', handleApiError(error));
    return null;
  }
};

// دالة للحصول على بيانات المخططات
export async function fetchChartData(projectId: number) {
  try {
    const response = await dbClient.get(`/charts/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', handleApiError(error));
    // إرجاع بيانات افتراضية للمخططات في حالة الخطأ
    return {
      documentTypes: [
        { type: 'PDF', count: 10 },
        { type: 'TXT', count: 3 },
        { type: 'DOCX', count: 2 }
      ],
      queryHistory: [
        { date: '2023-06-01', count: 5 },
        { date: '2023-06-02', count: 8 },
        { date: '2023-06-03', count: 3 },
        { date: '2023-06-04', count: 7 },
        { date: '2023-06-05', count: 4 }
      ]
    };
  }
}

export default dbClient; 