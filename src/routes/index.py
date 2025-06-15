from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from routes.schemes.nlp import PushRequest
from controllers.index import (
    get_project_index_info_controller,
    push_project_index_controller,
    reset_project_index_controller,
)

index_router = APIRouter(
    prefix="/api/v1/nlp/index",
    tags=["api_v1", "nlp", "index"],
)

@index_router.post("/push/{project_id}")
async def index_project(request: Request, project_id: int, push_request: PushRequest):
    response = await push_project_index_controller(request, project_id, push_request.do_reset)
    if response["signal"] != "insert_into_vectordb_success":
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=response)
    return JSONResponse(content=response)


@index_router.get("/info/{project_id}")
async def get_project_index_info(request: Request, project_id: int):
    response = await get_project_index_info_controller(request, project_id)
    return JSONResponse(content=response)


@index_router.post("/reset/{project_id}")
async def reset_project_index(request: Request, project_id: int):
    response = await reset_project_index_controller(request, project_id)
    return JSONResponse(content=response) 