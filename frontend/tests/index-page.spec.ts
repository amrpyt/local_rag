import { test, expect } from '@playwright/test';

test.describe('Index Management Page', () => {
  // Navigate to the page before each test
  test.beforeEach(async ({ page }) => {
    // Navigate and wait for the page to be generally ready
    await page.goto('http://localhost:3001/index');
    await expect(page.getByRole('heading', { name: 'Index Management' })).toBeVisible();
  });

  test('should successfully push an index and verify the record count', async ({ page }) => {
    // Intercept the projects API call and wait for it to finish before proceeding
    await page.waitForResponse(resp => resp.url().includes('/api/v1/projects') && resp.status() === 200);

    // 1. Select the project from the dropdown
    const projectSelector = page.getByRole('combobox', { name: 'Select a project' });
    await expect(projectSelector).toBeEnabled({ timeout: 5000 }); // Should be enabled now
    await projectSelector.click();
    await page.getByRole('option', { name: 'test with jimmy' }).click();

    // 2. Navigate to the Push to Index tab
    await page.getByRole('tab', { name: 'Push to Index' }).click();

    // 3. Click the button to start indexing and wait for the success toast
    await page.getByRole('button', { name: /Push Project/ }).click();
    await expect(page.getByText(/Successfully indexed \d+ items./)).toBeVisible({ timeout: 20000 }); // Longer timeout for indexing

    // 4. Navigate back to the Index Info tab
    await page.getByRole('tab', { name: 'Index Info' }).click();
    
    // 5. Explicitly click the refresh button to ensure we get the latest data
    await page.getByRole('button', { name: 'Refresh' }).click();

    // 6. Verify the record count using the data-testid
    await expect(page.getByTestId('total-records')).toHaveText('33');
  });
}); 