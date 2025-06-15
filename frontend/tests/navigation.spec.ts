import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard page and wait for layout
    await page.goto('/');
    await expect(page.getByTestId('sidebar')).toBeVisible({ timeout: 20000 });
  });

  test('should navigate to Upload page', async ({ page }) => {
    // Click on the Upload link in the sidebar
    await page.getByRole('link', { name: 'Upload' }).click();
    
    // Verify that we are on the Upload page
    await expect(page).toHaveURL(/\/upload/);
  });

  test('should navigate to Process page', async ({ page }) => {
    // Click on the Process link in the sidebar
    await page.getByRole('link', { name: 'Process' }).click();
    
    // Verify that we are on the Process page
    await expect(page).toHaveURL(/\/process/);
  });

  test('should navigate to Search page', async ({ page }) => {
    // Click on the Search link in the sidebar
    await page.getByRole('link', { name: 'Search' }).click();
    
    // Verify that we are on the Search page
    await expect(page).toHaveURL(/\/search/);
  });

  test('should navigate to Q&A page', async ({ page }) => {
    // Click on the Q&A link in the sidebar
    await page.getByRole('link', { name: 'Q&A' }).click();
    
    // Verify that we are on the Q&A page
    await expect(page).toHaveURL(/\/qa/);
  });
}); 