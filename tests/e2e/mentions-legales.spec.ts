import { test, expect } from '@playwright/test';

test.describe('Page Mentions Légales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mentions-legales');
  });

  test('la page se charge sans erreur', async ({ page }) => {
    await expect(page).not.toHaveURL(/404/);
  });

  test('affiche un H1', async ({ page }) => {
    // Cibler le H1 dans le contenu principal de la page
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('contient les mentions légales obligatoires', async ({ page }) => {
    await expect(page.getByText(/éditeur/i).or(page.getByText(/brainvix/i)).first()).toBeVisible();
  });

  test('contient un lien de retour vers l\'accueil', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: /accueil|home/i })
      .or(page.locator('a[href="/"]'))
      .first();
    await expect(homeLink).toBeAttached();
  });
});
