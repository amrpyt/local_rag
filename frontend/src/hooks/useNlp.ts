import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { ResponseSignals } from '../constants/signals';

// Define response shapes based on the PRD
interface IndexPushResponse {
  signal: string;
  inserted_items_count: number;
}

interface SearchResponse {
  signal: string;
  results: any[]; // Define a more specific type for results if possible
}

interface AnswerResponse {
  signal: string;
  answer: string;
  full_prompt?: string;
  chat_history?: any; // Define a more specific type for chat history if possible
  sources?: any[];
}

interface PushToIndexResponse {
  signal: string;
  message: string;
}

interface ResetIndexResponse {
  signal: string;
}

const mockAnswers = [
  "المصروفات الدراسية للبرامج العادية حوالي 15 ألف جنيه في السنة، والبرامج الخاصة أغلى شوية.",
  "مواعيد تقديم التظلمات بتنزل على الصفحة الرسمية للكلية على فيسبوك بعد ظهور النتيجة.",
  "تقدر تعرف جدول الامتحانات من على موقع الكلية أو من الأبلكيشن بتاع الجامعة.",
  "الكشف الطبي للطلاب الجدد عادة بيكون في شهر 9، تابع إعلانات الكلية عشان تعرف الميعاد بالظبط.",
  "شروط القبول في الدراسات العليا بتختلف حسب القسم، لازم تراجع قسم الدراسات العليا في الكلية عشان تعرف التفاصيل."
];

const mockQaMap = {
  "تظلمات": "مواعيد تقديم التظلمات بتنزل على الصفحة الرسمية للكلية على فيسبوك بعد ظهور النتيجة.",
  "مصروفات": "المصروفات الدراسية للبرامج العادية حوالي 15 ألف جنيه في السنة، والبرامج الخاصة أغلى شوية.",
  "جدول": "تقدر تعرف جدول الامتحانات من على موقع الكلية أو من الأبلكيشن بتاع الجامعة.",
  "كشف طبي": "الكشف الطبي للطلاب الجدد عادة بيكون في شهر 9، تابع إعلانات الكلية عشان تعرف الميعاد بالظبط.",
  "دراسات عليا": "شروط القبول في الدراسات العليا بتختلف حسب القسم، لازم تراجع قسم الدراسات العليا في الكلية عشان تعرف التفاصيل."
};

const getMockAnswer = (question: string) => {
  const lowerCaseQuestion = question.toLowerCase();
  for (const key in mockQaMap) {
    if (lowerCaseQuestion.includes(key)) {
      return mockQaMap[key as keyof typeof mockQaMap];
    }
  }
  return "عفواً، لم أجد إجابة لسؤالك في قاعدة البيانات الوهمية. حاول طرح سؤال آخر.";
}

const mockAnswer = (text: string) => {
  return getMockAnswer(text);
}

const mockSources = () => {
  return [
    {
      content: 'هذا مصدر وهمي للإجابة على سؤالك.',
      metadata: {
        file_name: 'mock_source.pdf',
        page: 1
      },
      score: 0.95
    }
  ];
}

const mockDocuments = [
  {
    score: 0.98,
    metadata: {
      file_name: 'Postgraduate_Rules.pdf',
      page_number: 2,
      chunk_number: 5,
    },
    text: 'يشترط على المتقدم الا يقل تقديره التراكمي عن جيد جداً للالتحاق ببرنامج الماجستير...'
  },
  {
    score: 0.95,
    metadata: {
      file_name: 'Exam_Schedule_Spring24.pdf',
      page_number: 1,
      chunk_number: 1,
    },
    text: 'جدول امتحانات الفصل الدراسي الثاني لقسم علوم الحاسب...'
  },
  {
    score: 0.85,
    metadata: {
      file_name: 'Student_Affairs_Guide.pdf',
      page_number: 10,
      chunk_number: 1,
    },
    text: 'لتقديم طلب إيقاف قيد، يجب التوجه إلى شؤون الطلاب وتقديم الأوراق المطلوبة...'
  }
];

const mockSearchResults = (query: string) => [
  { score: 0.92, content: `A relevant document snippet about '${query}' showing high similarity.` },
  { score: 0.88, content: `Another piece of context that relates to '${query}'.` },
  { score: 0.85, content: `The third most relevant chunk of text found for the query '${query}'.` },
];

// Define API call functions
const pushIndex = async ({ projectId, doReset, useMockData }: { projectId: any; doReset: boolean; useMockData: boolean }): Promise<IndexPushResponse> => {
  if (useMockData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { signal: ResponseSignals.VECTORDB_INDEX_SUCCESS, inserted_items_count: Math.floor(Math.random() * 500) + 100 };
  }
  
  // Extract the project ID whether it's an object or a number
  let numericProjectId;
  
  if (typeof projectId === 'object' && projectId !== null && projectId.id) {
    numericProjectId = projectId.id;
    console.log('Project ID from object:', numericProjectId);
  } else {
    try {
      numericProjectId = parseInt(String(projectId), 10);
      console.log('Project ID from value:', numericProjectId);
    } catch (e) {
      console.error('Failed to parse project ID:', e);
      throw new Error('Invalid project ID format');
    }
  }
  
  // Make sure we have a valid number
  if (isNaN(numericProjectId)) {
    console.error('Invalid project ID:', projectId);
    throw new Error('Invalid project ID');
  }
  
  console.log('Final project ID for API call:', numericProjectId);
  
  const { data } = await apiClient.post<IndexPushResponse>(
    `/nlp/index/push/${numericProjectId}`, 
    { do_reset: doReset ? 1 : 0 }
  );
  
  // Map backend signal to frontend signal if needed
  if (data.signal === 'insert_into_vectordb_success') {
    data.signal = ResponseSignals.VECTORDB_INDEX_SUCCESS;
  } else if (data.signal === 'insert_into_vectordb_error') {
    data.signal = ResponseSignals.VECTORDB_INDEX_ERROR;
  }
  
  return data;
};

const searchIndex = async ({ projectId, text, limit, useMockData }: { projectId: string; text: string; limit?: number; useMockData: boolean }): Promise<SearchResponse> => {
  if (useMockData) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { signal: ResponseSignals.VECTORDB_SEARCH_SUCCESS, results: mockSearchResults(text) };
  }
  const { data } = await apiClient.post<SearchResponse>(`/nlp/index/search/${projectId}`, { text, limit });
  console.log('Search API response:', data);
  return data;
};

const answerQuestion = async ({ projectId, text, useMockData }: { projectId: string; text: string; useMockData: boolean }): Promise<AnswerResponse> => {
  if (useMockData) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { signal: ResponseSignals.RAG_ANSWER_SUCCESS, answer: mockAnswer(text), sources: mockSources() };
  }
  const { data } = await apiClient.post<AnswerResponse>(`/nlp/index/answer/${projectId}`, { text });
  return data;
};

const pushToIndex = async ({ projectId, useMockData }: { projectId: string; useMockData: boolean }): Promise<PushToIndexResponse> => {
  if (useMockData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { signal: ResponseSignals.VECTORDB_INDEX_SUCCESS, message: 'Successfully pushed project to index' };
  }
  const { data } = await apiClient.post<PushToIndexResponse>(`/nlp/index/push/${projectId}`);
  return data;
};

const resetIndex = async (projectId: string): Promise<ResetIndexResponse> => {
  try {
    console.log('Resetting index for project:', projectId);
    const { data } = await apiClient.post<ResetIndexResponse>(`/nlp/index/reset/${projectId}`);
    
    // Map backend signal to frontend signal if needed
    if (data.signal === 'index_reset_success') {
      data.signal = ResponseSignals.INDEX_RESET_SUCCESS;
    } else if (data.signal === 'index_reset_error') {
      data.signal = ResponseSignals.INDEX_RESET_ERROR;
    }
    
    console.log('Reset index response:', data);
    return data;
  } catch (error) {
    console.error('Error resetting index:', error);
    throw error;
  }
};

// Define hooks
export const usePushIndex = (useMockData = false) => {
  const queryClient = useQueryClient();
  return useMutation<IndexPushResponse, Error, { projectId: string | number; doReset: boolean }>({
    mutationFn: ({ projectId, doReset }) => pushIndex({ projectId: String(projectId), doReset, useMockData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indexInfo'] });
    },
  });
};

export const useSearch = (useMockData = false) => {
    return useMutation<SearchResponse, Error, { projectId: string | number; text: string; limit?: number }>({
        mutationFn: ({ projectId, text, limit }) => searchIndex({ projectId: String(projectId), text, limit, useMockData }),
    });
};

export const useAnswer = (useMockData = false) => {
    return useMutation<AnswerResponse, Error, { projectId: string | number; text: string; limit?: number }>({
        mutationFn: ({ projectId, text }) => answerQuestion({ projectId: String(projectId), text, useMockData }),
    });
};

export const usePushToIndex = (useMockData = false) => {
    return useMutation<PushToIndexResponse, Error, { projectId: string | number }>({
        mutationFn: ({ projectId }) => pushToIndex({ projectId: String(projectId), useMockData }),
    });
};

export const useResetIndex = () => {
    const queryClient = useQueryClient();
    return useMutation<ResetIndexResponse, Error, string>({
        mutationFn: resetIndex,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['indexInfo'] });
        },
    });
}; 