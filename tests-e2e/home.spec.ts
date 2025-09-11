import { test, expect } from '@playwright/test'
 test('home renders and is visible', async ({ page }) => {
  await page.goto(process.env.E2E_BASE_URL || 'http://localhost:3000')
  await expect(page.getByRole('heading', { name: 'Genesis ReLoop' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enter Marketplace' })).toBeVisible()
 })
