from pydantic import BaseModel
from typing import List, Dict
 
class StatisticsResponse(BaseModel):
    total_documents: int
    total_queries: int
    document_types: Dict[str, int]
    recent_queries: List[str] 