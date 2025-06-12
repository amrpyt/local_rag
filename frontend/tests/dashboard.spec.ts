import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('should load correctly with all key elements', async ({ page }) => {
    // Navigate to the dashboard page
    await page.goto('/');
    
    // Verify that the Dashboard heading is visible
    await expect(page.locator('h2', { hasText: 'Dashboard' })).toBeVisible();
    
    // Verify that the Refresh Data button is visible
    await expect(page.getByRole('button', { name: 'Refresh Data' })).toBeVisible();
    
    // Verify that the Documents and Queries statistics are displayed
    await expect(page.getByText('Documents')).toBeVisible();
    await expect(page.getByText('Queries')).toBeVisible();
    
    // Verify that the Quick Actions section is visible
    await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
    
    // Verify that at least one action card is visible (Upload Documents)
    await expect(page.getByRole('heading', { name: 'Upload Documents' })).toBeVisible();
  });
}); 