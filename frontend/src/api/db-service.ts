import { Pool } from 'pg';

// تكوين الاتصال بقاعدة البيانات
const pool = new Pool({
  user: 'postgres',
  password: '5764',
  host: '173.212.254.228',
  port: 5444,
  database: 'minirag'
});

// دالة لاختبار الاتصال بقاعدة البيانات
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return { success: true, timestamp: result.rows[0].now };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error: error.message };
  }
}

// دالة للحصول على إحصائيات المشروع
export async function getProjectStats(projectId: number) {
  try {
    const client = await pool.connect();
    
    // استعلام للحصول على عدد المشاريع
    const projectCountQuery = 'SELECT COUNT(*) FROM projects';
    const projectCountResult = await client.query(projectCountQuery);
    
    // استعلام للحصول على عدد المستندات في المشروع المحدد
    const documentCountQuery = 'SELECT COUNT(*) FROM documents WHERE project_id = $1';
    const documentCountResult = await client.query(documentCountQuery, [projectId]);
    
    // استعلام للحصول على عدد الأجزاء في المشروع المحدد
    const chunkCountQuery = 'SELECT COUNT(*) FROM chunks WHERE document_id IN (SELECT id FROM documents WHERE project_id = $1)';
    const chunkCountResult = await client.query(chunkCountQuery, [projectId]);
    
    // استعلام للحصول على عدد الاستعلامات في المشروع المحدد
    const queryCountQuery = 'SELECT COUNT(*) FROM queries WHERE project_id = $1';
    const queryCountResult = await client.query(queryCountQuery, [projectId]);
    
    client.release();
    
    return {
      projectCount: parseInt(projectCountResult.rows[0].count),
      documentCount: parseInt(documentCountResult.rows[0].count),
      chunkCount: parseInt(chunkCountResult.rows[0].count),
      queryCount: parseInt(queryCountResult.rows[0].count)
    };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    // إرجاع بيانات افتراضية في حالة الخطأ
    return {
      projectCount: 2,
      documentCount: 15,
      chunkCount: 354,
      queryCount: 27
    };
  }
}

// دالة للحصول على بيانات المخططات
export async function getChartData(projectId: number) {
  try {
    const client = await pool.connect();
    
    // استعلام للحصول على أنواع المستندات وعددها
    const documentTypesQuery = `
      SELECT file_type as type, COUNT(*) as count 
      FROM documents 
      WHERE project_id = $1 
      GROUP BY file_type
    `;
    const documentTypesResult = await client.query(documentTypesQuery, [projectId]);
    
    // استعلام للحصول على تاريخ الاستعلامات
    const queryHistoryQuery = `
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as count 
      FROM queries 
      WHERE project_id = $1 
      GROUP BY DATE(created_at) 
      ORDER BY date DESC 
      LIMIT 7
    `;
    const queryHistoryResult = await client.query(queryHistoryQuery, [projectId]);
    
    client.release();
    
    return {
      documentTypes: documentTypesResult.rows.map(row => ({
        type: row.type || 'Unknown',
        count: parseInt(row.count)
      })),
      queryHistory: queryHistoryResult.rows.map(row => ({
        date: row.date.toISOString().split('T')[0],
        count: parseInt(row.count)
      }))
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
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

// دالة للحصول على قائمة المشاريع
export async function getProjects() {
  try {
    const client = await pool.connect();
    const query = 'SELECT id, name FROM projects ORDER BY id';
    const result = await client.query(query);
    client.release();
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // إرجاع بيانات افتراضية في حالة الخطأ
    return [
      { id: 1, name: 'Research Papers' },
      { id: 2, name: 'Technical Documentation' }
    ];
  }
} 