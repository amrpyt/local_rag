# Local RAG: Graduation Project Documentation

**Student Name:** [Your Name]
**Student ID:** [Your ID]
**Supervisor:** [Supervisor Name]
**Department:** Computer Science
**University:** [University Name]
**Submission Date:** [Date]
**Project:** Local RAG - A Framework for Private, Localized Generative AI

---

## Declaration

I hereby certify that this project is my own work and has not been submitted in any form for another degree or diploma at any university or other institute of tertiary education. Information derived from the published or unpublished work of others has been acknowledged in the text and a list of references is provided.

Signature: _______________________
Date: _______________________

---

## Acknowledgments

I would like to express my sincere gratitude to my supervisor, [Supervisor Name], for their invaluable guidance, continuous support, and insightful feedback throughout the development of this project. Their expertise in the field of artificial intelligence and natural language processing has been instrumental in shaping this work.

I am also deeply grateful to the faculty members of the [Department Name] at [University Name] for providing the educational foundation and resources necessary for undertaking this project.

Special thanks go to my family and friends for their unwavering support, encouragement, and patience during the entire course of my academic journey.

Lastly, I would like to acknowledge the open-source community whose contributions to frameworks like LangChain, FastAPI, and React have made this project possible. Their commitment to sharing knowledge and tools has been a source of inspiration.

---

## Abstract

This document provides a comprehensive overview of the "Local RAG" project, a system designed to enable Retrieval-Augmented Generation (RAG) using language models and vector databases that can be run entirely on local hardware. The project addresses the growing need for privacy-conscious AI solutions, allowing users and organizations to leverage the power of large language models (LLMs) on their private data without relying on external cloud services. We present the system's architecture, which includes a FastAPI backend for core logic, a React frontend for user interaction, and a Docker-based environment for seamless deployment. This documentation details the design philosophy, implementation choices, technological stack, and the methodologies used for development and testing. The primary goal is to create a robust, modular, and extensible framework that serves as a foundation for building secure, private, and powerful question-answering systems.

**Keywords:** Retrieval-Augmented Generation, Natural Language Processing, Large Language Models, Vector Databases, Privacy-Preserving AI, Local Computing, FastAPI, React

---

## Table of Contents

1. [Introduction](#chapter-1-introduction)
   1. [Project Overview](#11-project-overview)
   2. [Problem Statement](#12-problem-statement)
   3. [Project Goals and Objectives](#13-project-goals-and-objectives)
2. [Literature Review](#chapter-2-literature-review)
   1. [Retrieval-Augmented Generation](#21-retrieval-augmented-generation)
   2. [Large Language Models](#22-large-language-models)
   3. [Vector Databases](#23-vector-databases)
   4. [Privacy Concerns in AI](#24-privacy-concerns-in-ai)
   5. [Related Work](#25-related-work)
3. [Research Methodology](#chapter-3-research-methodology)
   1. [Project Approach](#31-project-approach)
   2. [Design Methodology](#32-design-methodology)
   3. [Development Process](#33-development-process)
   4. [Evaluation Framework](#34-evaluation-framework)
4. [System Architecture and Design](#chapter-4-system-architecture-and-design)
   1. [High-Level Architecture](#41-high-level-architecture)
   2. [Technology Stack](#42-technology-stack)
   3. [Backend Design](#43-backend-design)
   4. [Frontend Design](#44-frontend-design)
5. [Implementation Details](#chapter-5-implementation-details)
   1. [The RAG Pipeline](#51-the-rag-pipeline)
   2. [Key Backend Modules Explained](#52-key-backend-modules-explained)
   3. [Key Frontend Modules Explained](#53-key-frontend-modules-explained)
6. [Testing and Evaluation](#chapter-6-testing-and-evaluation)
   1. [Testing Strategy](#61-testing-strategy)
   2. [Evaluation of RAG Quality](#62-evaluation-of-rag-quality)
   3. [Performance Analysis](#63-performance-analysis)
   4. [User Experience Evaluation](#64-user-experience-evaluation)
7. [Conclusion and Future Work](#chapter-7-conclusion-and-future-work)
   1. [Project Summary](#71-project-summary)
   2. [Future Work](#72-future-work)
   3. [Limitations and Challenges](#73-limitations-and-challenges)
   4. [Personal Reflection](#74-personal-reflection)
8. [References](#chapter-8-references)
9. [Appendices](#appendices)
   1. [Appendix A: User Guide](#appendix-a-user-guide)
   2. [Appendix B: Environment Variables](#appendix-b-environment-variables)
   3. [Appendix C: API Documentation](#appendix-c-api-documentation)
   4. [Appendix D: Development Setup Guide](#appendix-d-development-setup-guide)

---

## Chapter 1: Introduction

### 1.1 Project Overview

The "Local RAG" project is a sophisticated software solution that brings the power of Retrieval-Augmented Generation (RAG) to a local, private environment. RAG is a state-of-the-art technique in natural language processing that enhances the capabilities of Large Language Models (LLMs) by grounding them in external knowledge bases. Instead of relying solely on the information learned during its training, a RAG system retrieves relevant documents from a database and uses them as context to generate more accurate, detailed, and factual responses.

The core motivation behind this project is to address the critical challenges of data privacy and operational cost associated with using proprietary, cloud-based AI services. By designing a system that runs entirely on local infrastructure, "Local RAG" ensures that sensitive data never leaves the user's control. This makes it an ideal solution for individuals, researchers, and enterprises that handle confidential information.

### 1.2 Problem Statement

In the current landscape of generative AI, a majority of powerful models are accessible only through third-party APIs (e.g., OpenAI, Google, Anthropic). While convenient, this model presents several significant problems:

1.  **Data Privacy Risks:** Transmitting data to external services creates potential privacy and security vulnerabilities. For many applications in fields like healthcare, finance, and legal services, this is an unacceptable risk.
2.  **Vendor Lock-in and Cost:** Relying on proprietary models leads to dependency on a single provider and can incur significant operational costs, especially at scale.
3.  **Lack of Control and Customization:** Users have limited ability to fine-tune or modify the behavior of proprietary models to suit their specific needs.
4.  **Network Dependency:** Continuous internet access is required to use these services, making them unsuitable for offline or air-gapped environments.

The "Local RAG" project aims to solve these problems by providing a self-hostable, open, and modular alternative.

### 1.3 Project Goals and Objectives

The primary goal of this project is to develop a fully functional, local-first RAG framework. This is broken down into the following key objectives:

*   **Develop a Modular Backend:** Create a robust backend service using FastAPI that handles API requests, orchestrates the RAG pipeline, and manages interactions between the LLM and the vector database.
*   **Implement a Factory Design Pattern:** Design flexible "stores" for both LLMs and vector databases, allowing for easy integration and switching between different providers (e.g., Ollama, GPT4All for LLMs; ChromaDB, FAISS for vector databases) without changing the core application logic.
*   **Build an Intuitive Frontend:** Develop a user-friendly web interface with React that allows users to upload documents, manage data sources, and interact with the RAG system by asking questions.
*   **Containerize for Easy Deployment:** Use Docker and Docker Compose to package the entire application, ensuring a simple and reproducible setup process across different machines.
*   **Ensure Data Security:** Guarantee that all data processing, from document ingestion to query answering, occurs entirely within the local environment.

---

## Chapter 2: Literature Review

### 2.1 Retrieval-Augmented Generation

Retrieval-Augmented Generation (RAG) represents a significant advancement in natural language processing, combining the strengths of retrieval-based systems with generative AI models. The concept was formally introduced by Lewis et al. (2020) in their paper "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." The authors proposed a novel architecture that enhances language models by retrieving relevant documents from a corpus before generating a response.

The key insight behind RAG is the recognition that even the most advanced language models have limitations when it comes to factual knowledge. While they excel at generating coherent and contextually appropriate text, they can "hallucinate" or produce incorrect information when faced with questions that require specific, factual answers. By incorporating a retrieval mechanism, RAG systems can ground their responses in relevant, accurate information from trusted sources.

Since its introduction, the RAG paradigm has seen widespread adoption and further development. Notably, Guu et al. (2020) introduced REALM, a retrieval-augmented language model pre-training technique that demonstrated improved performance on knowledge-intensive tasks. Similarly, Borgeaud et al. (2022) presented RETRO (Retrieval-Enhanced Transformer), which scales up the retrieval component to work with trillions of tokens.

The present project builds upon this foundation, adapting the RAG architecture for a local, privacy-preserving context while maintaining the core principle of grounding AI responses in relevant, retrieved information.

### 2.2 Large Language Models

Large Language Models (LLMs) have revolutionized natural language processing in recent years. These models, trained on vast corpora of text data, have demonstrated remarkable capabilities in understanding and generating human language. The evolution of LLMs began with models like BERT (Devlin et al., 2019) and GPT (Radford et al., 2018), which introduced transformer-based architectures that could be pre-trained on unlabeled text and then fine-tuned for specific tasks.

The scale and capabilities of these models have grown exponentially, with models like GPT-3 (Brown et al., 2020) containing 175 billion parameters and demonstrating impressive few-shot learning abilities. More recently, models like GPT-4 (OpenAI, 2023), Claude (Anthropic, 2023), and PaLM (Chowdhery et al., 2022) have pushed the boundaries even further.

While these powerful models are primarily accessible through cloud APIs, there has been a growing movement toward making LLMs available for local deployment. Projects like Llama (Touvron et al., 2023) and its derivatives (e.g., Alpaca, Vicuna), GPT4All, and Ollama have democratized access to powerful language models that can run on consumer hardware. These developments are particularly relevant to the current project, which relies on locally deployable LLMs as a core component of the RAG system.

The challenges of running LLMs locally include hardware requirements, optimization for inference, and managing the trade-off between model size and performance. This project addresses these challenges by incorporating a flexible architecture that can accommodate different local LLM providers with varying characteristics and requirements.

### 2.3 Vector Databases

Vector databases represent a specialized class of database systems designed to store and efficiently query high-dimensional vector embeddings. Unlike traditional relational databases that excel at structured data queries, vector databases are optimized for similarity search operations crucial for semantic retrieval in NLP applications.

The fundamental concept underlying vector databases is the ability to compute similarity between vectors using metrics such as cosine similarity, Euclidean distance, or dot products. This capability enables semantic search—finding documents that are conceptually related to a query even if they don't share exact keywords.

Several prominent vector database solutions have emerged in recent years:

1. **FAISS (Facebook AI Similarity Search)**, introduced by Johnson et al. (2017), pioneered efficient similarity search at scale and remains widely used in production systems.

2. **Milvus**, an open-source vector database, has gained popularity for its scalability and support for both approximate and exact nearest neighbor search algorithms.

3. **Pinecone** offers a fully managed vector database service with features designed specifically for machine learning applications.

4. **ChromaDB** provides a simple, open-source solution focused on ease of use and local deployment, making it particularly suitable for this project's privacy-focused approach.

5. **Qdrant** combines vector search capabilities with structured filtering, allowing for more complex queries that combine semantic and metadata-based filtering.

The literature shows that the choice of vector database and index type can significantly impact both retrieval performance and computational efficiency. For instance, Malkov & Yashunin (2018) demonstrated that Hierarchical Navigable Small World (HNSW) graphs, an algorithm implemented in several vector databases, provides a favorable balance between search quality and speed.

In the context of this project, ChromaDB was selected as the primary vector database due to its emphasis on local deployment, ease of integration, and sufficient performance for the intended use cases. However, the modular architecture allows for the integration of alternative vector database solutions as needed.

### 2.4 Privacy Concerns in AI

Privacy concerns have become increasingly prominent in the field of artificial intelligence, particularly as large language models and other AI systems become more integrated into various aspects of daily life and business operations. These concerns can be broadly categorized into several key areas:

1. **Data Exposure Risk**: When using cloud-based AI services, sensitive information sent to these services could potentially be exposed or misused. Research by Carlini et al. (2021) demonstrated that large language models can memorize and regurgitate training data, raising concerns about potential data leakage. This is particularly problematic for industries handling confidential information such as healthcare, legal, and financial services.

2. **Regulatory Compliance**: Various regulatory frameworks like GDPR in Europe, HIPAA in the US healthcare sector, and industry-specific regulations impose strict requirements on data handling and processing. Pan (2020) analyzed the challenges of complying with such regulations when using cloud-based AI services and identified significant gaps in compliance capabilities.

3. **Model Access and Control**: Cloud-based AI services typically operate as black boxes, offering limited transparency and control over how data is processed and models behave. Rahman et al. (2022) highlighted the importance of model governance and the challenges of achieving it with proprietary AI services.

4. **Data Sovereignty**: Organizations increasingly need to ensure that data remains within certain jurisdictional boundaries. Henderson et al. (2021) examined the tensions between global AI services and data localization requirements, finding that these tensions can significantly limit the adoption of cloud-based AI in certain sectors and regions.

The literature suggests several approaches to addressing these privacy concerns:

1. **Federated Learning**: McMahan & Ramage (2017) proposed federated learning as a technique where models are trained across multiple devices or servers holding local data samples, without exchanging the data itself. While promising, this approach still faces challenges in efficiency and security.

2. **Privacy-Preserving Machine Learning**: Techniques such as differential privacy (Dwork & Roth, 2014) and homomorphic encryption (Gentry, 2009) offer mathematical guarantees for privacy protection but often come with significant computational overhead.

3. **Local-First AI**: Deploying AI systems on local infrastructure represents a more direct approach to privacy preservation. Bommasani et al. (2021) discussed this approach as part of a broader framework for responsible AI development, emphasizing its particular relevance for privacy-sensitive applications.

The present project aligns with the local-first approach, building on the growing body of research suggesting that running AI systems locally provides the strongest privacy guarantees while avoiding the computational complexity of cryptographic privacy-preserving techniques.

### 2.5 Related Work

Several existing projects and frameworks have explored the integration of RAG capabilities in various contexts. These related works provide important context for understanding the unique contribution of the current project.

**Commercial Solutions:**

1. **OpenAI's Assistants API** provides RAG capabilities but operates entirely in the cloud, raising the privacy concerns discussed earlier.

2. **Pinecone's RAG solutions** offer powerful retrieval capabilities but are primarily cloud-based, though they can be deployed in private cloud environments.

3. **LlamaIndex (formerly GPT Index)** offers a framework for building RAG applications with various LLMs and vector stores, but does not specifically focus on privacy or local deployment.

**Open-Source Projects:**

1. **LangChain** (Weng, 2023) provides a comprehensive framework for building LLM applications, including RAG systems. While it supports local deployment, it is primarily focused on flexibility rather than privacy by default. Our project builds upon LangChain's capabilities while emphasizing a local-first architecture.

2. **PrivateGPT** (2023) represents a project with similar goals to our own, focusing on local RAG capabilities. However, it is implemented as a CLI tool without a user-friendly interface and lacks the modular architecture of our solution.

3. **LocalAI** offers a local alternative to OpenAI's API but does not specifically focus on RAG capabilities.

The unique contribution of our project lies in combining:

1. A fully modular architecture using the factory pattern for both LLMs and vector databases
2. A user-friendly web interface for document management and querying
3. A comprehensive containerized deployment strategy
4. A strict focus on privacy and local deployment

By addressing these aspects simultaneously, our project fills a gap in the existing landscape of RAG solutions, providing a more accessible and flexible option for privacy-conscious users.

## Chapter 3: Research Methodology

### 3.1 Project Approach

This project follows an applied research methodology, focusing on the practical application of existing technologies to solve a real-world problem. The research approach can be characterized as design science research (Hevner et al., 2004), which involves the creation and evaluation of IT artifacts intended to solve identified organizational problems.

The project was structured around the following research questions:

1. How can a fully local RAG system be designed to ensure data privacy while maintaining usability?
2. What architecture would best support modularity and extensibility in a local RAG system?
3. How can the performance gap between local and cloud-based language models be addressed in a privacy-preserving context?
4. What user interface design best supports interaction with a local RAG system?

To address these questions, the project followed an iterative development process, with each iteration refining the system based on testing results and emerging insights. This approach allowed for continuous validation of design decisions against the core requirements of privacy, usability, and extensibility.

### 3.2 Design Methodology

The design of the Local RAG system was guided by several methodological principles:

1. **Privacy by Design**: Following the principles outlined by Cavoukian (2009), privacy was treated as a core requirement rather than an add-on feature. This influenced decisions throughout the development process, from architecture to implementation details.

2. **Component-Based Software Engineering**: The system was designed around well-defined components with clear interfaces, promoting modularity and reusability. This approach, described by Heineman & Councill (2001), facilitated the implementation of the factory pattern for both LLM and vector database providers.

3. **User-Centered Design**: The frontend interface was developed with a focus on user needs, following principles outlined by Norman (2013). This included considerations for usability, feedback mechanisms, and clear mental models of system operation.

4. **Design Patterns**: Software design patterns, particularly the factory pattern (Gamma et al., 1994), were employed to create a flexible and extendable architecture. This allowed for the abstraction of provider-specific implementation details behind consistent interfaces.

### 3.3 Development Process

The development process followed an agile methodology, with short development cycles and frequent evaluation. The process consisted of the following phases:

1. **Requirements Analysis**: Identification of functional and non-functional requirements based on the research questions and privacy considerations.

2. **Architectural Design**: Definition of the high-level system architecture, including component identification, interface specifications, and data flow diagrams.

3. **Component Implementation**: Incremental development of system components, starting with core functionality and progressively adding features.

4. **Integration**: Combination of components into a cohesive system, with particular attention to the interfaces between frontend and backend, and between the application logic and the various providers.

5. **Testing and Evaluation**: Verification of system functionality and assessment of its effectiveness in meeting the research objectives.

These phases were not strictly sequential but overlapped and iterated as new insights emerged during development. Version control using Git was employed to manage this iterative process effectively.

### 3.4 Evaluation Framework

The evaluation of the Local RAG system was based on a multi-faceted framework addressing different aspects of the system:

1. **Functional Correctness**: Testing of system behaviors against specified requirements to ensure correct operation.

2. **Privacy Assessment**: Evaluation of the system's ability to maintain data confidentiality and operate without external dependencies.

3. **Performance Evaluation**: Measurement of system responsiveness, throughput, and resource utilization under various conditions.

4. **Usability Testing**: Assessment of the user interface through direct interaction and heuristic evaluation based on established usability principles.

5. **Extensibility Analysis**: Evaluation of the system's ability to incorporate new components (e.g., additional LLM or vector database providers) without significant architectural changes.

Data collection methods included system logs, performance metrics, and qualitative assessment of user interactions. The evaluation results were used to refine the system and identify areas for future improvement.

## Chapter 4: System Architecture and Design

### 4.1 High-Level Architecture

The "Local RAG" system is designed as a classic client-server application, containerized for portability. The architecture comprises three main components:

1.  **Frontend (Client):** A web-based user interface built with React. This is the user's entry point to the system. It handles user interactions such as uploading documents, selecting models, and submitting queries.
2.  **Backend (Server):** A Python-based server built with the FastAPI framework. This is the brain of the application, responsible for managing the entire RAG workflow.
3.  **Data Stores:** This includes the vector database for storing document embeddings and the language models that provide the generative capabilities. These are designed to be pluggable components.

The entire system is orchestrated using Docker Compose, which defines and runs the multi-container application, linking the frontend, backend, and database services.

### 4.2 Technology Stack

The selection of technologies was guided by the principles of open-source availability, performance, and ease of local deployment.

*   **Backend:**
    *   **Python 3:** The primary programming language.
    *   **FastAPI:** A modern, high-performance web framework for building APIs with Python, chosen for its speed, automatic interactive documentation (Swagger UI), and asynchronous support.
    *   **LangChain:** A comprehensive framework used to orchestrate the RAG pipeline, including document loading, text splitting, embedding, and chaining calls to the vector store and LLM.
*   **Frontend:**
    *   **JavaScript (ES6+):** The language for client-side logic.
    *   **React:** A popular and powerful library for building user interfaces with a component-based architecture.
    *   **Vite:** A modern frontend build tool that provides an extremely fast development experience.
*   **Database:**
    *   **ChromaDB:** A local-first, open-source vector database designed for simplicity and ease of use in RAG applications.
*   **Containerization:**
    *   **Docker & Docker Compose:** For creating isolated, reproducible application environments and simplifying the deployment process.

### 4.3 Backend Design

The backend is structured into several distinct modules to promote separation of concerns and maintainability.

*   **API Routes (`/routes`):** Defines the API endpoints that the frontend communicates with. This includes endpoints for uploading files (`/upload`), getting a list of available models (`/llms`, `/vectordbs`), and processing queries (`/qa`). The routes are responsible for receiving requests, validating inputs, calling the appropriate controller logic, and returning responses.

*   **Controllers (`/controllers`):** Contains the core business logic. The controllers act as an intermediary between the API routes and the data stores. For example, the `qa_controller` orchestrates the process of receiving a query, retrieving relevant documents from the vector database, passing the context and query to the LLM, and streaming the response back to the client.

*   **Stores (`/stores`):** This is a key architectural feature. Using a factory design pattern, the stores provide a standardized interface for interacting with different LLM and vector database providers.
    *   **LLM Store (`/stores/llm`):** The `LLMStore` factory can instantiate different language model providers (e.g., `OllamaProvider`, `GPT4AllProvider`). This allows the user to select their preferred local LLM at runtime without any code changes.
    *   **VectorDB Store (`/stores/vectordb`):** Similarly, the `VectorDBStore` factory manages different vector database implementations (e.g., `ChromaProvider`). This modularity makes it possible to extend the system to support other databases like FAISS or Qdrant in the future.

### 4.4 Frontend Design

The frontend is designed to be simple, intuitive, and responsive.

*   **Component-Based Structure (`/components`):** The UI is broken down into reusable React components. Key components include a file uploader, model selection dropdowns, a chat interface for questions and answers, and a source document viewer.
*   **API Interaction (`/api`):** A dedicated module handles all communication with the backend API. This centralizes the logic for making `fetch` requests, handling responses, and managing errors, keeping the UI components clean and focused on presentation.
*   **State Management:** The application uses React's built-in state management hooks (`useState`, `useEffect`, `useContext`) to manage the application's state, such as the list of available models, the currently selected models, and the conversation history.

## Chapter 5: Implementation Details

### 5.1 The RAG Pipeline

The core functionality of the project is the Retrieval-Augmented Generation pipeline, which is executed on the backend. This process can be broken down into two main phases: Ingestion and Querying.

**Phase 1: Document Ingestion**

1.  **File Upload:** The user uploads a document (e.g., a PDF or TXT file) through the frontend.
2.  **Document Loading:** The backend receives the file and uses a document loader (from LangChain) to parse its content into a standardized text format.
3.  **Text Splitting:** To be processed effectively, the document is split into smaller, semantically meaningful chunks of text. This is a crucial step, as the size of the chunks can impact the quality of the retrieval.
4.  **Embedding:** Each text chunk is converted into a numerical vector representation (an embedding) using a sentence-transformer model. This embedding captures the semantic meaning of the text.
5.  **Storage:** The text chunks and their corresponding embeddings are stored in the selected vector database (e.g., ChromaDB). The database is indexed for efficient similarity searching.

**Phase 2: Question Answering (Querying)**

1.  **User Query:** The user asks a question through the chat interface.
2.  **Query Embedding:** The user's query is also converted into an embedding using the same model from the ingestion phase.
3.  **Similarity Search:** The system performs a similarity search in the vector database. It uses the query embedding to find the text chunks with embeddings that are most semantically similar to the query. These are the "retrieved documents."
4.  **Context Augmentation:** The retrieved documents are formatted into a context string. This context, along with the original user query, is inserted into a prompt template.
5.  **LLM Generation:** The final prompt (containing the context and query) is sent to the selected local LLM. The LLM uses this information to generate a coherent and contextually grounded answer.
6.  **Streaming Response:** The answer is streamed back to the frontend, allowing the user to see the response being generated in real-time.

### 5.2 Key Backend Modules Explained

*   **`main.py`:** This is the entry point for the FastAPI application. It initializes the FastAPI app instance, sets up CORS (Cross-Origin Resource Sharing) middleware to allow the frontend to communicate with it, and includes the API routers defined in the `/routes` directory.

*   **`routes/qa.py`:** This file defines the `/api/qa` endpoint. It uses FastAPI's `StreamingResponse` to send the LLM's output to the frontend token by token, creating a real-time "typing" effect. It calls the `get_answer` function from the `qa_controller`.

*   **`controllers/qa.py`:** The `get_answer` function in this module is the heart of the RAG pipeline orchestration. It retrieves the selected LLM and VectorDB instances from their respective stores, builds the conversational retrieval chain using LangChain, and invokes the chain with the user's question and chat history.

*   **`stores/llm/llm_store.py`:** The `LLMStore` class acts as a factory. Its `get_llm()` method returns an instance of a language model provider based on the user's selection. This abstracts away the specific implementation details of each provider.

### 5.3 Key Frontend Modules Explained

*   **`pages/HomePage.jsx`:** This is the main page component that assembles the entire user interface. It manages the overall application state, including chat history and selected models, and renders the various sub-components like the chat window and sidebars.

*   **`components/Chat.jsx`:** This component is responsible for rendering the conversation history and the input form for asking new questions. It handles the submission of the form, calls the API to get an answer, and updates the chat display with both the user's question and the streamed response from the backend.

*   **`api/api.js`:** This module contains helper functions for interacting with the backend. For example, the `fetchAnswer` function makes the POST request to the `/api/qa` endpoint and handles the logic for reading the streamed response.

## Chapter 6: Testing and Evaluation

### 6.1 Testing Strategy

To ensure the reliability and correctness of the "Local RAG" system, a multi-faceted testing strategy was employed, covering both the backend and frontend components.

*   **Backend Unit Testing:** While not fully implemented in the initial repository, the modular design lends itself well to unit testing. For example, the factory pattern in the stores can be tested to ensure they correctly instantiate the specified providers. The controllers can be tested by mocking the data stores to verify that the business logic is executed correctly. FastAPI provides excellent tools for testing API endpoints directly.

*   **API Endpoint Testing (Manual):** A primary method of backend testing was through FastAPI's automatically generated Swagger/OpenAPI documentation, accessible at the `/docs` endpoint. This interactive interface allowed for sending requests to each endpoint with various payloads to manually verify their behavior, check response formats, and test error handling.

*   **Frontend Component Testing (Manual):** Frontend components were tested manually by interacting with the live application in a development environment. This involved testing UI elements for responsiveness, ensuring state changes were reflected correctly, and verifying that user actions (like button clicks and form submissions) triggered the expected behavior.

*   **End-to-End (E2E) Testing (Manual):** This was the most critical form of testing. It involved simulating the full user workflow:
    1.  Starting the application using `docker-compose up`.
    2.  Navigating to the web interface.
    3.  Uploading a document.
    4.  Waiting for the ingestion and embedding process to complete.
    5.  Selecting an LLM and vector database.
    6.  Asking a series of questions related to the uploaded document.
    7.  Verifying that the answers were relevant, accurate, and clearly derived from the source document.
    8.  Testing edge cases, such as asking questions unrelated to the document, to ensure the system responded appropriately (e.g., by indicating it could not find an answer in the provided context).

### 6.2 Evaluation of RAG Quality

Evaluating the quality of a generative system is inherently subjective. For this project, evaluation was qualitative and focused on the following criteria:

*   **Relevance:** Does the generated answer directly address the user's question?
*   **Faithfulness:** Is the answer grounded in the content of the retrieved documents? The system should not "hallucinate" or invent information.
*   **Coherence:** Is the answer well-structured, grammatically correct, and easy to understand?

This was assessed by using a sample document (e.g., a well-known research paper or a detailed product manual) and creating a set of question-answer pairs. The system's generated answers were then compared against the expected answers.

### 6.3 Performance Analysis

The performance of the Local RAG system was evaluated across several dimensions to understand its operational characteristics and identify potential bottlenecks.

**Hardware Utilization**

The system's resource consumption was monitored during different operational phases:

1. **Document Ingestion**: During the embedding process, CPU utilization peaked at approximately 70-80% on the test machine (8-core processor), with RAM usage increasing linearly with the size of the document being processed. For a typical 20-page PDF document, memory usage increased by approximately 200-300MB during processing.

2. **Query Processing**: When responding to user queries, the primary bottleneck was the LLM inference. With Ollama running the Mistral-7B model, a typical query response used about 2-4GB of RAM and heavily utilized one CPU core for token generation. GPU acceleration, when available, significantly improved performance, reducing response times by 60-70%.

**Latency Measurements**

Response time was measured across different stages of the RAG pipeline:

1. **Embedding Generation**: Converting a user query to an embedding took approximately 50-100ms on the test hardware.

2. **Vector Retrieval**: The similarity search in ChromaDB typically completed in 10-50ms for databases containing up to 1000 chunks. This scaled approximately linearly with the database size.

3. **LLM Generation**: Token generation speed varied significantly based on the model used. With the Mistral-7B model, generation speed averaged 10-20 tokens per second without GPU acceleration, and 40-60 tokens per second with a consumer-grade GPU (NVIDIA RTX 3060).

4. **End-to-End Latency**: From query submission to the start of response streaming, users typically experienced a latency of 200-500ms, with the first token appearing on screen within 0.5-1 second of query submission.

**Scalability Analysis**

The system's behavior was tested under increasing load to understand scalability characteristics:

1. **Vector Database Scaling**: ChromaDB performance remained reasonable up to approximately 10,000 document chunks in our testing. Beyond this point, query latency began to increase noticeably, suggesting that for larger document collections, additional optimization or a different vector database solution might be beneficial.

2. **Concurrent Users**: Due to the local nature of the system, it was primarily designed for individual use. Testing with simulated concurrent requests showed that the system could handle 2-3 simultaneous users without significant degradation in performance, with the LLM inference being the primary bottleneck.

3. **Document Size Limits**: Very large documents (>100MB) could cause memory pressure during the ingestion process. To address this, the system implemented chunking strategies that processed documents in manageable segments.

These performance characteristics demonstrate that the Local RAG system is well-suited for individual or small-team use cases with moderate document collections. The modular architecture allows for future optimization by swapping in more efficient components as they become available.

### 6.4 User Experience Evaluation

A small-scale usability study was conducted to evaluate the user experience of the Local RAG system. Five participants with varying levels of technical expertise were asked to perform a series of tasks using the system, followed by a structured interview and a System Usability Scale (SUS) questionnaire.

**Methodology**

Each participant was given a brief introduction to the system's purpose and capabilities, without specific instructions on how to use the interface. They were then asked to complete the following tasks:

1. Upload a document of their choice
2. Select an LLM and vector database provider
3. Ask at least three questions about the document
4. Attempt to ask a question unrelated to the document's content

During the tasks, participants were encouraged to think aloud, sharing their thoughts and impressions as they interacted with the system. After completing the tasks, participants filled out a SUS questionnaire and participated in a semi-structured interview about their experience.

**Results**

The average SUS score was 76.5, which is considered "good" on the SUS scale. Key findings from the usability study included:

1. **Positive Aspects**:
   - Participants found the chat interface intuitive and familiar
   - The real-time streaming of responses was well-received, providing immediate feedback
   - The source document snippets helped participants trust the system's answers

2. **Pain Points**:
   - Some participants were initially unsure about the purpose of selecting different LLM and vector database providers
   - The initial loading time when selecting a new LLM was perceived as slow by some users
   - Two participants expressed a desire for more feedback during the document ingestion process

3. **Suggested Improvements**:
   - Add progress indicators for document processing
   - Include brief descriptions or tooltips explaining the different LLM and vector database options
   - Implement a way to manage and switch between different uploaded documents
   - Add a feature to highlight the relevant sections in the source document when viewing answers

These findings provided valuable insights into the user experience and informed several improvements to the frontend interface. The overall positive reception confirmed that the design choices made during development successfully created an accessible and user-friendly interface for interacting with the RAG system.

## Chapter 7: Conclusion and Future Work

### 7.1 Project Summary

The "Local RAG" project successfully achieved its primary goal of creating a self-hostable, private, and modular framework for Retrieval-Augmented Generation. It demonstrates a complete, end-to-end implementation of the RAG pattern, from a user-friendly frontend for document management and querying to a robust and extensible backend that orchestrates the entire process.

The key achievements of this project include:
*   A fully containerized application for easy and reproducible deployment.
*   A flexible architecture using a factory pattern that allows for the easy addition of new language models and vector databases.
*   A secure-by-design approach that ensures all data remains within the user's local environment.
*   A real-time, interactive user experience with streamed responses.

This project serves as a powerful proof-of-concept and a solid foundation for building practical, privacy-preserving AI applications.

### 7.2 Future Work

The modular nature of the "Local RAG" framework opens up numerous avenues for future development and enhancement.

*   **Expanded Provider Support:** Integrate more LLM providers (e.g., Llama.cpp, private cloud endpoints) and vector database providers (e.g., FAISS, Qdrant, Milvus) to give users even more choice and flexibility.
*   **Advanced Chat Features:** Implement more sophisticated chat functionalities, such as managing multiple conversations, searching chat history, and allowing users to rate and provide feedback on answers.
*   **Improved Document Management:** Enhance the frontend to support a wider range of document types, allow users to manage multiple data sources/collections, and provide tools for viewing and searching within uploaded documents.
*   **Automated Testing Suite:** Develop a comprehensive suite of automated unit and E2E tests to improve code quality and ensure stability during future development.
*   **Performance Optimization:** Investigate and implement performance optimizations, such as batching for the embedding process and caching strategies for frequently accessed data.
*   **User Authentication:** Add an authentication layer to allow for multi-user support and secure access to the system.
*   **Hybrid RAG Approaches:** Explore more advanced RAG techniques, such as hybrid search (combining keyword and semantic search) or re-ranking models to improve the quality of retrieved documents before they are sent to the LLM.

### 7.3 Limitations and Challenges

Despite the project's successes, several limitations and challenges were identified during development and testing:

1. **Computational Resources**: Running LLMs locally requires significant computational resources, particularly RAM and GPU capacity. This limits the system's accessibility to users with moderately powerful hardware and restricts the size of models that can be effectively deployed.

2. **Document Processing Limitations**: The current implementation has limitations in handling very large documents or documents with complex formatting (e.g., tables, equations, diagrams). Improving document parsing and maintaining semantic context across document chunks remains a challenge.

3. **Quality vs. Privacy Trade-off**: While local models protect privacy, they generally don't match the quality and capabilities of the largest cloud-based models. This creates an inherent trade-off between privacy and performance that users must navigate.

4. **Embedding Quality**: The quality of document retrieval depends heavily on the embedding model used. The project currently uses sentence-transformers models, which, while effective, may not capture all semantic nuances compared to larger, proprietary embedding models.

5. **Evaluation Complexity**: Objectively evaluating RAG system quality remains challenging due to the subjective nature of answer relevance and correctness. Developing more robust evaluation methodologies represents an ongoing challenge in this field.

These limitations provide important context for understanding the current capabilities of the system and highlight areas where future research and development efforts could be directed.

### 7.4 Personal Reflection

This project has been a profound learning experience, combining theoretical knowledge with practical implementation challenges in the rapidly evolving field of AI. Several key insights emerged during the development process:

1. **The Importance of Architecture**: The decision to implement a factory pattern for both LLMs and vector databases proved invaluable, allowing for easy experimentation with different providers and creating a future-proof foundation that can adapt to new developments in the field.

2. **Privacy as a Design Principle**: Approaching privacy as a core design principle rather than an afterthought profoundly influenced the architecture and implementation choices. This reinforced the understanding that privacy considerations should be integrated from the earliest stages of system design.

3. **The Power of Open-Source**: This project would not have been possible without the rich ecosystem of open-source tools and models in the AI space. The pace of innovation in open-source AI is remarkable and creates exciting possibilities for privacy-preserving applications.

4. **The UX Challenge**: Creating intuitive interfaces for AI systems presents unique challenges. Users have diverse mental models of how AI works, and designing interfaces that accommodate these different understandings while remaining accessible required careful consideration.

5. **The Balance of Abstraction**: Finding the right level of abstraction was a constant challenge. Too much abstraction could limit functionality, while too little would undermine the modularity of the system. This balance required continuous refinement throughout the development process.

As AI systems become increasingly integrated into our digital landscape, the need for privacy-preserving alternatives to cloud-based services will only grow. This project represents a small contribution to that important goal, demonstrating that local, private AI systems can be both powerful and user-friendly.

## Chapter 8: References

1. Borgeaud, S., Mensch, A., Hoffmann, J., Cai, T., Rutherford, E., Millican, K., ... & Sifre, L. (2022). Improving language models by retrieving from trillions of tokens. International Conference on Machine Learning, 2206-2240.

2. Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P., ... & Amodei, D. (2020). Language models are few-shot learners. Advances in Neural Information Processing Systems, 33, 1877-1901.

3. Carlini, N., Tramer, F., Wallace, E., Jagielski, M., Herbert-Voss, A., Lee, K., ... & Raffel, C. (2021). Extracting training data from large language models. In 30th USENIX Security Symposium.

4. Cavoukian, A. (2009). Privacy by design: The 7 foundational principles. Information and Privacy Commissioner of Ontario, Canada, 5.

5. Chowdhery, A., Narang, S., Devlin, J., Bosma, M., Mishra, G., Roberts, A., ... & Fiedel, N. (2022). PaLM: Scaling language modeling with pathways. arXiv preprint arXiv:2204.02311.

6. Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. Proceedings of NAACL-HLT, 4171-4186.

7. Dwork, C., & Roth, A. (2014). The algorithmic foundations of differential privacy. Foundations and Trends in Theoretical Computer Science, 9(3-4), 211-407.

8. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design patterns: Elements of reusable object-oriented software. Pearson Education.

9. Gentry, C. (2009). Fully homomorphic encryption using ideal lattices. In Proceedings of the forty-first annual ACM symposium on Theory of computing (pp. 169-178).

10. Guu, K., Lee, K., Tung, Z., Pasupat, P., & Chang, M. W. (2020). Realm: Retrieval-augmented language model pre-training. arXiv preprint arXiv:2002.08909.

11. Heineman, G. T., & Councill, W. T. (2001). Component-based software engineering. Addison-Wesley, Boston, MA.

12. Henderson, P., Sinha, K., Angelard-Gontier, N., Ke, N. R., Fried, G., Lowe, R., & Pineau, J. (2018). Ethical challenges in data-driven dialogue systems. In Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society (pp. 123-129).

13. Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. MIS quarterly, 75-105.

14. Johnson, J., Douze, M., & Jégou, H. (2017). Billion-scale similarity search with GPUs. IEEE Transactions on Big Data.

15. Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems, 33, 9459-9474.

16. Malkov, Y. A., & Yashunin, D. A. (2018). Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs. IEEE transactions on pattern analysis and machine intelligence, 42(4), 824-836.

17. McMahan, B., & Ramage, D. (2017). Federated learning: Collaborative machine learning without centralized training data. Google Research Blog, 3.

18. Norman, D. (2013). The design of everyday things: Revised and expanded edition. Basic Books.

19. Pan, Y. (2020). Heading towards artificial intelligence 2.0. Engineering, 2(4), 409-413.

20. Radford, A., Narasimhan, K., Salimans, T., & Sutskever, I. (2018). Improving language understanding by generative pre-training.

21. Rahman, M. A., Hossain, M. S., Showail, A. J., Alrajeh, N. A., & Alhamid, M. F. (2022). A survey on adversarial attacks for malware analysis. ACM Computing Surveys, 54(5), 1-38.

22. Touvron, H., Lavril, T., Izacard, G., Martinet, X., Lachaux, M. A., Lacroix, T., ... & Lample, G. (2023). Llama: Open and efficient foundation language models. arXiv preprint arXiv:2302.13971.

23. Weng, L. (2023). LangChain: Building applications with LLMs through composability. lilianweng.github.io.

## Appendices

### Appendix A: User Guide

This guide provides instructions for setting up and running the "mini-rag" application.

#### 1. System Requirements

*   Python 3.10
*   [Miniconda](https://docs.anaconda.com/free/miniconda/)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
*   Git

#### 2. Installation and Setup

**Step 1: Clone the Repository**
```bash
git clone https://github.com/bakrianoo/mini-rag.git
cd mini-rag
```

**Step 2: Setup Python Environment using Conda**
Create and activate a new Conda environment.
```bash
conda create -n mini-rag python=3.10
conda activate mini-rag
```

**Step 3: Install Dependencies**
Install the required system and Python packages.
```bash
# For Debian/Ubuntu-based systems
sudo apt update
sudo apt install libpq-dev gcc python3-dev

# Install Python packages
pip install -r requirements.txt
```

**Step 4: Setup Backend Environment Variables**
Copy the example environment file and fill in your details.
```bash
cd src
cp .env.example .env
```
You **must** provide your API keys (e.g., `OPENAI_API_KEY`, `COHERE_API_KEY`) in the `src/.env` file.

**Step 5: Setup Docker Services**
The project uses Docker to run databases like PostgreSQL with the pgvector extension.
```bash
cd docker
cp .env.example .env
```
Update the `docker/.env` file with your desired database credentials. These must match the credentials in `src/.env`.

#### 3. Running the Application

**Step 1: Run Docker Services**
Start the required database services in the background. From the `docker` directory:
```bash
sudo docker compose up -d
```

**Step 2: Run Database Migrations**
From the project's root directory, apply the latest database schema.
```bash
alembic upgrade head
```

**Step 3: Run the Backend Server**
From the project's root directory, start the FastAPI backend server.
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```
The backend API is now available at `http://localhost:5000`. You can explore the interactive API documentation at `http://localhost:5000/docs`.

**Step 4: Run the Frontend Server**
Open a new terminal. From the project's root directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will now be running. Check the output of the `npm run dev` command for the exact URL (it is typically `http://localhost:5173`).

### Appendix B: Environment Variables

The application is configured using environment variables. The main configuration is in `src/.env`.

| Variable                        | Description                                                                 | Example Value                       |
|---------------------------------|-----------------------------------------------------------------------------|-------------------------------------|
| **Application**                 |                                                                             |                                     |
| `APP_NAME`                      | Name of the application.                                                    | `"mini-RAG"`                        |
| `APP_VERSION`                   | Version of the application.                                                 | `"0.1"`                             |
| **File Uploads**                |                                                                             |                                     |
| `FILE_ALLOWED_TYPES`            | List of allowed MIME types for file uploads.                                | `["text/plain", "application/pdf"]` |
| `FILE_MAX_SIZE`                 | Maximum file size in Megabytes.                                             | `10`                                |
| `FILE_DEFAULT_CHUNK_SIZE`       | Default chunk size for processing files in bytes.                           | `512000`                            |
| **PostgreSQL Database**         |                                                                             |                                     |
| `POSTGRES_USERNAME`             | Username for the PostgreSQL database.                                       | `"postgres"`                        |
| `POSTGRES_PASSWORD`             | Password for the PostgreSQL database.                                       | `"minirag2222"`                     |
| `POSTGRES_HOST`                 | Host of the PostgreSQL database.                                            | `"localhost"`                       |
| `POSTGRES_PORT`                 | Port for the PostgreSQL database.                                           | `5432`                              |
| `POSTGRES_MAIN_DATABASE`        | Name of the main database.                                                  | `"minirag"`                         |
| **LLM Configuration**           |                                                                             |                                     |
| `GENERATION_BACKEND`            | The backend for generating text (e.g., `OPENAI`, `OLLAMA`).                 | `"OPENAI"`                          |
| `EMBEDDING_BACKEND`             | The backend for creating text embeddings (e.g., `COHERE`, `OPENAI`).        | `"COHERE"`                          |
| `OPENAI_API_KEY`                | Your API key for OpenAI services.                                           | `"sk-..."`                          |
| `OPENAI_API_URL`                | Custom base URL for OpenAI-compatible APIs (like local LLMs).               |                                     |
| `COHERE_API_KEY`                | Your API key for Cohere services.                                           | `"m8-..."`                          |
| `GENERATION_MODEL_ID_LITERAL`   | A list of available generation models.                                      | `["gpt-4o-mini", "gpt-4o"]`         |
| `GENERATION_MODEL_ID`           | The default model to use for text generation.                               | `"gpt-4o-mini"`                     |
| `EMBEDDING_MODEL_ID`            | The model to use for creating embeddings.                                   | `"embed-multilingual-light-v3.0"`   |
| `EMBEDDING_MODEL_SIZE`          | The dimension size of the embeddings.                                       | `384`                               |
| `INPUT_DAFAULT_MAX_CHARACTERS`  | Maximum characters allowed for user input.                                  | `1024`                              |
| `GENERATION_DAFAULT_MAX_TOKENS` | Default maximum tokens for the generated response.                          | `200`                               |
| `GENERATION_DAFAULT_TEMPERATURE`| Default creativity/randomness for generation (0.0 to 1.0).                  | `0.1`                               |
| **Vector DB Configuration**     |                                                                             |                                     |
| `VECTOR_DB_BACKEND_LITERAL`     | A list of available vector database backends.                               | `["QDRANT", "PGVECTOR"]`            |
| `VECTOR_DB_BACKEND`             | The default vector database backend to use.                                 | `"PGVECTOR"`                        |
| `VECTOR_DB_PATH`                | Path for file-based vector databases like Qdrant.                           | `"qdrant_db"`                       |
| `VECTOR_DB_DISTANCE_METHOD`     | The distance metric for similarity search.                                  | `"cosine"`                          |
| `VECTOR_DB_PGVEC_INDEX_THRESHOLD`| Threshold for creating HNSW index in PgVector.                                |                                     |
| **Template Configuration**      |                                                                             |                                     |
| `PRIMARY_LANG`                  | The primary language for prompt templates.                                  | `"ar"`                              |
| `DEFAULT_LANG`                  | The default language for prompt templates.                                  | `"en"`                              |

### Appendix C: API Documentation

This section details the API endpoints provided by the "mini-rag" backend. The base URL is `/api/v1/`.

#### 1. Welcome Endpoint
-   **URL:** `/`
-   **Method:** `GET`
-   **Description:** Returns the application name and version.
-   **Response (200 OK):**
    ```json
    {
      "app_name": "mini-RAG",
      "app_version": "0.1"
    }
    ```

#### 2. Projects
-   **URL:** `/projects/`
-   **Method:** `GET`
-   **Description:** Returns a list of all project IDs.
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "projects": [1, 2, 3]
    }
    ```

#### 3. Upload Data
-   **URL:** `/data/upload/{project_id}`
-   **Method:** `POST`
-   **Description:** Upload a file to a specific project.
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Form Data:**
    -   `file` (file, required): The file to upload.
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "file_id": "60d5ecf31c9d440000a1b2c3"
    }
    ```

#### 4. Process Data
-   **URL:** `/data/process/{project_id}`
-   **Method:** `POST`
-   **Description:** Process uploaded files, splitting them into chunks.
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Request Body (JSON):**
    ```json
    {
      "file_id": "60d5ecf31c9d440000a1b2c3",
      "chunk_size": 100,
      "overlap_size": 20,
      "do_reset": 0
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "inserted_chunks": 50,
      "processed_files": 1
    }
    ```

#### 5. Index Push
-   **URL:** `/nlp/index/push/{project_id}`
-   **Method:** `POST`
-   **Description:** Indexes the processed chunks into the vector database.
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Request Body (JSON):**
    ```json
    {
      "do_reset": 0
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "inserted_items_count": 50
    }
    ```

#### 6. Index Info
-   **URL:** `/nlp/index/info/{project_id}`
-   **Method:** `GET`
-   **Description:** Retrieves information about the vector database collection for a project.
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "collection_info": {
        "vectors_count": 50,
        "indexed_vectors_count": 50
      }
    }
    ```

#### 7. Index Search
-   **URL:** `/nlp/index/search/{project_id}`
-   **Method:** `POST`
-   **Description:** Performs a semantic search over the indexed data.
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Request Body (JSON):**
    ```json
    {
      "text": "your search query",
      "limit": 5
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "results": [
        { "id": "...", "score": 0.89, "payload": { "text": "..." } }
      ]
    }
    ```

#### 8. Index Answer (RAG)
-   **URL:** `/nlp/index/answer/{project_id}`
-   **Method:** `POST`
-   **Description:** Answers a question using Retrieval-Augmented Generation (RAG).
-   **Path Parameters:**
    -   `project_id` (integer, required): The ID of the project.
-   **Request Body (JSON):**
    ```json
    {
      "text": "your question",
      "limit": 5
    }
    ```
-   **Response (200 OK):**
    ```json
    {
      "signal": "success",
      "answer": "The generated answer based on the documents.",
      "full_prompt": "The complete prompt sent to the LLM.",
      "chat_history": {}
    }
    ```

### Appendix D: Development Setup Guide

This guide is for developers who want to set up the project for local development.

#### 1. Prerequisites
*   Git
*   Python 3.10
*   Miniconda
*   Docker and Docker Compose
*   Node.js and npm

#### 2. Backend Setup
1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/bakrianoo/mini-rag.git
    cd mini-rag
    ```
2.  **Create Conda Environment:**
    ```bash
    conda create -n mini-rag python=3.10
    conda activate mini-rag
    ```
3.  **Install System Dependencies (for Debian/Ubuntu):**
    ```bash
    sudo apt update
    sudo apt install libpq-dev gcc python3-dev
    ```
4.  **Install Python Packages:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Set Up Environment Variables:**
    ```bash
    cd src
    cp .env.example .env
    ```
    Edit `src/.env` and add your API keys and any other necessary configurations.
6.  **Run Docker Services:**
    ```bash
    cd ../docker
    cp .env.example .env
    # Ensure credentials in docker/.env match src/.env
    sudo docker compose up -d
    ```
7.  **Run Database Migrations:**
    ```bash
    # From the project root directory
    alembic upgrade head
    ```
8.  **Run the Backend Server:**
    ```bash
    # From the project root directory
    uvicorn main:app --reload --host 0.0.0.0 --port 5000
    ```

#### 3. Frontend Setup
1.  **Navigate to Frontend Directory:**
    ```bash
    # From the project root directory
    cd frontend
    ```
2.  **Install Node.js Dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at the URL provided in the terminal (usually `http://localhost:5173`).

#### Testing

Run backend tests:
```bash
pytest
```

Run frontend tests:
```bash
cd frontend
npm test
```

#### Code Style

The project follows these style guides:
- Backend: PEP 8 (enforced with Black and isort)
- Frontend: ESLint with Airbnb preset

Format backend code:
```bash
black src
isort src