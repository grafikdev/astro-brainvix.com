import { test, expect } from '@playwright/test';

test.describe('Performance et ressources', () => {
  test('la homepage répond en moins de 3 secondes', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  test('aucune ressource 404 sur la homepage', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', response => {
      if (response.status() === 404) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedRequests, `Ressources manquantes:\n${failedRequests.join('\n')}`).toHaveLength(0);
  });

  test('pas d\'erreur console JavaScript', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors, `Erreurs JS:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('le CSS est chargé (la page n\'est pas non stylisée)', async ({ page }) => {
    await page.goto('/');
    const bgColor = await page.evaluate(() => {
      const body = document.querySelector('body');
      return window.getComputedStyle(body!).backgroundColor;
    });
    // La couleur de fond ne doit pas être la valeur par défaut "rgba(0, 0, 0, 0)"
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
