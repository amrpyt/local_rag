# Mini-RAG Frontend

This is the frontend for the Mini-RAG application, a minimal implementation of Retrieval-Augmented Generation (RAG) for question answering.

## Overview

The frontend is built with:
- **React** with **Vite** for fast development
- **Shadcn/UI** components (based on Tailwind CSS)
- **React Router** for navigation
- **Axios** for API communication
- **Playwright** for end-to-end testing

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

- `src/api/`: API client and service functions
- `src/components/`: UI components
  - `layout/`: Layout components (header, sidebar, etc.)
  - `ui/`: Shadcn/UI components
- `src/context/`: React context providers
- `src/lib/`: Utility functions
- `src/pages/`: Page components
- `src/styles/`: Global styles
- `tests/`: End-to-end tests with Playwright

## API Integration

The frontend communicates with the backend API at `http://173.212.254.228:3001` through a Vite proxy configuration. All API requests are prefixed with `/api/v1/`.

## End-to-End Testing

The application includes end-to-end tests using Playwright. These tests verify that the application works correctly from a user's perspective.

### Running Tests

To run the tests:

1. Install Playwright browsers:
```bash
npx playwright install
```

2. Run the tests:
```bash
npm test
```

3. Run tests with UI mode:
```bash
npm run test:ui
```

4. Debug tests:
```bash
npm run test:debug
```

### Test Structure

- `dashboard.spec.ts`: Tests for the dashboard page
- `navigation.spec.ts`: Tests for navigation between pages

For more details, see the [tests/README.md](tests/README.md) file.

## Troubleshooting

### API Connection Issues

If you experience issues with API connectivity:

1. Check the browser console for errors
2. Verify that the Vite proxy is correctly configured in `vite.config.ts`
3. Test direct API access using the diagnostic tools on the dashboard
4. Check CORS settings if accessing the API directly

### Project Selector Issues

If the project selector is not working:

1. Check that the API endpoint `/api/v1/projects/` is returning data
2. Verify that the ProjectContext is properly initialized
3. Check the browser console for errors in the project fetching logic
4. Try using the SimpleProjectSelector component as a fallback

### Diagnostic Tools

The dashboard includes diagnostic tools to help troubleshoot API connectivity:

- **TestApiComponent**: Tests API connectivity through the Axios client
- **DirectApiTest**: Tests both direct and proxied API calls using the fetch API

## Recent Fixes

1. **Enhanced API Client:**
   - Added request/response interceptors for better debugging
   - Implemented timeout settings
   - Added comprehensive error handling

2. **Improved ProjectSelector Component:**
   - Created both standard and simplified versions
   - Added loading states and error handling
   - Fixed state management issues
   - Implemented localStorage persistence for selected project

3. **Vite Proxy Configuration:**
   - Enhanced proxy settings with detailed logging
   - Added error handling for proxy failures
   - Configured proper rewrite rules

4. **State Management:**
   - Updated ProjectContext to properly persist selected project
   - Fixed dependency arrays in useEffect hooks
   - Added proper state initialization from localStorage 