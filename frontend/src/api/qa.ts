import apiClient from './client';

// Define the answer response type
export interface Answer {
  signal: string;
  answer: string;
  full_prompt: string;
  chat_history: any;
}

/**
 * Ask a question to the RAG system
 * @param projectId - The ID of the project to query
 * @param question - The question to ask
 * @param limit - The maximum number of context chunks to use
 * @returns The answer with sources
 */
export async function askQuestion(projectId: string, question: string, limit: number = 5): Promise<Answer> {
  try {
    const { data } = await apiClient.post(`/nlp/index/answer/${projectId}`, { 
      text: question,
      limit: limit
    });
    return data;
  } catch (error) {
    console.error('Error asking question:', error);
    throw new Error('Failed to get an answer. Please try again.');
  }
} 