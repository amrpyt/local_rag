export const ResponseSignals = {
  // Success signals
  RAG_ANSWER_SUCCESS: 'rag_answer_success',
  VECTORDB_SEARCH_SUCCESS: 'vectordb_search_success',
  VECTORDB_INDEX_SUCCESS: 'vectordb_index_success',
  PROCESS_SUCCESS: 'process_success',
  INSERT_INTO_VECTORDB_SUCCESS: 'insert_into_vectordb_success',
  INDEX_RESET_SUCCESS: 'index_reset_success',
  
  // Error signals
  RAG_ANSWER_ERROR: 'rag_answer_error',
  VECTORDB_SEARCH_ERROR: 'vectordb_search_error',
  VECTORDB_INDEX_ERROR: 'vectordb_index_error',
  PROCESS_ERROR: 'process_error',
  INSERT_INTO_VECTORDB_ERROR: 'insert_into_vectordb_error',
  INDEX_RESET_ERROR: 'index_reset_error',
  
  // General signals
  SUCCESS: 'success',
  ERROR: 'error'
}; 