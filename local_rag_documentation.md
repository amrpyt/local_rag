# Local RAG: A Retrieval-Augmented Generation System
## Comprehensive Graduation Project Documentation

---

# Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technologies Used](#technologies-used)
5. [Installation Guide](#installation-guide)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Database Design](#database-design)
9. [API Documentation](#api-documentation)
10. [Vector Databases](#vector-databases)
11. [Large Language Models Integration](#large-language-models-integration)
12. [Document Processing Pipeline](#document-processing-pipeline)
13. [Testing and Evaluation](#testing-and-evaluation)
14. [Deployment Guide](#deployment-guide)
15. [User Guide](#user-guide)
16. [Future Enhancements](#future-enhancements)
17. [Conclusion](#conclusion)
18. [References](#references)
19. [Appendices](#appendices)

---

# Introduction

## Background

Retrieval-Augmented Generation (RAG) represents a significant advancement in natural language processing and information retrieval systems. Traditional language models, while powerful, often suffer from limitations such as outdated knowledge, hallucinations, and an inability to access specific domain knowledge. RAG addresses these limitations by combining the generative capabilities of large language models (LLMs) with the precision of information retrieval systems.

The core concept behind RAG is straightforward yet powerful: when a user asks a question, the system first retrieves relevant information from a knowledge base and then uses this information to generate a more accurate, contextually relevant response. This approach grounds the language model's output in factual information, significantly reducing hallucinations and improving response accuracy.

## Problem Statement

Organizations and individuals today face several challenges when working with large volumes of documents:

1. **Information Overload**: The sheer volume of documents makes it difficult to locate specific information quickly.
2. **Knowledge Accessibility**: Valuable insights remain locked in documents that are difficult to search through effectively.
3. **Context Preservation**: Traditional search systems often return isolated snippets without preserving the broader context.
4. **Accuracy Concerns**: Generic AI systems may generate plausible-sounding but factually incorrect responses.
5. **Domain Specificity**: Generic models lack specialized knowledge relevant to specific domains or organizations.

## Project Objectives

The Local RAG project aims to address these challenges by creating a system that:

1. Allows users to upload and process documents into searchable chunks
2. Indexes these chunks into a vector database for semantic search capabilities
3. Provides a user-friendly interface for querying the knowledge base
4. Generates accurate, contextually relevant responses based on the retrieved information
5. Operates locally or within a controlled environment for data privacy
6. Supports multiple document formats and languages
7. Provides transparency by showing users the source of information used in responses

## Significance

This project has significant implications for various domains:

- **Education**: Enabling students and researchers to quickly extract relevant information from academic papers and textbooks
- **Business**: Allowing organizations to unlock insights from internal documentation and reports
- **Research**: Supporting researchers in synthesizing information across multiple sources
- **Knowledge Management**: Improving how organizations store, retrieve, and utilize their institutional knowledge

By implementing a local RAG system, this project provides a practical solution to the growing need for intelligent document processing and question-answering systems that can operate on domain-specific knowledge bases.

---

# Project Overview

## What is Local RAG?

Local RAG is a minimal yet powerful implementation of the Retrieval-Augmented Generation model for question answering. The system allows users to:

1. Upload documents (currently supporting PDF and text formats)
2. Process these documents into smaller, semantically meaningful chunks
3. Index these chunks into a vector database
4. Perform semantic searches across the indexed content
5. Generate contextually relevant answers to questions using the retrieved information

The "local" aspect of the project emphasizes that the system can be deployed and run entirely within a user's environment, ensuring data privacy and control.

## Key Features

- **Document Processing Pipeline**: Automated processing of uploaded documents into searchable chunks
- **Vector Indexing**: Conversion of text chunks into vector embeddings for semantic search
- **Semantic Search**: Finding information based on meaning rather than keyword matching
- **Answer Generation**: Using retrieved context to generate accurate, relevant answers
- **User-Friendly Interface**: A clean, intuitive web interface for interacting with the system
- **API-First Design**: A comprehensive API that enables integration with other systems
- **Modular Architecture**: Support for different LLM providers (OpenAI, Cohere, Google) and vector databases (PGVector, Qdrant)
- **Local Deployment**: Ability to run the entire system locally using Docker

## Use Cases

The Local RAG system is designed to support a variety of use cases:

1. **Document Q&A**: Ask questions about specific documents or collections of documents
2. **Knowledge Base Creation**: Transform unstructured documents into a structured, queryable knowledge base
3. **Research Assistant**: Help researchers find and synthesize information across multiple sources
4. **Internal Documentation Search**: Improve accessibility of organizational knowledge
5. **Educational Tool**: Support learning by providing contextual information retrieval

---

# System Architecture

## High-Level Architecture

The Local RAG system follows a modern, modular architecture consisting of several key components:

1. **Backend API Server**: A FastAPI-based server that handles all core functionality
2. **Frontend Application**: A React-based user interface for interacting with the system
3. **Vector Database**: Storage for vector embeddings (PGVector or Qdrant)
4. **LLM Services**: Integration with language model providers for embeddings and text generation
5. **Document Processing Pipeline**: Services for handling document upload, processing, and chunking

The system architecture is designed to be modular, allowing components to be replaced or upgraded independently.

## Component Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  FastAPI Server │────▶│ Document        │
│  (React)        │     │                 │     │ Processing      │
│                 │◀────│                 │     │                 │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │  LLM Services   │     │  Vector         │
                        │  (Embeddings &  │     │  Database       │
                        │   Generation)   │     │                 │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
```

## Data Flow

1. **Document Upload**: User uploads documents through the UI
2. **Document Processing**: Documents are processed into chunks
3. **Embedding Generation**: Text chunks are converted to vector embeddings
4. **Vector Indexing**: Embeddings are stored in the vector database
5. **Query Processing**: User queries are converted to embeddings and used to search the vector database
6. **Context Retrieval**: Relevant chunks are retrieved based on semantic similarity
7. **Answer Generation**: Retrieved context is used to generate a response using an LLM
8. **Response Delivery**: The generated answer is returned to the user

## Factory Pattern Implementation

The system uses the Factory Pattern to abstract the creation of LLM and Vector Database providers:

1. **LLMProviderFactory**: Creates instances of different LLM providers (OpenAI, Cohere, Google)
2. **VectorDBProviderFactory**: Creates instances of different vector database providers (PGVector, Qdrant)

This design allows for easy switching between different providers without changing the core application logic.

---

# Technologies Used

## Backend Technologies

- **Python**: Primary programming language for the backend
- **FastAPI**: Web framework for building APIs
- **SQLAlchemy**: ORM for database interactions
- **Alembic**: Database migration tool
- **Pydantic**: Data validation and settings management
- **PyPDF2/pdf2text**: PDF processing libraries
- **Langchain**: Framework for working with LLMs

## Frontend Technologies

- **JavaScript/React**: Frontend framework
- **Material-UI**: Component library for UI elements
- **Axios**: HTTP client for API requests
- **Vite**: Build tool and development server

## Database Technologies

- **PostgreSQL**: Relational database for storing metadata
- **pgvector**: PostgreSQL extension for vector operations
- **Qdrant**: Vector database (alternative option)

## AI/ML Technologies

- **OpenAI API**: For text generation and embeddings
- **Cohere API**: Alternative for embeddings
- **Google API**: Alternative for text generation
- **Ollama**: For local LLM deployment

## DevOps & Infrastructure

- **Docker**: Containerization
- **Docker Compose**: Multi-container Docker applications

---

# Installation Guide

## Prerequisites

- Python 3.10
- Node.js and npm
- Docker and Docker Compose
- PostgreSQL with pgvector extension

## System Requirements

- Minimum 4GB RAM (8GB+ recommended)
- 10GB+ free disk space
- Internet connection (for API-based LLMs)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/00JIMMY00/local_rag.git
cd local_rag
```

### 2. Backend Setup

Install the required dependencies:

```bash
cd src
pip install -r requirements.txt
```

Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file to configure your API keys and other settings.

Run database migrations:

```bash
alembic upgrade head
```

### 3. Docker Services Setup

Set up the Docker environment:

```bash
cd docker
cp .env.example .env
```

Edit the Docker `.env` file with your credentials.

Start the Docker services:

```bash
docker compose up -d
```

### 4. Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

### 5. Running the Application

Start the backend server:

```bash
cd src
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173` (or the port shown in your terminal).

## Using Local LLMs (Optional)

For those who prefer to run LLMs locally rather than using API services:

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Pull a compatible model: `ollama pull mistral:7b`
3. Update your `.env` file to use Ollama as the provider

---

# Backend Implementation

## Project Structure

The backend of the Local RAG system follows a well-organized structure:

```
src/
├── assets/             # Static assets and uploaded files
├── controllers/        # Business logic controllers
├── helpers/            # Utility functions and helpers
├── models/             # Database models and schemas
│   ├── db_schemes/     # SQLAlchemy models
│   └── enums/          # Enumeration classes
├── routes/             # API route definitions
│   └── schemes/        # Pydantic schemas for API requests/responses
├── stores/             # External service integrations
│   ├── llm/            # LLM provider implementations
│   │   └── templates/  # Prompt templates
│   └── vectordb/       # Vector database implementations
├── .env                # Environment variables
├── main.py             # Application entry point
└── requirements.txt    # Python dependencies
```

This structure follows a clean architecture approach, separating concerns and making the codebase maintainable and extensible.

## FastAPI Application

The main application is built using FastAPI, a modern, fast web framework for building APIs with Python. The entry point is defined in `main.py`:

```python
from fastapi import FastAPI
from routes import base, data, nlp, projects
from helpers.config import get_settings
from stores.llm.LLMProviderFactory import LLMProviderFactory
from stores.vectordb.VectorDBProviderFactory import VectorDBProviderFactory
from stores.llm.templates.template_parser import TemplateParser
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

app = FastAPI()

async def startup_span():
    settings = get_settings()

    postgres_conn = f"postgresql+asyncpg://{settings.POSTGRES_USERNAME}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_MAIN_DATABASE}"

    app.db_engine = create_async_engine(postgres_conn)
    app.db_client = sessionmaker(
        app.db_engine, class_=AsyncSession, expire_on_commit=False
    )

    llm_provider_factory = LLMProviderFactory(settings)
    vectordb_provider_factory = VectorDBProviderFactory(config=settings, db_client=app.db_client)

    # generation client
    app.generation_client = llm_provider_factory.create(provider=settings.GENERATION_BACKEND)
    app.generation_client.set_generation_model(model_id = settings.GENERATION_MODEL_ID)

    # embedding client
    app.embedding_client = llm_provider_factory.create(provider=settings.EMBEDDING_BACKEND)
    app.embedding_client.set_embedding_model(model_id=settings.EMBEDDING_MODEL_ID,
                                             embedding_size=settings.EMBEDDING_MODEL_SIZE)
    
    # vector db client
    app.vectordb_client = vectordb_provider_factory.create(
        provider=settings.VECTOR_DB_BACKEND
    )
    await app.vectordb_client.connect()

    app.template_parser = TemplateParser(
        language=settings.PRIMARY_LANG,
        default_language=settings.DEFAULT_LANG,
    )


async def shutdown_span():
    app.db_engine.dispose()
    await app.vectordb_client.disconnect()

app.on_event("startup")(startup_span)
app.on_event("shutdown")(shutdown_span)

app.include_router(base.base_router)
app.include_router(data.data_router)
app.include_router(nlp.nlp_router)
app.include_router(projects.projects_router)
```

The application initializes several components during startup:

1. **Database Connection**: Establishes a connection to PostgreSQL using SQLAlchemy's async engine
2. **LLM Providers**: Initializes the generation and embedding clients using the factory pattern
3. **Vector Database**: Sets up the vector database client
4. **Template Parser**: Initializes the template parser for prompt templates
5. **API Routes**: Registers the API routes from different modules

## API Routes

The application is organized into several route modules:

### Base Routes

```python
from fastapi import FastAPI, APIRouter, Depends
import os
from helpers.config import get_settings, Settings

base_router = APIRouter(
    prefix="/api/v1",
    tags=["api_v1"],
)

@base_router.get("/")
async def welcome(app_settings: Settings = Depends(get_settings)):
    app_name = app_settings.APP_NAME
    app_version = app_settings.APP_VERSION
    return {
        "app_name": app_name,
        "app_version": app_version,
    }
```

### Projects Routes

```python
from fastapi import FastAPI, APIRouter, status, Request
from fastapi.responses import JSONResponse
from models.ProjectModel import ProjectModel
from models import ResponseSignal

projects_router = APIRouter(
    prefix="/api/v1/projects",
    tags=["api_v1", "projects"],
)

@projects_router.get("/")
async def get_all_projects(request: Request):
    """
    Get all project IDs
    """
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    projects, _ = await project_model.get_all_projects(
        page=1,
        page_size=1000  # Assuming we won't have thousands of projects
    )

    project_ids = [project.project_id for project in projects]

    return JSONResponse(
        content={
            "signal": ResponseSignal.SUCCESS.value,
            "projects": project_ids
        }
    ) 
```

### Data Routes

The data routes handle document upload and processing:

```python
@data_router.post("/upload/{project_id}")
async def upload_data(request: Request, project_id: int, file: UploadFile,
                      app_settings: Settings = Depends(get_settings)):
    # Implementation for file upload
    # ...

@data_router.post("/process/{project_id}")
async def process_endpoint(request: Request, project_id: int, process_request: ProcessRequest):
    # Implementation for document processing
    # ...
```

### NLP Routes

The NLP routes handle vector indexing, search, and question answering:

```python
@nlp_router.post("/index/push/{project_id}")
async def index_project(request: Request, project_id: int, push_request: PushRequest):
    # Implementation for vector indexing
    # ...

@nlp_router.get("/index/info/{project_id}")
async def get_project_index_info(request: Request, project_id: int):
    # Implementation for getting index information
    # ...

@nlp_router.post("/index/search/{project_id}")
async def search_index(request: Request, project_id: int, search_request: SearchRequest):
    # Implementation for semantic search
    # ...

@nlp_router.post("/index/answer/{project_id}")
async def answer_rag(request: Request, project_id: int, search_request: SearchRequest):
    # Implementation for RAG-based question answering
    # ...
```

## Controllers

Controllers contain the business logic of the application, separated from the route handlers. Key controllers include:

1. **DataController**: Handles file validation and storage
2. **ProcessController**: Manages document processing and chunking
3. **NLPController**: Coordinates vector indexing, search, and answer generation
4. **ProjectController**: Manages project-related operations

## Models

The application uses SQLAlchemy for database interactions and Pydantic for data validation:

1. **SQLAlchemy Models**: Define the database schema
2. **Pydantic Schemas**: Define the API request/response schemas
3. **Model Classes**: Provide an abstraction layer for database operations

---

# Frontend Implementation

## Project Structure

The frontend of the Local RAG system is built using React and follows a modern structure:

```
frontend/
├── src/
│   ├── api/            # API service layer
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components for each tab
│   ├── App.jsx         # Main application component
│   └── index.jsx       # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Main Application Component

The main application component (`App.jsx`) defines the overall layout and navigation structure:

```jsx
import React, { useState } from 'react';
import { Box, Tabs, Tab, AppBar, Toolbar, Typography, Switch, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WelcomeIcon from '@mui/icons-material/Info';
import UploadIcon from '@mui/icons-material/CloudUpload';
import ProcessIcon from '@mui/icons-material/Settings';
import IndexPushIcon from '@mui/icons-material/Send';
import IndexInfoIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AnswerIcon from '@mui/icons-material/QuestionAnswer';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

// Pages
import HomePage from './pages/HomePage';
import WelcomeEndpointPage from './pages/WelcomeEndpointPage';
import UploadDataPage from './pages/UploadDataPage';
import ProcessDataPage from './pages/ProcessDataPage';
import IndexPushPage from './pages/IndexPushPage';
import IndexInfoPage from './pages/IndexInfoPage';
import IndexSearchPage from './pages/IndexSearchPage';
import IndexAnswerPage from './pages/IndexAnswerPage';

const tabList = [
  { icon: <HomeIcon />, label: 'Home' },
  { icon: <WelcomeIcon />, label: 'Welcome' },
  { icon: <UploadIcon />, label: 'Upload' },
  { icon: <ProcessIcon />, label: 'Process' },
  { icon: <IndexPushIcon />, label: 'Index Push' },
  { icon: <IndexInfoIcon />, label: 'Index Info' },
  { icon: <SearchIcon />, label: 'Search' },
  { icon: <AnswerIcon />, label: 'Answer' },
];

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [mockMode, setMockMode] = useState(false);
  const [showTabNames, setShowTabNames] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMockModeChange = (event) => {
    setMockMode(event.target.checked);
  };

  const handleToggleTabNames = () => {
    setShowTabNames((prev) => !prev);
  };

  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return <HomePage mockMode={mockMode} />;
      case 1:
        return <WelcomeEndpointPage mockMode={mockMode} />;
      case 2:
        return <UploadDataPage mockMode={mockMode} />;
      case 3:
        return <ProcessDataPage mockMode={mockMode} />;
      case 4:
        return <IndexPushPage mockMode={mockMode} />;
      case 5:
        return <IndexInfoPage mockMode={mockMode} />;
      case 6:
        return <IndexSearchPage mockMode={mockMode} />;
      case 7:
        return <IndexAnswerPage mockMode={mockMode} />;
      default:
        return <HomePage mockMode={mockMode} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mini-RAG
          </Typography>
          <Tooltip title={showTabNames ? 'Hide Tab Names' : 'Show Tab Names'}>
            <IconButton color="inherit" onClick={handleToggleTabNames}>
              <MenuOpenIcon />
            </IconButton>
          </Tooltip>
          <FormControlLabel
            control={
              <Switch
                checked={mockMode}
                onChange={handleMockModeChange}
                color="secondary"
              />
            }
            label="Mock Mode"
            sx={{ color: 'white', ml: 2 }}
          />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        {/* Content Area */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', height: '100%' }}>
          {renderTabContent()}
        </Box>
        {/* Vertical Tabs on right side */}
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderLeft: 1,
            borderColor: 'divider',
            width: showTabNames ? 180 : 80,
            background: '#f8f9fa',
            '& .MuiTab-root': {
              minWidth: showTabNames ? 180 : 80,
              minHeight: '80px',
              justifyContent: showTabNames ? 'flex-start' : 'center',
              pl: showTabNames ? 2 : 0,
              pr: showTabNames ? 2 : 0,
              transition: 'all 0.2s',
            },
          }}
        >
          {tabList.map((tab, idx) => (
            <Tab
              key={tab.label}
              icon={tab.icon}
              label={showTabNames ? tab.label : ''}
              aria-label={tab.label}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
```

The application uses a vertical tab layout with the following features:

1. **Tab Navigation**: Vertical tabs on the right side for navigation
2. **Mock Mode**: A toggle switch to enable mock mode for development/demo purposes
3. **Responsive Layout**: Adjustable tab width and responsive content area
4. **Material-UI Components**: Leveraging Material-UI for consistent styling

## Home Page Component

The Home Page component (`HomePage.jsx`) serves as the main interface for users:

```jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiService from '../api/apiService';

// Component implementation...
```

The Home Page includes:

1. **Project Selection**: A dropdown to select from available projects
2. **File Upload**: Interface for uploading documents
3. **Chat Interface**: A chat-like interface for asking questions and viewing responses
4. **Auto Flow**: Automatic processing of uploaded documents

## API Service

The API service (`apiService.js`) provides a clean interface for interacting with the backend:

```javascript
import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiService = {
  // Welcome endpoint
  getWelcome: async () => {
    return axios.get(`${API_BASE_URL}/`);
  },

  // Upload Data
  uploadFile: async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/data/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Process Data
  processData: async (projectId, options = {}) => {
    return axios.post(`${API_BASE_URL}/data/process/${projectId}`, options);
  },

  // Index Push
  pushToIndex: async (projectId, options = {}) => {
    return axios.post(`${API_BASE_URL}/nlp/index/push/${projectId}`, options);
  },

  // Index Info
  getIndexInfo: async (projectId) => {
    return axios.get(`${API_BASE_URL}/nlp/index/info/${projectId}`);
  },

  // Index Search
  searchIndex: async (projectId, text, limit = 5) => {
    return axios.post(`${API_BASE_URL}/nlp/index/search/${projectId}`, { text, limit });
  },

  // Index Answer (RAG)
  getAnswer: async (projectId, text, limit = 5) => {
    return axios.post(`${API_BASE_URL}/nlp/index/answer/${projectId}`, { text, limit });
  },

  // Get all project IDs
  getProjects: async () => {
    return axios.get(`${API_BASE_URL}/projects/`);
  },

  // Create a new project (not in PRD, but kept for future use)
  createProject: async (projectName) => {
    return axios.post(`${API_BASE_URL}/projects`, { name: projectName });
  }
};

export default apiService;
```

This service encapsulates all API calls, making it easy to maintain and update the frontend's interaction with the backend.

## Mock Mode

The frontend includes a "Mock Mode" feature that allows the application to function without a backend connection. This is useful for:

1. **Development**: Testing the UI without a running backend
2. **Demonstrations**: Showcasing the application's functionality without setup
3. **UI Testing**: Validating UI behavior with predictable responses

When Mock Mode is enabled, the application uses hardcoded responses instead of making actual API calls.

---

# Database Design

## Database Schema

The Local RAG system uses PostgreSQL with the pgvector extension for storing both metadata and vector embeddings. The main database tables include:

### Projects Table

Stores information about projects:

```sql
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Assets Table

Stores information about uploaded files:

```sql
CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    asset_project_id INTEGER REFERENCES projects(project_id),
    asset_type VARCHAR(50) NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    asset_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Chunks Table

Stores document chunks:

```sql
CREATE TABLE chunks (
    chunk_id SERIAL PRIMARY KEY,
    chunk_project_id INTEGER REFERENCES projects(project_id),
    chunk_asset_id INTEGER REFERENCES assets(asset_id),
    chunk_content TEXT NOT NULL,
    chunk_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Vector Collections

Using pgvector, vector collections are created dynamically for each project:

```sql
CREATE TABLE project_{project_id}_vectors (
    id SERIAL PRIMARY KEY,
    chunk_id INTEGER REFERENCES chunks(chunk_id),
    embedding vector({embedding_size}),
    metadata JSONB
);

-- Create index for vector search
CREATE INDEX project_{project_id}_vectors_embedding_idx ON project_{project_id}_vectors 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## SQLAlchemy Models

The application uses SQLAlchemy ORM to interact with the database. Here are the key models:

### Project Model

```python
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

### Asset Model

```python
class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(Integer, primary_key=True, index=True)
    asset_project_id = Column(Integer, ForeignKey("projects.project_id"))
    asset_type = Column(String, nullable=False)
    asset_name = Column(String, nullable=False)
    asset_size = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

### Chunk Model

```python
class DataChunk(Base):
    __tablename__ = "chunks"

    chunk_id = Column(Integer, primary_key=True, index=True)
    chunk_project_id = Column(Integer, ForeignKey("projects.project_id"))
    chunk_asset_id = Column(Integer, ForeignKey("assets.asset_id"))
    chunk_content = Column(Text, nullable=False)
    chunk_metadata = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
```

## Database Migration

The project uses Alembic for database migrations, allowing for version-controlled schema changes:

```python
# alembic/versions/example_migration.py
"""create projects table

Revision ID: abc123def456
Revises: 
Create Date: 2023-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'abc123def456'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'projects',
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('project_name', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('project_id')
    )


def downgrade():
    op.drop_table('projects')
```

This approach ensures that database schema changes are tracked and can be applied consistently across different environments.

---

# API Documentation

## API Overview

The Local RAG system exposes a comprehensive REST API that follows RESTful principles. All endpoints are prefixed with `/api/v1/` and return JSON responses.

## Authentication

The current implementation does not include authentication. In a production environment, it would be advisable to implement authentication using JWT tokens, API keys, or OAuth2.

## Base Endpoints

### Welcome Endpoint

Returns basic information about the application.

- **URL**: `/api/v1/`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "app_name": "mini-RAG",
    "app_version": "0.1"
  }
  ```

## Project Endpoints

### List All Projects

Returns a list of all project IDs.

- **URL**: `/api/v1/projects/`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "signal": "success",
    "projects": [1, 2, 3]
  }
  ```

## Data Endpoints

### Upload Data

Upload a file to a specific project.

- **URL**: `/api/v1/data/upload/{project_id}`
- **Method**: `POST`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project to upload the file to.
  - `file` (form-data, file, required): The file to upload.
- **Response**:
  ```json
  {
    "signal": "file_upload_success",
    "file_id": "12345"
  }
  ```

### Process Data

Process uploaded files for a project, splitting them into chunks and storing them for later retrieval and search.

- **URL**: `/api/v1/data/process/{project_id}`
- **Method**: `POST`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project to process files for.
  - **Body (JSON)**:
    - `file_id` (str, optional): The ID of a specific file to process. If omitted, all files in the project are processed.
    - `chunk_size` (int, optional, default=100): The size of each text chunk.
    - `overlap_size` (int, optional, default=20): The overlap size between chunks.
    - `do_reset` (int, optional, default=0): If set to 1, resets (deletes) previous chunks and vector collections before processing.
- **Response**:
  ```json
  {
    "signal": "success",
    "inserted_chunks": 42,
    "processed_files": 1
  }
  ```

## NLP Endpoints

### Index Push

Indexes the processed chunks of a project into the vector database.

- **URL**: `/api/v1/nlp/index/push/{project_id}`
- **Method**: `POST`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project to index.
  - **Body (JSON)**:
    - `do_reset` (int, optional, default=0): If set to 1, resets the vector collection before indexing.
- **Response**:
  ```json
  {
    "signal": "insert_into_vectordb_success",
    "inserted_items_count": 42
  }
  ```

### Index Info

Retrieves information about the vector database collection for a project.

- **URL**: `/api/v1/nlp/index/info/{project_id}`
- **Method**: `GET`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project.
- **Response**:
  ```json
  {
    "signal": "vectordb_collection_retrieved",
    "collection_info": {
      "name": "project_1_vectors",
      "vector_count": 42,
      "vector_size": 384
    }
  }
  ```

### Index Search

Performs a semantic search over the indexed data for a project.

- **URL**: `/api/v1/nlp/index/search/{project_id}`
- **Method**: `POST`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project to search.
  - **Body (JSON)**:
    - `text` (str, required): The search query.
    - `limit` (int, optional, default=5): The maximum number of results to return.
- **Response**:
  ```json
  {
    "signal": "vectordb_search_success",
    "results": [
      {
        "chunk_id": 1,
        "chunk_content": "This is a sample chunk of text...",
        "score": 0.89,
        "metadata": { "source": "document1.pdf", "page": 1 }
      },
      // Additional results...
    ]
  }
  ```

### Index Answer (RAG)

Answers a question using Retrieval-Augmented Generation (RAG) over the indexed data for a project.

- **URL**: `/api/v1/nlp/index/answer/{project_id}`
- **Method**: `POST`
- **Parameters**:
  - `project_id` (path, int, required): The ID of the project to query.
  - **Body (JSON)**:
    - `text` (str, required): The question to answer.
    - `limit` (int, optional, default=5): The maximum number of context chunks to use.
- **Response**:
  ```json
  {
    "signal": "rag_answer_success",
    "answer": "This is the generated answer to the question...",
    "full_prompt": "The full prompt used for generation...",
    "chat_history": [
      {"role": "user", "content": "What is RAG?"},
      {"role": "assistant", "content": "RAG stands for Retrieval-Augmented Generation..."}
    ]
  }
  ```

## Error Handling

All endpoints follow a consistent error handling pattern:

- **HTTP Status Codes**: Appropriate HTTP status codes are used (200 for success, 400 for client errors, 500 for server errors)
- **Error Response Format**:
  ```json
  {
    "signal": "error_type",
    "detail": "Description of the error"
  }
  ```

## API Testing

The API can be tested using the provided Postman collection located at `/assets/mini-rag-app.postman_collection.json`. This collection includes pre-configured requests for all endpoints.

---

# Vector Databases

## Overview

Vector databases are specialized databases designed to store and efficiently query vector embeddings. In the Local RAG system, vector databases are used to store embeddings of document chunks, enabling semantic search capabilities.

## Supported Vector Databases

The Local RAG system supports two vector database options:

1. **PGVector**: PostgreSQL extension for vector operations
2. **Qdrant**: Standalone vector database

## PGVector Implementation

PGVector is implemented as a PostgreSQL extension that adds vector data types and vector similarity search capabilities to PostgreSQL.

### Connection Setup

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

postgres_conn = f"postgresql+asyncpg://{settings.POSTGRES_USERNAME}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_MAIN_DATABASE}"

db_engine = create_async_engine(postgres_conn)
db_client = sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
```

### Collection Creation

```python
async def create_collection(self, collection_name, embedding_size, do_reset=False):
    async with self.db_client() as session:
        if do_reset:
            await self._drop_collection(session, collection_name)
            
        # Check if collection exists
        result = await session.execute(text(f"""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = '{collection_name}'
            );
        """))
        exists = result.scalar()
        
        if not exists:
            # Create collection table with vector column
            await session.execute(text(f"""
                CREATE TABLE {collection_name} (
                    id SERIAL PRIMARY KEY,
                    chunk_id INTEGER NOT NULL,
                    embedding vector({embedding_size}),
                    metadata JSONB
                );
            """))
            
            # Create vector index
            await session.execute(text(f"""
                CREATE INDEX {collection_name}_embedding_idx 
                ON {collection_name} USING ivfflat (embedding vector_cosine_ops)
                WITH (lists = {self.index_threshold or 100});
            """))
            
            await session.commit()
```

### Vector Search

```python
async def search(self, collection_name, query_vector, limit=5):
    async with self.db_client() as session:
        # Convert query vector to PostgreSQL array format
        vector_str = str(query_vector).replace('[', '{').replace(']', '}')
        
        # Perform vector search using cosine similarity
        result = await session.execute(text(f"""
            SELECT chunk_id, metadata, 
                   1 - (embedding <=> '{vector_str}'::vector) as similarity
            FROM {collection_name}
            ORDER BY similarity DESC
            LIMIT {limit};
        """))
        
        return [
            {
                "chunk_id": row.chunk_id,
                "metadata": row.metadata,
                "score": float(row.similarity)
            }
            for row in result
        ]
```

## Qdrant Implementation

Qdrant is a vector similarity search engine that provides a production-ready service with a convenient API.

### Connection Setup

```python
from qdrant_client import QdrantClient
from qdrant_client.http import models

client = QdrantClient(path=self.db_client)
```

### Collection Creation

```python
def create_collection(self, collection_name, embedding_size, do_reset=False):
    if do_reset and self.client.collection_exists(collection_name):
        self.client.delete_collection(collection_name)
        
    if not self.client.collection_exists(collection_name):
        self.client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=embedding_size,
                distance=self.distance_method
            )
        )
```

### Vector Search

```python
def search(self, collection_name, query_vector, limit=5):
    search_result = self.client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=limit
    )
    
    return [
        {
            "chunk_id": hit.payload.get("chunk_id"),
            "metadata": hit.payload.get("metadata"),
            "score": hit.score
        }
        for hit in search_result
    ]
```

## Factory Pattern for Vector Databases

The system uses a factory pattern to abstract the creation of vector database providers:

```python
class VectorDBProviderFactory:
    def __init__(self, config, db_client=None):
        self.config = config
        self.base_controller = BaseController()
        self.db_client = db_client

    def create(self, provider: str):
        if provider == VectorDBEnums.QDRANT.value:
            qdrant_db_client = self.base_controller.get_database_path(db_name=self.config.VECTOR_DB_PATH)

            return QdrantDBProvider(
                db_client=qdrant_db_client,
                distance_method=self.config.VECTOR_DB_DISTANCE_METHOD,
                default_vector_size=self.config.EMBEDDING_MODEL_SIZE,
                index_threshold=self.config.VECTOR_DB_PGVEC_INDEX_THRESHOLD,
            )
        
        if provider == VectorDBEnums.PGVECTOR.value:
            return PGVectorProvider(
                db_client=self.db_client,
                distance_method=self.config.VECTOR_DB_DISTANCE_METHOD,
                default_vector_size=self.config.EMBEDDING_MODEL_SIZE,
                index_threshold=self.config.VECTOR_DB_PGVEC_INDEX_THRESHOLD,
            )
        
        return None
```

This approach allows the system to easily switch between different vector database providers without changing the core application logic.

---

# Large Language Models Integration

## Overview

Large Language Models (LLMs) are a critical component of the Local RAG system, providing two essential capabilities:

1. **Text Embedding**: Converting text chunks into vector representations
2. **Text Generation**: Generating answers based on retrieved context

The system is designed to work with multiple LLM providers, allowing users to choose the most appropriate option for their needs.

## Supported LLM Providers

The Local RAG system supports three LLM providers:

1. **OpenAI**: Industry-leading models like GPT-4 and text-embedding-ada-002
2. **Cohere**: Alternative provider with strong multilingual capabilities
3. **Google**: Google's language models via the Vertex AI API

## LLM Provider Factory

The system uses a factory pattern to abstract the creation of LLM providers:

```python
from .LLMEnums import LLMEnums
from .providers import OpenAIProvider, CoHereProvider, GoogleProvider

class LLMProviderFactory:
    def __init__(self, config: dict):
        self.config = config

    def create(self, provider: str):
        if provider == LLMEnums.OPENAI.value:
            return OpenAIProvider(
                api_key = self.config.OPENAI_API_KEY,
                api_url = self.config.OPENAI_API_URL,
                default_input_max_characters=self.config.INPUT_DAFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DAFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DAFAULT_TEMPERATURE
            )

        if provider == LLMEnums.COHERE.value:
            return CoHereProvider(
                api_key = self.config.COHERE_API_KEY,
                default_input_max_characters=self.config.INPUT_DAFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DAFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DAFAULT_TEMPERATURE
            )
        
        if provider == LLMEnums.GOOGLE.value:
            return GoogleProvider(
                api_key = self.config.GOOGLE_API_KEY,
                api_url = self.config.GOOGLE_API_URL,
                default_input_max_characters=self.config.INPUT_DAFAULT_MAX_CHARACTERS,
                default_generation_max_output_tokens=self.config.GENERATION_DAFAULT_MAX_TOKENS,
                default_generation_temperature=self.config.GENERATION_DAFAULT_TEMPERATURE
            )

        return None
```

This approach allows the system to easily switch between different LLM providers without changing the core application logic.

## OpenAI Provider Implementation

The OpenAI provider is implemented as follows:

```python
import openai
from typing import List, Dict, Any, Optional

class OpenAIProvider:
    def __init__(self, api_key, api_url=None, default_input_max_characters=1024, 
                 default_generation_max_output_tokens=200, default_generation_temperature=0.1):
        self.api_key = api_key
        self.api_url = api_url
        self.default_input_max_characters = default_input_max_characters
        self.default_generation_max_output_tokens = default_generation_max_output_tokens
        self.default_generation_temperature = default_generation_temperature
        
        # Initialize client
        openai.api_key = self.api_key
        if self.api_url:
            openai.api_base = self.api_url
            
        # Model settings
        self.embedding_model = None
        self.embedding_size = None
        self.generation_model = None
        
    def set_embedding_model(self, model_id="text-embedding-ada-002", embedding_size=1536):
        self.embedding_model = model_id
        self.embedding_size = embedding_size
        
    def set_generation_model(self, model_id="gpt-3.5-turbo"):
        self.generation_model = model_id
        
    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.embedding_model:
            raise ValueError("Embedding model not set")
            
        response = await openai.Embedding.acreate(
            model=self.embedding_model,
            input=texts
        )
        
        return [item["embedding"] for item in response["data"]]
        
    async def generate_text(self, prompt: str, max_tokens=None, temperature=None) -> str:
        if not self.generation_model:
            raise ValueError("Generation model not set")
            
        max_tokens = max_tokens or self.default_generation_max_output_tokens
        temperature = temperature or self.default_generation_temperature
        
        response = await openai.ChatCompletion.acreate(
            model=self.generation_model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response["choices"][0]["message"]["content"]
```

## Cohere Provider Implementation

The Cohere provider offers an alternative to OpenAI, with particularly strong multilingual embedding capabilities:

```python
import cohere
from typing import List, Dict, Any, Optional

class CoHereProvider:
    def __init__(self, api_key, default_input_max_characters=1024, 
                 default_generation_max_output_tokens=200, default_generation_temperature=0.1):
        self.api_key = api_key
        self.default_input_max_characters = default_input_max_characters
        self.default_generation_max_output_tokens = default_generation_max_output_tokens
        self.default_generation_temperature = default_generation_temperature
        
        # Initialize client
        self.client = cohere.Client(api_key=self.api_key)
            
        # Model settings
        self.embedding_model = None
        self.embedding_size = None
        self.generation_model = None
        
    def set_embedding_model(self, model_id="embed-multilingual-v2.0", embedding_size=768):
        self.embedding_model = model_id
        self.embedding_size = embedding_size
        
    def set_generation_model(self, model_id="command"):
        self.generation_model = model_id
        
    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.embedding_model:
            raise ValueError("Embedding model not set")
            
        response = self.client.embed(
            texts=texts,
            model=self.embedding_model
        )
        
        return response.embeddings
        
    async def generate_text(self, prompt: str, max_tokens=None, temperature=None) -> str:
        if not self.generation_model:
            raise ValueError("Generation model not set")
            
        max_tokens = max_tokens or self.default_generation_max_output_tokens
        temperature = temperature or self.default_generation_temperature
        
        response = self.client.generate(
            prompt=prompt,
            model=self.generation_model,
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return response.generations[0].text
```

## Prompt Templates

The system uses prompt templates to structure the input for LLM generation. Templates are defined in multiple languages and loaded based on user preferences:

```python
class TemplateParser:
    def __init__(self, language="en", default_language="en"):
        self.language = language
        self.default_language = default_language
        self.templates = self._load_templates()
        
    def _load_templates(self):
        templates = {}
        
        # Load templates for each language
        templates["en"] = {
            "rag_prompt": """
            Answer the question based only on the following context:
            
            {context}
            
            Question: {query}
            
            Answer:
            """
        }
        
        templates["ar"] = {
            "rag_prompt": """
            أجب على السؤال استنادًا فقط إلى السياق التالي:
            
            {context}
            
            السؤال: {query}
            
            الإجابة:
            """
        }
        
        return templates
        
    def get_template(self, template_name):
        if self.language in self.templates and template_name in self.templates[self.language]:
            return self.templates[self.language][template_name]
        
        # Fallback to default language
        if template_name in self.templates[self.default_language]:
            return self.templates[self.default_language][template_name]
            
        raise ValueError(f"Template {template_name} not found")
        
    def format_template(self, template_name, **kwargs):
        template = self.get_template(template_name)
        return template.format(**kwargs)
```

## RAG Implementation

The core RAG functionality is implemented in the NLPController:

```python
async def answer_rag_question(self, project, query, limit=5):
    # 1. Search for relevant chunks
    search_results = await self.search_vector_db_collection(
        project=project,
        text=query,
        limit=limit
    )
    
    if not search_results:
        return None, None, None
    
    # 2. Format context from search results
    context = "\n\n".join([
        f"[Document {i+1}]: {result.chunk_content}"
        for i, result in enumerate(search_results)
    ])
    
    # 3. Create prompt using template
    prompt = self.template_parser.format_template(
        "rag_prompt",
        context=context,
        query=query
    )
    
    # 4. Generate answer using LLM
    answer = await self.generation_client.generate_text(prompt=prompt)
    
    # 5. Update chat history
    chat_history = [
        {"role": "user", "content": query},
        {"role": "assistant", "content": answer}
    ]
    
    return answer, prompt, chat_history
```

This implementation follows the standard RAG pattern:
1. Retrieve relevant chunks using vector search
2. Format the retrieved chunks as context
3. Create a prompt that includes both the context and the user's question
4. Generate an answer using an LLM
5. Return the answer, prompt, and updated chat history

---

# Document Processing Pipeline

## Overview

The document processing pipeline is responsible for:

1. Accepting uploaded documents
2. Extracting text from various file formats
3. Chunking text into manageable segments
4. Storing chunks for later retrieval
5. Generating and indexing vector embeddings

## File Upload

The file upload process is handled by the `upload_data` endpoint in the data router:

```python
@data_router.post("/upload/{project_id}")
async def upload_data(request: Request, project_id: int, file: UploadFile,
                      app_settings: Settings = Depends(get_settings)):
    
    project_model = await ProjectModel.create_instance(
        db_client=request.app.db_client
    )

    project = await project_model.get_project_or_create_one(
        project_id=project_id
    )

    # validate the file properties
    data_controller = DataController()

    is_valid, result_signal = data_controller.validate_uploaded_file(file=file)

    if not is_valid:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal": result_signal
            }
        )

    project_dir_path = ProjectController().get_project_path(project_id=project_id)
    file_path, file_id = data_controller.generate_unique_filepath(
        orig_file_name=file.filename,
        project_id=project_id
    )

    try:
        async with aiofiles.open(file_path, "wb") as f:
            while chunk := await file.read(app_settings.FILE_DEFAULT_CHUNK_SIZE):
                await f.write(chunk)
    except Exception as e:
        logger.error(f"Error while uploading file: {e}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "signal": ResponseSignal.FILE_UPLOAD_FAILED.value
            }
        )

    # store the assets into the database
    asset_model = await AssetModel.create_instance(
        db_client=request.app.db_client
    )

    asset_resource = Asset(
        asset_project_id=project.project_id,
        asset_type=AssetTypeEnum.FILE.value,
        asset_name=file_id,
        asset_size=os.path.getsize(file_path)
    )

    asset_record = await asset_model.create_asset(asset=asset_resource)

    return JSONResponse(
            content={
                "signal": ResponseSignal.FILE_UPLOAD_SUCCESS.value,
                "file_id": str(asset_record.asset_id),
            }
        )
```

This endpoint:
1. Validates the uploaded file
2. Generates a unique file path
3. Writes the file to disk
4. Creates an asset record in the database

## File Validation

The `DataController` handles file validation:

```python
def validate_uploaded_file(self, file: UploadFile) -> Tuple[bool, str]:
    # Check file size
    if file.size > self.max_file_size_mb * 1024 * 1024:
        return False, ResponseSignal.FILE_SIZE_ERROR.value
    
    # Check file type
    content_type = file.content_type
    if content_type not in self.allowed_file_types:
        return False, ResponseSignal.FILE_TYPE_ERROR.value
    
    return True, ResponseSignal.SUCCESS.value
```

## Text Extraction

The `ProcessController` is responsible for extracting text from different file formats:

```python
def get_file_content(self, file_id: str) -> Optional[str]:
    file_path = self.base_controller.get_file_path(
        project_id=self.project_id,
        file_id=file_id
    )
    
    if not os.path.exists(file_path):
        return None
    
    file_extension = os.path.splitext(file_path)[1].lower()
    
    if file_extension == ".pdf":
        return self._extract_text_from_pdf(file_path)
    elif file_extension == ".txt":
        return self._extract_text_from_txt(file_path)
    else:
        return None
    
def _extract_text_from_pdf(self, file_path: str) -> str:
    text = ""
    with open(file_path, "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        for page_num in range(len(pdf_reader.pages)):
            text += pdf_reader.pages[page_num].extract_text() + "\n\n"
    return text

def _extract_text_from_txt(self, file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()
```

## Text Chunking

The `ProcessController` also handles text chunking:

```python
def process_file_content(self, file_content: str, file_id: str, 
                         chunk_size: int = 100, overlap_size: int = 20) -> List[Dict]:
    if not file_content:
        return []
    
    # Split text into sentences
    sentences = self._split_into_sentences(file_content)
    
    # Group sentences into chunks
    chunks = []
    current_chunk = []
    current_chunk_size = 0
    
    for sentence in sentences:
        sentence_size = len(sentence.split())
        
        if current_chunk_size + sentence_size > chunk_size and current_chunk:
            # Save current chunk
            chunk_text = " ".join(current_chunk)
            chunks.append({
                "content": chunk_text,
                "metadata": {
                    "file_id": file_id,
                    "chunk_size": current_chunk_size
                }
            })
            
            # Start new chunk with overlap
            overlap_tokens = []
            overlap_size_count = 0
            
            for s in reversed(current_chunk):
                s_size = len(s.split())
                if overlap_size_count + s_size <= overlap_size:
                    overlap_tokens.insert(0, s)
                    overlap_size_count += s_size
                else:
                    break
            
            current_chunk = overlap_tokens
            current_chunk_size = overlap_size_count
        
        current_chunk.append(sentence)
        current_chunk_size += sentence_size
    
    # Add the last chunk if it's not empty
    if current_chunk:
        chunk_text = " ".join(current_chunk)
        chunks.append({
            "content": chunk_text,
            "metadata": {
                "file_id": file_id,
                "chunk_size": current_chunk_size
            }
        })
    
    return chunks

def _split_into_sentences(self, text: str) -> List[str]:
    # Simple sentence splitting
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s for s in sentences if s.strip()]
```

This chunking algorithm:
1. Splits the text into sentences
2. Groups sentences into chunks of a specified size
3. Ensures overlap between chunks for context preservation
4. Includes metadata about the source file and chunk size

## Chunk Storage

Chunks are stored in the database using the `ChunkModel`:

```python
async def create_chunks(self, chunks: List[DataChunk]) -> List[DataChunk]:
    async with self.db_client() as session:
        session.add_all(chunks)
        await session.commit()
        
        # Refresh to get the generated IDs
        for chunk in chunks:
            await session.refresh(chunk)
            
        return chunks
```

## Embedding Generation and Indexing

The `NLPController` handles embedding generation and indexing:

```python
async def index_into_vector_db(self, project, chunks, chunks_ids):
    # Create collection name
    collection_name = self.create_collection_name(project_id=project.project_id)
    
    # Get embeddings for all chunks
    chunk_contents = [chunk.chunk_content for chunk in chunks]
    embeddings = await self.embedding_client.get_embeddings(texts=chunk_contents)
    
    # Create records for vector database
    records = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        metadata = {
            "chunk_id": chunks_ids[i],
            "project_id": chunk.chunk_project_id,
            "asset_id": chunk.chunk_asset_id
        }
        
        records.append({
            "id": chunks_ids[i],
            "vector": embedding,
            "metadata": metadata
        })
    
    # Insert records into vector database
    result = await self.vectordb_client.insert(
        collection_name=collection_name,
        records=records
    )
    
    return result
```

This process:
1. Generates embeddings for all chunks using the embedding client
2. Creates records with embeddings and metadata
3. Inserts the records into the vector database

The complete pipeline ensures that documents are processed efficiently and their content is made available for semantic search and question answering.

---

# Testing and Evaluation

## Testing Approach

The Local RAG system should be tested at multiple levels to ensure reliability and performance:

1. **Unit Testing**: Testing individual components in isolation
2. **Integration Testing**: Testing interactions between components
3. **System Testing**: Testing the entire system end-to-end
4. **Performance Testing**: Evaluating the system's performance under load

## Unit Testing

Unit tests focus on testing individual components in isolation. Key areas for unit testing include:

### Data Controllers

```python
import unittest
from controllers.DataController import DataController
from unittest.mock import MagicMock, patch

class TestDataController(unittest.TestCase):
    def setUp(self):
        self.data_controller = DataController()
    
    def test_validate_uploaded_file_valid(self):
        mock_file = MagicMock()
        mock_file.size = 1024 * 1024  # 1MB
        mock_file.content_type = "application/pdf"
        
        is_valid, signal = self.data_controller.validate_uploaded_file(mock_file)
        
        self.assertTrue(is_valid)
        self.assertEqual(signal, "success")
    
    def test_validate_uploaded_file_invalid_size(self):
        mock_file = MagicMock()
        mock_file.size = 20 * 1024 * 1024  # 20MB (assuming max is 10MB)
        mock_file.content_type = "application/pdf"
        
        is_valid, signal = self.data_controller.validate_uploaded_file(mock_file)
        
        self.assertFalse(is_valid)
        self.assertEqual(signal, "file_size_error")
    
    def test_validate_uploaded_file_invalid_type(self):
        mock_file = MagicMock()
        mock_file.size = 1024 * 1024  # 1MB
        mock_file.content_type = "application/exe"
        
        is_valid, signal = self.data_controller.validate_uploaded_file(mock_file)
        
        self.assertFalse(is_valid)
        self.assertEqual(signal, "file_type_error")
```

### Process Controllers

```python
class TestProcessController(unittest.TestCase):
    def setUp(self):
        self.process_controller = ProcessController(project_id=1)
    
    @patch('os.path.exists')
    def test_get_file_content_pdf(self, mock_exists):
        mock_exists.return_value = True
        
        with patch('builtins.open', mock_open(read_data=b'pdf content')):
            with patch('PyPDF2.PdfReader') as mock_pdf_reader:
                mock_page = MagicMock()
                mock_page.extract_text.return_value = "Extracted text"
                mock_pdf_reader.return_value.pages = [mock_page]
                
                result = self.process_controller.get_file_content("test.pdf")
                
                self.assertEqual(result, "Extracted text\n\n")
    
    def test_process_file_content(self):
        file_content = "This is a test sentence. This is another test sentence. And a third one."
        file_id = "test.txt"
        
        result = self.process_controller.process_file_content(
            file_content=file_content,
            file_id=file_id,
            chunk_size=10,
            overlap_size=2
        )
        
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["content"], file_content)
        self.assertEqual(result[0]["metadata"]["file_id"], file_id)
```

### NLP Controllers

```python
class TestNLPController(unittest.TestCase):
    def setUp(self):
        self.mock_vectordb_client = MagicMock()
        self.mock_generation_client = MagicMock()
        self.mock_embedding_client = MagicMock()
        self.mock_template_parser = MagicMock()
        
        self.nlp_controller = NLPController(
            vectordb_client=self.mock_vectordb_client,
            generation_client=self.mock_generation_client,
            embedding_client=self.mock_embedding_client,
            template_parser=self.mock_template_parser
        )
    
    @patch('controllers.NLPController.NLPController.create_collection_name')
    async def test_index_into_vector_db(self, mock_create_collection_name):
        mock_create_collection_name.return_value = "test_collection"
        
        mock_project = MagicMock()
        mock_project.project_id = 1
        
        mock_chunk1 = MagicMock()
        mock_chunk1.chunk_content = "Test content 1"
        mock_chunk1.chunk_project_id = 1
        mock_chunk1.chunk_asset_id = 1
        
        mock_chunk2 = MagicMock()
        mock_chunk2.chunk_content = "Test content 2"
        mock_chunk2.chunk_project_id = 1
        mock_chunk2.chunk_asset_id = 1
        
        chunks = [mock_chunk1, mock_chunk2]
        chunks_ids = [1, 2]
        
        self.mock_embedding_client.get_embeddings.return_value = [[0.1, 0.2], [0.3, 0.4]]
        self.mock_vectordb_client.insert.return_value = True
        
        result = await self.nlp_controller.index_into_vector_db(
            project=mock_project,
            chunks=chunks,
            chunks_ids=chunks_ids
        )
        
        self.assertTrue(result)
        self.mock_embedding_client.get_embeddings.assert_called_once_with(
            texts=["Test content 1", "Test content 2"]
        )
        self.mock_vectordb_client.insert.assert_called_once()
```

## Integration Testing

Integration tests focus on testing interactions between components:

```python
class TestDataProcessingIntegration(unittest.TestCase):
    async def setUp(self):
        # Set up test database
        self.db_engine = create_async_engine("sqlite+aiosqlite:///:memory:")
        self.db_client = sessionmaker(self.db_engine, class_=AsyncSession, expire_on_commit=False)
        
        # Create tables
        async with self.db_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        # Initialize controllers
        self.data_controller = DataController()
        self.process_controller = ProcessController(project_id=1)
        
        # Initialize models
        self.project_model = await ProjectModel.create_instance(db_client=self.db_client)
        self.asset_model = await AssetModel.create_instance(db_client=self.db_client)
        self.chunk_model = await ChunkModel.create_instance(db_client=self.db_client)
    
    async def test_upload_and_process_flow(self):
        # Create project
        project = await self.project_model.get_project_or_create_one(project_id=1)
        
        # Create asset
        asset = Asset(
            asset_project_id=1,
            asset_type=AssetTypeEnum.FILE.value,
            asset_name="test.txt",
            asset_size=100
        )
        asset_record = await self.asset_model.create_asset(asset=asset)
        
        # Mock file content retrieval
        with patch.object(
            self.process_controller, 
            'get_file_content', 
            return_value="This is test content."
        ):
            # Process file
            chunks_data = self.process_controller.process_file_content(
                file_content="This is test content.",
                file_id="test.txt",
                chunk_size=100,
                overlap_size=20
            )
            
            # Create chunks
            chunks = [
                DataChunk(
                    chunk_project_id=1,
                    chunk_asset_id=asset_record.asset_id,
                    chunk_content=chunk_data["content"],
                    chunk_metadata=chunk_data["metadata"]
                )
                for chunk_data in chunks_data
            ]
            
            created_chunks = await self.chunk_model.create_chunks(chunks=chunks)
            
            # Verify chunks were created
            self.assertEqual(len(created_chunks), 1)
            self.assertEqual(created_chunks[0].chunk_content, "This is test content.")
```

## System Testing

System tests evaluate the entire system end-to-end:

```python
class TestSystemEndToEnd(unittest.TestCase):
    def setUp(self):
        # Start test server
        self.app = TestClient(app)
    
    def test_rag_workflow(self):
        # 1. Create project
        response = self.app.get("/api/v1/projects/")
        self.assertEqual(response.status_code, 200)
        projects = response.json()["projects"]
        project_id = projects[0] if projects else 1
        
        # 2. Upload file
        test_file_path = os.path.join(os.path.dirname(__file__), "test_data/sample.pdf")
        with open(test_file_path, "rb") as f:
            response = self.app.post(
                f"/api/v1/data/upload/{project_id}",
                files={"file": ("sample.pdf", f, "application/pdf")}
            )
        
        self.assertEqual(response.status_code, 200)
        file_id = response.json()["file_id"]
        
        # 3. Process file
        response = self.app.post(
            f"/api/v1/data/process/{project_id}",
            json={
                "file_id": file_id,
                "chunk_size": 100,
                "overlap_size": 20,
                "do_reset": 1
            }
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("inserted_chunks", response.json())
        
        # 4. Index chunks
        response = self.app.post(
            f"/api/v1/nlp/index/push/{project_id}",
            json={"do_reset": 1}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("inserted_items_count", response.json())
        
        # 5. Search index
        response = self.app.post(
            f"/api/v1/nlp/index/search/{project_id}",
            json={"text": "test query", "limit": 5}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("results", response.json())
        
        # 6. Get answer
        response = self.app.post(
            f"/api/v1/nlp/index/answer/{project_id}",
            json={"text": "test question", "limit": 5}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertIn("answer", response.json())
```

## Performance Testing

Performance tests evaluate the system's behavior under load:

```python
class TestPerformance(unittest.TestCase):
    def setUp(self):
        # Start test server
        self.app = TestClient(app)
        self.project_id = 1
    
    def test_search_performance(self):
        # Prepare test data
        queries = ["query1", "query2", "query3", "query4", "query5"]
        
        # Measure search performance
        start_time = time.time()
        
        for query in queries:
            response = self.app.post(
                f"/api/v1/nlp/index/search/{self.project_id}",
                json={"text": query, "limit": 5}
            )
            
            self.assertEqual(response.status_code, 200)
        
        end_time = time.time()
        avg_time = (end_time - start_time) / len(queries)
        
        print(f"Average search time: {avg_time:.4f} seconds")
        self.assertLess(avg_time, 1.0)  # Search should be under 1 second
    
    def test_answer_performance(self):
        # Prepare test data
        questions = ["question1", "question2", "question3"]
        
        # Measure answer generation performance
        start_time = time.time()
        
        for question in questions:
            response = self.app.post(
                f"/api/v1/nlp/index/answer/{self.project_id}",
                json={"text": question, "limit": 5}
            )
            
            self.assertEqual(response.status_code, 200)
        
        end_time = time.time()
        avg_time = (end_time - start_time) / len(questions)
        
        print(f"Average answer generation time: {avg_time:.4f} seconds")
        self.assertLess(avg_time, 5.0)  # Answer generation should be under 5 seconds
```

## Evaluation Metrics

The RAG system can be evaluated using several metrics:

1. **Retrieval Precision**: The percentage of retrieved chunks that are relevant
2. **Retrieval Recall**: The percentage of relevant chunks that are retrieved
3. **Answer Accuracy**: The correctness of generated answers
4. **Answer Relevance**: The relevance of generated answers to the question
5. **Response Time**: The time taken to generate an answer

### Evaluation Script

```python
def evaluate_rag_system(test_questions, ground_truth_answers, project_id):
    correct_answers = 0
    total_questions = len(test_questions)
    
    retrieval_precision_sum = 0
    retrieval_recall_sum = 0
    answer_relevance_sum = 0
    response_time_sum = 0
    
    for i, (question, ground_truth) in enumerate(zip(test_questions, ground_truth_answers)):
        start_time = time.time()
        
        # Get answer from the system
        response = requests.post(
            f"http://localhost:5000/api/v1/nlp/index/answer/{project_id}",
            json={"text": question, "limit": 5}
        )
        
        end_time = time.time()
        response_time = end_time - start_time
        response_time_sum += response_time
        
        if response.status_code == 200:
            result = response.json()
            answer = result["answer"]
            
            # Evaluate answer accuracy
            if is_answer_correct(answer, ground_truth):
                correct_answers += 1
            
            # Evaluate retrieval precision and recall
            retrieved_chunks = get_retrieved_chunks(result)
            relevant_chunks = get_relevant_chunks(question)
            
            retrieval_precision = calculate_precision(retrieved_chunks, relevant_chunks)
            retrieval_recall = calculate_recall(retrieved_chunks, relevant_chunks)
            
            retrieval_precision_sum += retrieval_precision
            retrieval_recall_sum += retrieval_recall
            
            # Evaluate answer relevance
            answer_relevance = calculate_relevance(answer, question)
            answer_relevance_sum += answer_relevance
            
            print(f"Question {i+1}: {question}")
            print(f"Ground Truth: {ground_truth}")
            print(f"Generated Answer: {answer}")
            print(f"Precision: {retrieval_precision:.2f}, Recall: {retrieval_recall:.2f}")
            print(f"Answer Relevance: {answer_relevance:.2f}")
            print(f"Response Time: {response_time:.2f} seconds")
            print("-" * 50)
    
    # Calculate averages
    accuracy = correct_answers / total_questions
    avg_precision = retrieval_precision_sum / total_questions
    avg_recall = retrieval_recall_sum / total_questions
    avg_relevance = answer_relevance_sum / total_questions
    avg_response_time = response_time_sum / total_questions
    
    print("\nEvaluation Results:")
    print(f"Accuracy: {accuracy:.2f}")
    print(f"Average Precision: {avg_precision:.2f}")
    print(f"Average Recall: {avg_recall:.2f}")
    print(f"Average Answer Relevance: {avg_relevance:.2f}")
    print(f"Average Response Time: {avg_response_time:.2f} seconds")
    
    return {
        "accuracy": accuracy,
        "precision": avg_precision,
        "recall": avg_recall,
        "relevance": avg_relevance,
        "response_time": avg_response_time
    }
```

This comprehensive testing and evaluation approach ensures that the Local RAG system is reliable, accurate, and performant.

---

# Deployment Guide

## Deployment Options

The Local RAG system can be deployed in several ways:

1. **Local Development**: Running the system locally for development and testing
2. **Docker Deployment**: Running the system using Docker containers
3. **Cloud Deployment**: Deploying the system to a cloud provider

## Local Development

For local development, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/00JIMMY00/local_rag.git
   cd local_rag
   ```

2. **Set up the backend**:
   ```bash
   cd src
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

3. **Set up the database**:
   ```bash
   alembic upgrade head
   ```

4. **Start the backend server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 5000
   ```

5. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

7. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

## Docker Deployment

For Docker deployment, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/00JIMMY00/local_rag.git
   cd local_rag
   ```

2. **Set up environment variables**:
   ```bash
   cd docker
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start Docker services**:
   ```bash
   docker compose up -d
   ```

4. **Set up the backend**:
   ```bash
   cd ../src
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

5. **Build and run the backend Docker container**:
   ```bash
   docker build -t local-rag-backend .
   docker run -d --name local-rag-backend -p 5000:5000 --env-file .env local-rag-backend
   ```

6. **Build and run the frontend Docker container**:
   ```bash
   cd ../frontend
   docker build -t local-rag-frontend .
   docker run -d --name local-rag-frontend -p 80:80 local-rag-frontend
   ```

7. **Access the application**:
   Open your browser and navigate to `http://localhost`

## Cloud Deployment

For cloud deployment, you can use services like:

1. **AWS**:
   - Use Amazon ECS or EKS for container orchestration
   - Use RDS for PostgreSQL database
   - Use S3 for document storage
   - Use CloudFront for content delivery

2. **Google Cloud**:
   - Use Google Kubernetes Engine for container orchestration
   - Use Cloud SQL for PostgreSQL database
   - Use Cloud Storage for document storage
   - Use Cloud CDN for content delivery

3. **Azure**:
   - Use Azure Kubernetes Service for container orchestration
   - Use Azure Database for PostgreSQL
   - Use Azure Blob Storage for document storage
   - Use Azure CDN for content delivery

### Example AWS Deployment

1. **Create an RDS PostgreSQL instance**:
   - Install pgvector extension

2. **Create an S3 bucket for document storage**

3. **Create an ECS cluster**:
   - Define task definitions for backend and frontend
   - Create services for backend and frontend
   - Set up load balancers

4. **Configure environment variables**:
   - Update backend environment variables to use RDS and S3
   - Update frontend environment variables to use backend API endpoint

5. **Deploy the application**:
   - Push Docker images to ECR
   - Update ECS services to use the new images

6. **Set up CloudFront**:
   - Create a distribution for the frontend
   - Configure caching behavior

7. **Access the application**:
   Open your browser and navigate to the CloudFront distribution URL

---

# User Guide

## Getting Started

This user guide provides instructions for using the Local RAG system effectively.

### Accessing the Application

1. Open your web browser and navigate to the application URL (e.g., `http://localhost:5173` for local development)
2. The application will load with the Home tab selected

### Creating a Project

1. On the Home tab, select a project from the dropdown or use the default project
2. If no projects exist, one will be created automatically

### Uploading Documents

1. On the Home tab, select a project from the dropdown
2. Click the paperclip icon to upload a document
3. Select a PDF or text file from your computer
4. The file will be uploaded and associated with the selected project

### Processing Documents

There are two ways to process documents:

#### Automatic Processing (Home Tab)

1. When a file is uploaded from the Home tab, it will be automatically processed
2. The system will:
   - Upload the file
   - Process the file into chunks
   - Index the chunks into the vector database

#### Manual Processing (Process Tab)

1. Navigate to the Process tab
2. Enter the project ID
3. Optionally, enter a specific file ID (leave empty to process all files)
4. Set the chunk size (default: 100)
5. Set the overlap size (default: 20)
6. Click the "Process" button
7. View the processing results

### Indexing Documents

If you need to manually index documents:

1. Navigate to the Index Push tab
2. Enter the project ID
3. Optionally, check "Reset Index" to clear existing index data
4. Click the "Push to Index" button
5. View the indexing results

### Searching Documents

To search for information in your documents:

1. Navigate to the Search tab
2. Enter the project ID
3. Enter your search query
4. Set the limit for the number of results (default: 5)
5. Click the "Search" button
6. View the search results, including:
   - Matching text chunks
   - Relevance scores
   - Source document information

### Asking Questions

There are two ways to ask questions:

#### Using the Home Tab (Recommended)

1. On the Home tab, select a project from the dropdown
2. Wait for any uploads to complete processing
3. Type your question in the chat input field
4. Press Enter or click the send button
5. View the generated answer in the chat interface

#### Using the Answer Tab

1. Navigate to the Answer tab
2. Enter the project ID
3. Enter your question
4. Set the limit for the number of context chunks (default: 5)
5. Click the "Ask" button
6. View the generated answer, full prompt, and chat history

## Tips for Effective Use

1. **Document Quality**: Ensure your documents are well-structured and contain relevant information
2. **Chunk Size**: Adjust chunk size based on your documents:
   - Smaller chunks (50-100) for precise retrieval
   - Larger chunks (200-300) for more context
3. **Question Formulation**: Ask clear, specific questions for better results
4. **Multiple Documents**: Upload multiple related documents to create a comprehensive knowledge base
5. **Iterative Refinement**: Use search results to refine your questions

## Troubleshooting

### Common Issues

1. **Upload Failures**:
   - Check file format (PDF or TXT supported)
   - Ensure file size is under the limit (default: 10MB)
   - Verify file is not corrupted

2. **Processing Errors**:
   - Check if the file was uploaded successfully
   - Verify the project ID exists
   - Try processing with smaller chunk sizes

3. **Search/Answer Not Working**:
   - Ensure documents have been processed and indexed
   - Verify the project ID is correct
   - Check if the vector database is running

4. **Poor Answer Quality**:
   - Try reformulating your question
   - Adjust the context limit (more context can help)
   - Ensure your documents contain the relevant information

### Error Messages

- **"file_upload_failed"**: File upload failed, check file format and size
- **"file_size_error"**: File exceeds maximum size limit
- **"file_type_error"**: File type not supported
- **"processing_failed"**: Document processing failed
- **"insert_into_vectordb_error"**: Indexing failed
- **"vectordb_search_error"**: Search operation failed
- **"rag_answer_error"**: Answer generation failed

---

# Future Enhancements

## Planned Features

The Local RAG system has several potential enhancements for future development:

### 1. Support for Additional Document Types

- **Microsoft Office Documents**: Word, Excel, PowerPoint
- **HTML**: Web pages and HTML documents
- **Markdown**: Markdown documentation
- **Code Files**: Python, JavaScript, etc.

### 2. Advanced Document Processing

- **Table Extraction**: Better handling of tabular data
- **Image Processing**: Extract text from images using OCR
- **Metadata Extraction**: Extract and use document metadata
- **Document Structure Preservation**: Maintain headings, lists, etc.

### 3. Enhanced RAG Capabilities

- **Hybrid Search**: Combine vector search with keyword search
- **Multi-step Reasoning**: Break complex questions into sub-questions
- **Citation Generation**: Include specific citations in answers
- **Answer Verification**: Verify generated answers against source documents
- **Multi-document Reasoning**: Synthesize information across multiple documents

### 4. User Experience Improvements

- **User Authentication**: Add user accounts and authentication
- **Project Management**: Better project organization and sharing
- **Document Management**: Document tagging, categorization, and versioning
- **Chat History**: Save and load chat histories
- **Feedback Mechanism**: Allow users to rate and provide feedback on answers

### 5. Performance Optimizations

- **Caching**: Cache frequent queries and embeddings
- **Batch Processing**: Improve processing of large document sets
- **Distributed Processing**: Scale across multiple servers
- **Streaming Responses**: Stream answers as they are generated

### 6. Integration Capabilities

- **API Enhancements**: Comprehensive API for integration with other systems
- **Webhooks**: Event-based notifications
- **Plugin System**: Allow extending functionality with plugins

### 7. Multilingual Support

- **Document Processing**: Better handling of non-English documents
- **Cross-lingual Search**: Search in one language, find results in others
- **Translation**: Translate documents and answers

### 8. Local LLM Integration

- **Improved Ollama Integration**: Better support for local LLMs
- **Model Quantization**: Support for quantized models
- **Model Switching**: Dynamically switch between models based on task

### 9. Visualization and Analytics

- **Knowledge Graph**: Visualize relationships between documents and concepts
- **Usage Analytics**: Track and analyze system usage
- **Performance Metrics**: Monitor and report on system performance

## Implementation Roadmap

1. **Short-term (1-3 months)**:
   - Support for additional document types
   - Basic user authentication
   - Improved document chunking algorithms
   - Hybrid search implementation

2. **Medium-term (3-6 months)**:
   - Enhanced multilingual support
   - Document structure preservation
   - Advanced RAG capabilities
   - Performance optimizations

3. **Long-term (6-12 months)**:
   - Knowledge graph visualization
   - Plugin system
   - Comprehensive analytics
   - Advanced integration capabilities

---

# Conclusion

## Project Summary

The Local RAG system represents a significant advancement in making document information accessible and useful. By combining the power of vector databases with large language models, the system provides an intuitive and effective way to search and query document collections.

Key achievements of the project include:

1. **Modular Architecture**: The system's modular design allows for easy extension and customization
2. **Multiple Provider Support**: Support for different LLM and vector database providers
3. **Efficient Document Processing**: Robust pipeline for document processing and chunking
4. **Semantic Search**: Advanced semantic search capabilities
5. **Question Answering**: Accurate, context-aware question answering
6. **User-Friendly Interface**: Clean, intuitive interface for interacting with the system

## Lessons Learned

Throughout the development of the Local RAG system, several important lessons were learned:

1. **Document Processing Challenges**: Extracting and chunking text from various document formats requires careful handling of edge cases
2. **Vector Database Selection**: Different vector databases have different performance characteristics and use cases
3. **Prompt Engineering**: The quality of generated answers depends heavily on well-designed prompts
4. **Performance Considerations**: Vector operations can be resource-intensive and require optimization
5. **User Experience**: The importance of a simple, intuitive interface for complex systems

## Final Thoughts

The Local RAG system demonstrates the potential of combining retrieval-based and generative approaches to AI. By grounding large language models in specific document collections, the system provides more accurate, relevant, and trustworthy answers than either approach could achieve alone.

As the field of AI continues to evolve, systems like Local RAG will play an increasingly important role in making information accessible and useful. The modular, extensible design of the system ensures that it can adapt to new developments and continue to provide value in the future.

---

# References

## Academic Papers

1. Lewis, P., et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." *Advances in Neural Information Processing Systems*.

2. Karpukhin, V., et al. (2020). "Dense Passage Retrieval for Open-Domain Question Answering." *Proceedings of the 2020 Conference on Empirical Methods in Natural Language Processing*.

3. Guu, K., et al. (2020). "REALM: Retrieval-Augmented Language Model Pre-Training." *Proceedings of the 37th International Conference on Machine Learning*.

4. Brown, T., et al. (2020). "Language Models are Few-Shot Learners." *Advances in Neural Information Processing Systems*.

5. Johnson, J., et al. (2021). "FAISS: A Library for Efficient Similarity Search." *arXiv preprint arXiv:1702.08734*.

## Technical Resources

1. OpenAI API Documentation: [https://platform.openai.com/docs/](https://platform.openai.com/docs/)

2. Cohere API Documentation: [https://docs.cohere.com/](https://docs.cohere.com/)

3. pgvector Documentation: [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)

4. Qdrant Documentation: [https://qdrant.tech/documentation/](https://qdrant.tech/documentation/)

5. FastAPI Documentation: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)

6. React Documentation: [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)

7. SQLAlchemy Documentation: [https://docs.sqlalchemy.org/](https://docs.sqlalchemy.org/)

8. Alembic Documentation: [https://alembic.sqlalchemy.org/](https://alembic.sqlalchemy.org/)

## Project Resources

1. Project Repository: [https://github.com/00JIMMY00/local_rag](https://github.com/00JIMMY00/local_rag)

2. Original Tutorial Series: [YouTube Playlist](https://www.youtube.com/watch?v=Vv6e2Rb1Q6w&list=PLvLvlVqNQGHCUR2p0b8a0QpVjDUg50wQj)

---

# Appendices

## Appendix A: Environment Variables

The system uses the following environment variables:

```
# Application Settings
APP_NAME="mini-RAG"
APP_VERSION="0.1"

# File Settings
FILE_ALLOWED_TYPES=["text/plain", "application/pdf"]
FILE_MAX_SIZE=10
FILE_DEFAULT_CHUNK_SIZE=512000

# Database Settings
POSTGRES_USERNAME="postgres"
POSTGRES_PASSWORD="minirag2222"
POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_MAIN_DATABASE="minirag"

# LLM Settings
GENERATION_BACKEND="OPENAI"
EMBEDDING_BACKEND="COHERE"

# API Keys
OPENAI_API_KEY="sk-..."
COHERE_API_KEY="m8-..."

# Model Settings
GENERATION_MODEL_ID="gpt-4o-mini"
EMBEDDING_MODEL_ID="embed-multilingual-light-v3.0"
EMBEDDING_MODEL_SIZE=384

# Generation Settings
INPUT_DAFAULT_MAX_CHARACTERS=1024
GENERATION_DAFAULT_MAX_TOKENS=200
GENERATION_DAFAULT_TEMPERATURE=0.1

# Vector DB Settings
VECTOR_DB_BACKEND="PGVECTOR"
VECTOR_DB_PATH="qdrant_db"
VECTOR_DB_DISTANCE_METHOD="cosine"

# Language Settings
PRIMARY_LANG="ar"
DEFAULT_LANG="en"
```

## Appendix B: API Response Codes

The system uses the following response codes:

| Signal | Description |
|--------|-------------|
| `success` | Operation completed successfully |
| `file_upload_success` | File uploaded successfully |
| `file_upload_failed` | File upload failed |
| `file_size_error` | File exceeds maximum size limit |
| `file_type_error` | File type not supported |
| `file_id_error` | File ID not found |
| `no_files_error` | No files found for processing |
| `processing_failed` | Document processing failed |
| `insert_into_vectordb_success` | Indexing completed successfully |
| `insert_into_vectordb_error` | Indexing failed |
| `vectordb_collection_retrieved` | Collection information retrieved |
| `vectordb_search_success` | Search completed successfully |
| `vectordb_search_error` | Search operation failed |
| `rag_answer_success` | Answer generated successfully |
| `rag_answer_error` | Answer generation failed |
| `project_not_found_error` | Project not found |

## Appendix C: System Requirements

### Minimum Requirements

- **CPU**: 2+ cores
- **RAM**: 4GB
- **Storage**: 10GB
- **Network**: Broadband internet connection
- **Operating System**: Linux, macOS, or Windows

### Recommended Requirements

- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 20GB+ SSD
- **Network**: High-speed internet connection
- **Operating System**: Linux (Ubuntu 20.04+)

### Software Requirements

- **Docker**: 20.10.0+
- **Docker Compose**: 2.0.0+
- **Python**: 3.10+
- **Node.js**: 16.0.0+
- **npm**: 8.0.0+
- **PostgreSQL**: 14.0+
- **pgvector**: 0.4.0+ 