const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// إعداد اتصال قاعدة البيانات
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'minirag',
  password: 'postgres',
  port: 5432,
});

// ميدلوير
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// اختبار الاتصال بقاعدة البيانات
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err);
  } else {
    console.log('تم الاتصال بقاعدة البيانات بنجاح:', res.rows[0].now);
  }
});

// بيانات افتراضية للمشاريع
const mockProjects = [
  { id: 1, name: 'Research Papers' },
  { id: 2, name: 'Technical Documentation' },
  { id: 3, name: 'Legal Documents' }
];

// بيانات افتراضية للإحصائيات
const mockStatistics = {
  totalDocuments: 125,
  totalQueries: 47,
  documentTypes: [
    { doc_type: 'PDF', count: '78' },
    { doc_type: 'Word', count: '32' },
    { doc_type: 'Text', count: '15' }
  ],
  recentQueries: [
    { query_text: 'How to implement RAG?', created_at: '2024-06-10T14:23:45Z' },
    { query_text: 'What is vector database?', created_at: '2024-06-10T10:15:30Z' },
    { query_text: 'Explain LLM architecture', created_at: '2024-06-09T16:42:18Z' },
    { query_text: 'Compare embeddings models', created_at: '2024-06-09T09:30:22Z' },
    { query_text: 'Best practices for chunking', created_at: '2024-06-08T11:20:15Z' }
  ]
};

// نقطة نهاية للحصول على المشاريع
app.get('/api/v1/projects', (req, res) => {
  // استخدام بيانات افتراضية بدلاً من قاعدة البيانات
  res.json(mockProjects);
});

// نقطة نهاية لإنشاء مشروع جديد
app.post('/api/v1/projects', (req, res) => {
  const { name } = req.body;
  const newProject = {
    id: mockProjects.length + 1,
    name
  };
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

// نقطة نهاية للحصول على إحصائيات المشروع
app.get('/api/v1/statistics/:projectId', (req, res) => {
  // إرجاع بيانات افتراضية بغض النظر عن المشروع
  res.json(mockStatistics);
});

// التعامل مع جميع المسارات الأخرى
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
}); 