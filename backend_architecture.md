# Mini-RAG Backend Architecture

This document provides a detailed explanation of the backend system for the Mini-RAG application. It covers the database schema, the data processing pipeline, and the overall architecture.

## 1. Core Components & Database Schema

The backend is built around a relational database (PostgreSQL) that organizes data into three primary entities: Projects, Assets, and Chunks.

### a. `projects` Table

This is the highest-level entity. Every piece of data in the system belongs to a project.

-   `project_id` (Primary Key): A unique integer ID for the project.
-   `project_uuid`: A unique UUID for external referencing.
-   `name`: A user-defined name for the project (e.g., "Legal Documents").
-   `created_at`, `updated_at`: Timestamps for tracking project creation and modification.

### b. `assets` Table

An "asset" represents a single file uploaded by the user (e.g., a PDF, TXT, or DOCX file).

-   `asset_id` (Primary Key): A unique integer ID for the asset.
-   `asset_project_id` (Foreign Key): Links the asset to a specific project in the `projects` table.
-   `asset_name`: The original filename of the uploaded document.
-   `asset_type`: The file type (e.g., 'application/pdf').
-   `asset_size`: The size of the file in bytes.
-   `asset_config`: A JSONB field to store any specific configuration for this asset.

### c. `chunks` Table

A "chunk" is a small piece of text extracted from an asset. Breaking documents into chunks is a core step for effective semantic search.

-   `chunk_id` (Primary Key): A unique integer ID for the chunk.
-   `chunk_project_id` (Foreign Key): Links the chunk to its project.
-   `chunk_asset_id` (Foreign Key): Links the chunk back to its original source asset.
-   `chunk_text`: The actual text content of the chunk.
-   `chunk_order`: The sequential position of the chunk within the original document, used for reconstruction or context.
-   `chunk_metadata`: A JSONB field for storing extra information, like page number or headings.

### d. Vector Store (`collection_*` tables)

Tables like `collection_384_9` represent the vector store. This is not a standard relational table but a specialized table, likely managed by the `pgvector` extension in PostgreSQL.

-   **Purpose:** It stores the text from the `chunks` table as numerical vectors (embeddings).
-   **Functionality:** When a text chunk is "indexed," an AI model converts its semantic meaning into a vector. This table stores that vector and links it to the original `chunk_id`. This allows for very fast semantic similarity searches.

---

## 2. Data Processing Pipeline

The system follows a clear, multi-step pipeline to process data from raw files to a searchable knowledge base.

![Data Flow Diagram](https://i.imgur.com/example.png)  <!-- Placeholder for a real diagram -->

**Step 1: Project Creation**
-   **Action:** The user creates a new project in the UI.
-   **Backend:** A `POST` request is sent to `/api/v1/projects`. The backend creates a new row in the `projects` table and returns the new project's ID.

**Step 2: Asset Upload**
-   **Action:** The user uploads one or more files to a selected project.
-   **Backend:** A `POST` request containing the file is sent to `/api/v1/data/upload/{project_id}`. The backend saves the file and creates a corresponding record in the `assets` table, linking it to the project.

**Step 3: Document Processing (Chunking)**
-   **Action:** The user initiates the "Process" action for an uploaded asset.
-   **Backend:** A request is sent to `/api/v1/data/process/{project_id}`. The backend job does the following:
    1.  Retrieves the asset file.
    2.  Extracts the raw text from the document.
    3.  Splits the text into smaller, overlapping chunks.
    4.  For each chunk, it creates a new row in the `chunks` table, storing the text and its relationship to the original asset and project.

**Step 4: Indexing (Vectorization)**
-   **Action:** The user clicks "Push to Index".
-   **Backend:** A request to `/api/v1/nlp/index/push/{project_id}` triggers the indexing process.
    1.  The backend gathers all non-indexed chunks for the project.
    2.  It uses a pre-configured embedding model (e.g., from OpenAI, Cohere, or a local model) to convert each `chunk_text` into a numerical vector.
    3.  Each vector is stored in the corresponding vector `collection` table, linked to its `chunk_id`.

**Step 5: Retrieval and Generation (Search & Q&A)**
-   **Action (Search):** The user submits a query in the "Search" interface.
-   **Backend (`/api/v1/nlp/index/search/{project_id}`):**
    1.  The user's query text is converted into a vector using the same embedding model.
    2.  The backend queries the vector store to find the chunk vectors that are most similar to the query vector.
    3.  The text of these top-matching chunks is returned to the user as search results.
-   **Action (Q&A):** The user asks a question in the "Q&A" chat.
-   **Backend (`/api/v1/nlp/index/answer/{project_id}`):**
    1.  The system performs a semantic search (as described above) to retrieve the most relevant chunks of text (the "context").
    2.  This context is combined with the user's original question into a single prompt.
    3.  The prompt is sent to a powerful generative AI model (like GPT-4, Claude, Gemini).
    4.  The model generates a comprehensive answer based on the provided context, which is then streamed back to the user in the chat interface.

---

## 3. API Structure

The backend API is built with FastAPI and organized by functionality into different routers.

-   `/api/v1/base`: Handles basic health checks and root endpoint information.
-   `/api/v1/projects`: Manages the creation, retrieval, and modification of projects.
-   `/api/v1/data`: Handles file uploads (`/upload`) and the chunking process (`/process`).
-   `/api/v1/nlp`: Manages all Natural Language Processing tasks, including indexing (`/index`), semantic search (`/search`), and question-answering (`/answer`).
-   `/api/v1/statistics`: Provides statistical data about projects.

---

## 4. Key Technologies

-   **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **Vector Search:** [pgvector](https://github.com/pgvector/pgvector) (PostgreSQL extension)
-   **Database ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) (specifically, its async capabilities)
-   **Database Migrations:** [Alembic](https://alembic.sqlalchemy.org/)
-   **LLM/Embedding Integration:** Abstracted via a factory pattern (`LLMProviderFactory`) to support various providers like OpenAI, Cohere, etc. 