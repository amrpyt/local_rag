export const ResponseSignals = {
  // Success signals
  RAG_ANSWER_SUCCESS: 'rag_answer_success',
  VECTORDB_SEARCH_SUCCESS: 'vectordb_search_success',
  VECTORDB_INDEX_SUCCESS: 'vectordb_index_success',
  PROCESS_SUCCESS: 'process_success',
  
  // Error signals
  RAG_ANSWER_ERROR: 'rag_answer_error',
  VECTORDB_SEARCH_ERROR: 'vectordb_search_error',
  VECTORDB_INDEX_ERROR: 'vectordb_index_error',
  PROCESS_ERROR: 'process_error',
  
  // General signals
  SUCCESS: 'success',
  ERROR: 'error'
}; 