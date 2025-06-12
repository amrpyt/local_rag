const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// ميدلوير
app.use(cors());
app.use(express.json());

// بيانات افتراضية للمشاريع
const mockProjects = [
  { id: 1, name: 'Research Papers' },
  { id: 2, name: 'Technical Documentation' },
  { id: 3, name: 'Legal Documents' }
];

// بيانات افتراضية للإحصائيات لمشاريع مختلفة
const mockStatistics = {
  '1': {
    totalDocuments: 125,
    totalQueries: 47,
    documentTypes: [
      { doc_type: 'PDF', count: '78' },
      { doc_type: 'Word', count: '32' },
      { doc_type: 'Text', count: '15' }
    ],
    recentQueries: [
      { query_text: 'How to implement RAG?', created_at: '2024-06-10T14:23:45Z' },
      { query_text: 'What is vector database?', created_at: '2024-06-10T10:15:30Z' }
    ]
  },
  '2': {
    totalDocuments: 250,
    totalQueries: 98,
    documentTypes: [
      { doc_type: 'PDF', count: '150' },
      { doc_type: 'Word', count: '70' },
      { doc_type: 'Text', count: '30' }
    ],
    recentQueries: [
      { query_text: 'Best practices for documentation?', created_at: '2024-06-11T11:00:00Z' },
      { query_text: 'How to write technical specs?', created_at: '2024-06-11T09:30:00Z' }
    ]
  },
  '3': {
    totalDocuments: 50,
    totalQueries: 20,
    documentTypes: [
      { doc_type: 'PDF', count: '40' },
      { doc_type: 'Word', count: '5' },
      { doc_type: 'Text', count: '5' }
    ],
    recentQueries: [
      { query_text: 'What is a legal clause?', created_at: '2024-06-12T15:00:00Z' }
    ]
  },
  'default': {
    totalDocuments: 10,
    totalQueries: 5,
    documentTypes: [
      { doc_type: 'PDF', count: '8' },
      { doc_type: 'Text', count: '2' }
    ],
    recentQueries: []
  }
};

// إعداد Multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'frontend/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // التأكد من أن اسم الملف فريد لمنع الكتابة فوق الملفات
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// نقطة نهاية للحصول على المشاريع
app.get('/api/v1/projects', (req, res) => {
  res.json(mockProjects);
});

// نقطة نهاية لإنشاء مشروع جديد
app.post('/api/v1/projects', (req, res) => {
  const { name } = req.body;
  
  // التحقق من أن اسم المشروع غير فارغ
  if (!name || name.trim() === '') {
    return res.status(400).json({ 
      error: 'Project name is required' 
    });
  }
  
  // التحقق من أن اسم المشروع فريد
  const projectExists = mockProjects.some(
    project => project.name.toLowerCase() === name.toLowerCase()
  );
  
  if (projectExists) {
    return res.status(400).json({ 
      error: 'A project with this name already exists' 
    });
  }
  
  // إنشاء المشروع الجديد
  const newId = Math.max(...mockProjects.map(p => p.id), 0) + 1;
  const newProject = {
    id: newId,
    name
  };
  
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

// نقطة نهاية لرفع الملفات
app.post('/api/v1/data/upload/:projectId', upload.single('file'), (req, res) => {
  const { projectId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ signal: 'fail', error: 'No file uploaded.' });
  }

  console.log(`File uploaded for project ${projectId}:`, file.filename);

  // في تطبيق حقيقي، ستقوم هنا بمعالجة الملف وتخزين معلوماته في قاعدة البيانات
  
  // إرجاع استجابة نجاح
  res.status(200).json({ 
    signal: 'success', 
    message: `File ${file.originalname} uploaded successfully for project ${projectId}.`,
    filename: file.filename 
  });
});

// نقطة نهاية للحصول على إحصائيات المشروع
app.get('/api/v1/statistics/:projectId', (req, res) => {
  const { projectId } = req.params;
  const stats = mockStatistics[projectId] || mockStatistics['default'];
  res.json(stats);
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
}); 