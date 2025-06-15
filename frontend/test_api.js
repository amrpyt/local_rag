// ملف اختبار للتحقق من الاتصال بالخادم
import apiClient from './src/api/client';

async function testApiConnection() {
  try {
    console.log('Testing API connection...');
    const response = await apiClient.get('/projects/');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Connection Error:', error);
    return { error: true, message: error.message };
  }
}

// تصدير الدالة للاستخدام في المكونات
export { testApiConnection }; 