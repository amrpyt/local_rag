# Mini-RAG Frontend Tests

This directory contains end-to-end tests for the Mini-RAG frontend application using Playwright.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

To run all tests:
```bash
npm test
```

To run tests with UI mode:
```bash
npm run test:ui
```

To debug tests:
```bash
npm run test:debug
```

## Test Structure

- `dashboard.spec.ts` - Tests for the dashboard page

## Adding New Tests

1. Create a new file in the `tests` directory with the `.spec.ts` extension
2. Follow the pattern in existing tests
3. Run the tests to verify they pass

## CI Integration

The tests are configured to run in CI environments. The configuration is in `playwright.config.ts`. 