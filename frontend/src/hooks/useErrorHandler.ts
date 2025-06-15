import { toast } from 'sonner';
import { ResponseSignals } from '../constants/signals';

interface ErrorResponse {
  signal: string;
  message?: string;
}

export function useErrorHandler() {
  /**
   * Handles API response errors based on signal and shows appropriate toast
   */
  const handleApiError = (response: ErrorResponse, defaultMessage: string = 'An unknown error occurred') => {
    // Map error signals to user-friendly messages
    const errorMessages: Record<string, string> = {
      [ResponseSignals.RAG_ANSWER_ERROR]: 'Failed to generate answer. Please try again.',
      [ResponseSignals.VECTORDB_SEARCH_ERROR]: 'Search failed. Please try again.',
      [ResponseSignals.VECTORDB_INDEX_ERROR]: 'Failed to index documents. Please try again.',
      [ResponseSignals.INSERT_INTO_VECTORDB_ERROR]: 'Failed to index documents. Please try again.',
      [ResponseSignals.PROCESS_ERROR]: 'Failed to process documents. Please try again.',
      [ResponseSignals.INDEX_RESET_ERROR]: 'Failed to reset index. Please try again.',
      [ResponseSignals.ERROR]: 'An error occurred. Please try again.',
    };

    // Get the appropriate error message or use the response message or default
    const errorMessage = errorMessages[response.signal] || response.message || defaultMessage;
    
    // Show toast with error message
    toast.error(errorMessage);
    
    return errorMessage;
  };

  /**
   * Handles JS exceptions and shows appropriate toast
   */
  const handleException = (error: unknown, defaultMessage: string = 'An unexpected error occurred') => {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    toast.error(errorMessage);
    return errorMessage;
  };

  /**
   * Determines if a response is successful based on its signal
   */
  const isSuccessResponse = (response: { signal: string }) => {
    const successSignals = [
      ResponseSignals.SUCCESS,
      ResponseSignals.RAG_ANSWER_SUCCESS,
      ResponseSignals.VECTORDB_SEARCH_SUCCESS,
      ResponseSignals.VECTORDB_INDEX_SUCCESS,
      ResponseSignals.INSERT_INTO_VECTORDB_SUCCESS,
      ResponseSignals.INDEX_RESET_SUCCESS,
      ResponseSignals.PROCESS_SUCCESS
    ];
    
    return successSignals.includes(response.signal);
  };

  return {
    handleApiError,
    handleException,
    isSuccessResponse
  };
} 