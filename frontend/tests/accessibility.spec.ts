import { test, expect } from '@playwright/test';

test.describe('Accessibility: Keyboard Navigation', () => {
  test('Project selector should be fully keyboard accessible', async ({ page }) => {
    // Create a unique project name to ensure no cross-test contamination
    const uniqueProjectName = `AccessTest-${Date.now()}`;
    await page.getByTestId('new-project-btn').first().click();
    await page.getByLabel('Project Name').fill(uniqueProjectName);
    await page.getByRole('button', { name: 'Create Project' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();

    const projectSelector = page.getByRole('combobox');
    await expect(projectSelector).toBeVisible();
    // Verify that the newly created project is now displayed in the selector
    await expect(projectSelector).toHaveText(uniqueProjectName);

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