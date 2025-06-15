from fastapi import Request
from models.ProjectModel import ProjectModel
from models.ChunkModel import ChunkModel
from controllers import NLPController
from tqdm.auto import tqdm

async def get_project_index_info_controller(request: Request, project_id: int):
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    project = await project_model.get_project_or_create_one(
        project_id=project_id,
        project_name=f"Project {project_id}"
    )

    nlp_controller = NLPController(
        vectordb_client=request.app.vectordb_client,
        generation_client=request.app.generation_client,
        embedding_client=request.app.embedding_client,
        template_parser=request.app.template_parser,
    )

    collection_info = await nlp_controller.get_vector_db_collection_info(project=project)

    return {
        "signal": "vectordb_collection_retrieved",
        "collection_info": collection_info
    }

async def push_project_index_controller(request: Request, project_id: int, do_reset: bool):
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    chunk_model = await ChunkModel.create_instance(
        db_client=request.app.db_client
    )

    project = await project_model.get_project_or_create_one(
        project_id=project_id,
        project_name=f"Project {project_id}"
    )

    if not project:
        return {
            "signal": "project_not_found_error"
        }
    
    nlp_controller = NLPController(
        vectordb_client=request.app.vectordb_client,
        generation_client=request.app.generation_client,
        embedding_client=request.app.embedding_client,
        template_parser=request.app.template_parser,
    )

    has_records = True
    page_no = 1
    inserted_items_count = 0
    idx = 0

    collection_name = nlp_controller.create_collection_name(project_id=project.project_id)

    await request.app.vectordb_client.create_collection(
        collection_name=collection_name,
        embedding_size=request.app.embedding_client.embedding_size,
        do_reset=do_reset,
    )

    total_chunks_count = await chunk_model.get_total_chunks_count(project_id=project.project_id)
    pbar = tqdm(total=total_chunks_count, desc="Vector Indexing", position=0)

    while has_records:
        page_chunks = await chunk_model.get_poject_chunks(project_id=project.project_id, page_no=page_no)
        if len(page_chunks):
            page_no += 1
        
        if not page_chunks or len(page_chunks) == 0:
            has_records = False
            break

        chunks_ids =  [ c.chunk_id for c in page_chunks ]
        idx += len(page_chunks)
        
        is_inserted = await nlp_controller.index_into_vector_db(
            project=project,
            chunks=page_chunks,
            chunks_ids=chunks_ids
        )

        if not is_inserted:
            return {
                "signal": "insert_into_vectordb_error"
            }

        pbar.update(len(page_chunks))
        inserted_items_count += len(page_chunks)
        
    return {
        "signal": "insert_into_vectordb_success",
        "inserted_items_count": inserted_items_count
    }

async def reset_project_index_controller(request: Request, project_id: int):
    # This is a placeholder implementation.
    # In a real application, you would delete the collection from your vector database.
    
    return {
        "signal": "index_reset_success",
    } 