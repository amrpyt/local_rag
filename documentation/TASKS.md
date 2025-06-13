# Mini-RAG Frontend Development Plan

## Objective
To build a complete, fully functional, and production-ready frontend for the Mini-RAG application. The frontend will connect to the existing backend API and implement all features defined in the PRD.

---

## Phase 1: Foundation & Core UI Cleanup

- [x] **1.1: Code Cleanup:**
    - [x] Consolidate `ProjectSelector`. Remove `SimpleProjectSelector` and any other test components (`TestApiComponent`, `DirectApiTest`).
    - [x] Ensure the main `ProjectSelector` is robust, handles loading/error states, and uses the `shadcn/ui` `Select` component.
    - [x] Remove diagnostic components from `DashboardPage.jsx`.

- [x] **1.2: Solidify Layout & Navigation:**
    - [x] Review and finalize the main `Layout` component (`frontend/src/components/layout/layout.tsx`).
    - [x] Ensure the `Header` correctly displays the page title and the `ProjectSelector`.
    - [x] Ensure the `Sidebar` provides correct navigation links to all pages.

- [x] **1.3: Centralize State Management:**
    - [x] Verify `ProjectContext` is the single source of truth for the `selectedProject`.
    - [x] Ensure the selected project is persisted in `localStorage` and loaded on app startup.
    - [x] Make sure all API calls that require a `project_id` use the value from `ProjectContext`.

---

## Phase 2: Feature Implementation (Page by Page)

- [x] **2.1: Dashboard Page (`/`)**
    - [x] The current dashboard has static placeholder data. This is acceptable for now as the API does not provide aggregate stats.
    - [x] The "Quick Actions" will be implemented via their respective pages.

- [x] **2.2: Upload Page (`/upload`)**
    - [x] Implement file input and drag-and-drop functionality.
    - [x] Connect the upload functionality to the `/api/v1/data/upload/{project_id}` endpoint.
    - [x] Display a loading indicator during upload.
    - [x] Show a success or error notification toast after the upload attempt.
    - [x] **Note:** The API does not provide an endpoint to list uploaded files. This feature will be omitted.

- [x] **2.3: Process Page (`/process`)**
    - [x] Create a form with inputs for `chunk_size`, `overlap_size`, and `do_reset` toggle.
    - [x] Connect the form to the `/api/v1/data/process/{project_id}` endpoint.
    - [x] Disable the form and show a loading indicator while processing.
    - [x] Display the results (`inserted_chunks`, `processed_files`) and a success/error toast.

- [x] **2.4: Index Info Page (`/index/info`)**
    - [x] Fetch data from `/api/v1/nlp/index/info/{project_id}` when a project is selected.
    - [x] Display a loading state while fetching.
    - [x] Display an error message if the API call fails.
    - [x] Render the fetched `collection_info` in a clean, readable format (e.g., Card).

- [x] **2.5: Index Push Page (`/index/push`)**
    - [x] Create a button to trigger the indexing process.
    - [x] Add a toggle for `do_reset`.
    - [x] Call the `/api/v1/nlp/index/push/{project_id}` endpoint.
    - [x] Show a loading indicator during indexing and a success/error toast upon completion.
    - [x] After a successful push, automatically refresh the data on the Index Info page.

- [x] **2.6: Search Page (`/search`)**
    - [x] Create a form with a search input and a "limit" number input.
    - [x] Call `/api/v1/nlp/index/search/{project_id}` with the query.
    - [x] Display a loading state during the search.
    - [x] Render the search results in a list of cards, showing the content and score of each result.

- [x] **2.7: Q&A Page (`/qa`)**
    - [x] Create a chat-style interface.
    - [x] On message submit, call `/api/v1/nlp/index/answer/{project_id}`.
    - [x] Display a "thinking..." indicator while waiting for the response.
    - [x] Display the user's question and the bot's answer in the chat history.
    - [x] Add an option to view the `full_prompt` for debugging.

---

## Phase 3: Polish & Finalization

- [x] **3.1: Global Components:**
    - [x] Implement a global `Toaster` component for notifications (e.g., from `sonner`).
    - [x] Ensure all pages show a message or redirect if no `selectedProject` is chosen.

- [x] **3.2: Error & Loading States:**
    - [x] Review all pages to ensure consistent loading indicators (e.g., skeletons, spinners).
    - [x] Review all pages for consistent error handling and user-friendly messages.
    - [x] Add "empty states" where applicable (e.g., no projects found, no search results).

- [x] **3.3: Final Cleanup:**
    - [x] Remove all console.log statements used for debugging.
    - [x] Verify all UI elements are styled correctly and consistently.

--- 