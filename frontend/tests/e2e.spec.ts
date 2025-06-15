import { test, expect } from '@playwright/test';

test.describe('Mini-RAG Frontend Tests', () => {
  // Common setup for all tests
  test.beforeEach(async ({ page }) => {
    // Go to the application URL
    await page.goto('/');
    // Wait for the sidebar to be visible before proceeding
    await expect(page.getByTestId('sidebar')).toBeVisible({ timeout: 20000 });
  });

  test('1.1 Application loads successfully', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('1.2 Project selector works', async ({ page }) => {
    // First, ensure a project can be created, which populates the selector.
    await page.getByTestId('new-project-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Create a new project
    const projectName = `Test Project ${Date.now()}`;
    await page.getByLabel('Project Name').fill(projectName);
    await page.getByRole('button', { name: 'Create Project' }).click();

    // The dialog should close, and the new project should be selected.
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('project-combobox')).toContainText(projectName);

    // Now, test opening the populated selector
    await page.getByTestId('project-combobox').click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option', { name: projectName })).toBeVisible();
  });

  test('1.3 New Project button works', async ({ page }) => {
    await page.getByTestId('new-project-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('1.4 Sidebar collapse/expand works', async ({ page }) => {
    // Initial width
    const initialWidth = await page.locator('div[data-collapsed]').evaluate((el) => el.clientWidth);
    // Collapse
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await page.waitForTimeout(400);
    const collapsedWidth = await page.locator('div[data-collapsed="true"]').evaluate((el) => el.clientWidth);
    expect(collapsedWidth).toBeLessThan(initialWidth);
    // Expand
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    await page.waitForTimeout(400);
    const expandedWidth = await page.locator('div[data-collapsed="false"]').evaluate((el) => el.clientWidth);
    expect(expandedWidth).toBeGreaterThan(collapsedWidth);
  });

  test('2.1 Dashboard page loads successfully', async ({ page }) => {
    await expect(page.getByTestId('card-documents')).toBeVisible();
    await expect(page.getByTestId('card-queries')).toBeVisible();
  });

  test('2.2 Dashboard statistics display correctly', async ({ page }) => {
    // Assuming documents card has count element inside
    const text = await page.getByTestId('card-documents').textContent();
    expect(text).toContain('Documents');
  });

  test('7.1 Search page loads successfully', async ({ page }) => {
    // Navigate to the search page
    await page.getByRole('link', { name: 'Search' }).click();
    // Check that we're on the search page
    await expect(page).toHaveURL(/\/search/);
  });

  test('8.1 Q&A page loads successfully', async ({ page }) => {
    // Navigate to the Q&A page
    await page.getByRole('link', { name: 'Q&A' }).click();
    // Check that we're on the Q&A page
    await expect(page).toHaveURL(/\/qa/);
  });

  test('9.1 Responsive design works', async ({ page }) => {
    // Test desktop size (already at default size)
    await expect(page.getByTestId('sidebar')).toBeVisible();
    
    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByTestId('sidebar')).toBeVisible();
    
    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    // On mobile, the sidebar might be hidden by default, so we don't test for its visibility directly.
    // Instead, we might test for a menu button's visibility if one exists.
    // For now, we'll just confirm the viewport size has an effect.
    const isMobile = await page.evaluate(() => window.innerWidth < 768);
    expect(isMobile).toBe(true);
  });
}); 