# End-to-End Frontend Testing Plan & Results

This document outlines the end-to-end (E2E) testing plan for the Mini-RAG frontend and records the results of each test case.

**Testing Tool:** Playwright (via `mcp_playwright`)
**Objective:** To verify that every component and user flow is working as expected.

---

## Part 1: Core Functionality

### 1.1. Application Load & Project Fetching
- **Test:**
    1. Launch the browser and navigate to the application's URL.
    2. Observe the initial state of the `ProjectSelector`.
- **Expected Result:**
    - The application loads the Dashboard page without any console errors.
    - The `ProjectSelector` initially shows "Loading...", then fetches projects from the API and displays the first project, or "No projects found" if the API returns an empty list.
- **Actual Result:** `[PENDING]`

### 1.2. Project Selection
- **Test:**
    1. Click on the `ProjectSelector`.
    2. Select a different project from the dropdown list.
- **Expected Result:**
    - The `ProjectSelector` updates to show the newly selected project.
    - The application state updates, and subsequent API calls should use the new `project_id`.
    - All page components (inputs, buttons) become enabled.
- **Actual Result:** `[PENDING]`

---

## Part 2: Page-by-Page E2E Tests

### 2.1. Upload Page (`/upload`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Upload" page from the sidebar without selecting a project.
    - **Expected Result:** The page displays a warning "Please select a project...". The file dropzone and upload button are disabled.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Successful File Upload**
    - **Action:** Select a project, navigate to the "Upload" page, drop a file into the dropzone, and click "Upload".
    - **Expected Result:** The file appears in the list. The upload button shows a loading state. A success toast appears. The file list is cleared post-upload.
    - **Actual Result:** `[PENDING]`

### 2.2. Process Page (`/process`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Process" page without selecting a project.
    - **Expected Result:** The page displays a warning. All form inputs and the "Process" button are disabled.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Successful Processing**
    - **Action:** Select a project, navigate to "Process", and click "Process Project".
    - **Expected Result:** The button shows a loading state. A success toast appears, and a result card shows the count of processed files and inserted chunks.
    - **Actual Result:** `[PENDING]`

### 2.3. Index Info Page (`/index/info`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Index Info" page without selecting a project.
    - **Expected Result:** The page displays a "No Project Selected" message.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Fetch and Refresh**
    - **Action:** Select a project, navigate to "Index Info", and observe the data. Click the "Refresh" button.
    - **Expected Result:** Loading skeletons appear, then data is displayed in cards. Clicking "Refresh" repeats this process.
    - **Actual Result:** `[PENDING]`

### 2.4. Index Push Page (`/index/push`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Index Push" page without selecting a project.
    - **Expected Result:** A warning is displayed, and the controls are disabled.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Successful Push**
    - **Action:** Select a project, navigate to "Index Push", and click the "Push Project..." button.
    - **Expected Result:** The button shows a loading state. A success toast appears, and a result card shows the count of inserted items.
    - **Actual Result:** `[PENDING]`

### 2.5. Search Page (`/search`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Search" page without selecting a project.
    - **Expected Result:** A warning is displayed, and search controls are disabled.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Successful Search**
    - **Action:** Select a project, enter "test" in the search box, and click "Search".
    - **Expected Result:** Loading skeletons appear, then result cards are displayed.
    - **Actual Result:** `[PENDING]`
- **Test Case 3: No Results Found**
    - **Action:** Search for a nonsensical query.
    - **Expected Result:** A "No Results Found" message is displayed.
    - **Actual Result:** `[PENDING]`

### 2.6. Q&A Page (`/qa`)
- **Test Case 1: No Project Selected**
    - **Action:** Navigate to the "Q&A" page without selecting a project.
    - **Expected Result:** A warning is displayed in the chat window, and the input is disabled.
    - **Actual Result:** `[PENDING]`
- **Test Case 2: Successful Interaction**
    - **Action:** Select a project, type "hello" in the input, and send.
    - **Expected Result:** The user's message appears. A "Thinking..." indicator is shown, followed by the bot's response. The "View Sources" accordion is present.
    - **Actual Result:** `[PENDING]`

--- 