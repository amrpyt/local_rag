from fastapi import APIRouter, Request, status, Depends
from routes.schemes.statistics import StatisticsResponse
from controllers.statistics import get_project_statistics_controller

statistics_router = APIRouter(prefix="/api/v1/statistics")

@statistics_router.get(
    "/{project_id}",
    tags=["Statistics"],
    status_code=status.HTTP_200_OK,
    response_model=StatisticsResponse,
)
async def get_project_statistics(request: Request, project_id: int):
    return await get_project_statistics_controller(request, project_id) 