from fastapi import FastAPI, APIRouter, status, Request, Body
from fastapi.responses import JSONResponse
from models.ProjectModel import ProjectModel
from models import ResponseSignal
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

projects_router = APIRouter(
    prefix="/api/projects",
    tags=["api", "projects"],
)

@projects_router.get("/")
async def get_all_projects(request: Request):
    """
    Get all project IDs. If no projects exist, create a default one.
    """
    project_model = await ProjectModel.create_instance(db_client=request.app.db_client)
    
    try:
        projects, _ = await project_model.get_all_projects(page=1, page_size=1000)

        if not projects:
            logger.info("No projects found. Creating a default project.")
            # Let's use a specific name and check if it exists before creating
            default_project_name = "default"
            project = await project_model.get_project_by_name(default_project_name)
            if not project:
                project = await project_model.add_project(name=default_project_name)
            projects = [project]
            
        project_ids = [project.project_id for project in projects]
        
        return JSONResponse(
            content={
                "signal": ResponseSignal.SUCCESS.value,
                "projects": project_ids
            }
        )
    except Exception as e:
        logger.error(f"Error getting all projects: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "signal": ResponseSignal.ERROR.value,
                "projects": [],
                "error": str(e)
            }
        )

@projects_router.post("/")
async def create_project(request: Request, payload: dict = Body(...)):
    """
    Create a new project.
    """
    project_name = payload.get("name")
    if not project_name:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"signal": ResponseSignal.ERROR.value, "detail": "Project name is required."}
        )

    project_model = await ProjectModel.create_instance(db_client=request.app.db_client)
    
    try:
        existing_project = await project_model.get_project_by_name(project_name)
        if existing_project:
            project_id = existing_project.project_id
            signal = "Project already exists."
        else:
            new_project = await project_model.add_project(name=project_name)
            project_id = new_project.project_id
            signal = ResponseSignal.SUCCESS.value

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "signal": signal,
                "project": {
                    "id": project_id,
                    "name": project_name
                }
            }
        )
    except Exception as e:
        logger.error(f"Error creating project: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "signal": ResponseSignal.ERROR.value,
                "error": str(e)
            }
        ) 