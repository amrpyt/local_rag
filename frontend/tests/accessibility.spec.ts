import { test, expect } from '@playwright/test';

test.describe('Accessibility: Keyboard Navigation', () => {
  test('Project selector should be fully keyboard accessible', async ({ page }) => {
    // Mock the API response to ensure the test is stable and fast
    await page.route('**/api/v1/projects/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          projects: [
            { id: 1, name: 'Project 1' },
            { id: 2, name: 'Project 2' },
          ],
        }),
      });
    });

    await page.goto('/');

    // Wait for the projects to load and select the combobox by its ARIA role
    const projectSelector = page.getByRole('combobox');
    await expect(projectSelector).toBeVisible();
    await expect(projectSelector).toHaveText('Project 1'); // The component defaults to the first project

    // Focus the selector and check it's focused
    await projectSelector.focus();
    await expect(projectSelector).toBeFocused();

    // Open the dropdown with Enter
    await projectSelector.press('Enter');

    // Check that the first item is visible and selected
    const firstItem = page.getByRole('option', { name: 'Project 1' });
    await expect(firstItem).toBeVisible();
    await expect(firstItem).toHaveAttribute('aria-selected', 'true');

    // Navigate to the second item and check that it's selected
    await projectSelector.press('ArrowDown');
    const secondItem = page.getByRole('option', { name: 'Project 2' });
    await expect(secondItem).toBeVisible();
    await expect(secondItem).toHaveAttribute('aria-selected', 'true');

    // Select the second item with Enter
    await projectSelector.press('Enter');

    // The selector should now show the second item
    await expect(projectSelector).toHaveText('Project 2');
  });
}); 