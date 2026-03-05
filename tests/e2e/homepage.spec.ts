import { test, expect } from '@playwright/test';

test.describe('Homepage - Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('affiche le bon titre de page', async ({ page }) => {
    await expect(page).toHaveTitle(/Brainvix/i);
  });

  test('affiche le H1 principal', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('test digital');
  });

  test('affiche le sous-titre hero', async ({ page }) => {
    await expect(page.getByText('Simple. Fiable. Validé scientifiquement.')).toBeVisible();
  });

  test('contient une vidéo en arrière-plan', async ({ page }) => {
    const video = page.locator('video');
    await expect(video).toBeAttached();
  });
});

test.describe('Homepage - Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('affiche les 3 statistiques clés (SUS, sensibilité, spécificité)', async ({ page }) => {
    await expect(page.getByText('92')).toBeVisible();
    await expect(page.getByText('97')).toBeVisible();
    await expect(page.getByText('91')).toBeVisible();
  });

  test('affiche la section Alzheimer avec les chiffres clés', async ({ page }) => {
    await expect(page.getByText(/alzheimer/i).first()).toBeVisible();
    await expect(page.getByText('10')).toBeVisible(); // 10M cas
    await expect(page.getByText('75')).toBeVisible(); // 75% non diagnostiqués
    await expect(page.getByText('36')).toBeVisible(); // 36 mois
  });

  test('affiche la section "Comment fonctionne le BCD" avec les 3 phases', async ({ page }) => {
    await expect(page.getByText(/comment fonctionne/i)).toBeVisible();
    await expect(page.getByText(/phase 1/i)).toBeVisible();
    await expect(page.getByText(/phase 2/i)).toBeVisible();
    await expect(page.getByText(/phase 3/i)).toBeVisible();
  });

  test('affiche la section validation scientifique', async ({ page }) => {
    await expect(page.getByText(/validation scientifique/i)).toBeVisible();
    await expect(page.getByText(/129 participants/i)).toBeVisible();
  });

  test('affiche la section offre B2B', async ({ page }) => {
    await expect(page.getByText(/institutions/i).first()).toBeVisible();
    await expect(page.getByText(/marque blanche/i)).toBeVisible();
  });

  test('affiche les 3 membres de l\'équipe', async ({ page }) => {
    await expect(page.getByText(/Bruno Dubois/i)).toBeVisible();
    await expect(page.getByText(/Pierre Foulon/i)).toBeVisible();
    await expect(page.getByText(/Rafik/i)).toBeVisible();
  });
});

test.describe('Homepage - Formulaire de contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('affiche le formulaire de contact', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('le formulaire contient les champs obligatoires', async ({ page }) => {
    await expect(page.locator('input[name="name"], input[name="nom"]')).toBeAttached();
    await expect(page.locator('input[type="email"]')).toBeAttached();
    await expect(page.locator('textarea')).toBeAttached();
  });

  test('le bouton de soumission est présent', async ({ page }) => {
    await expect(page.locator('form button[type="submit"]')).toBeVisible();
  });

  test('affiche une erreur si l\'email est invalide', async ({ page }) => {
    await page.locator('input[type="email"]').fill('email-invalide');
    await page.locator('form button[type="submit"]').click();
    // HTML5 validation ou message d'erreur custom
    const emailInput = page.locator('input[type="email"]');
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBe(false);
  });
});

test.describe('Homepage - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('le logo est visible', async ({ page }) => {
    const logo = page.locator('header img, header svg, #logo').first();
    await expect(logo).toBeVisible();
  });

  test('le lien "Demander une démo" pointe vers la section contact', async ({ page }) => {
    const demoLink = page.getByRole('link', { name: /démo/i }).first();
    await expect(demoLink).toHaveAttribute('href', /#contact/);
  });

  test('le footer contient le lien mentions légales', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /mentions légales/i })).toBeAttached();
  });
});

test.describe('Homepage - Accessibilité et SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('la page a une meta description', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toBeAttached();
    const content = await metaDesc.getAttribute('content');
    expect(content?.length).toBeGreaterThan(50);
  });

  test('les images ont des attributs alt', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} manque un attribut alt`).not.toBeNull();
    }
  });

  test('le viewport autorise le zoom utilisateur', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');
    expect(content).not.toContain('user-scalable=no');
    expect(content).not.toContain('user-scalable=0');
  });

  test('les balises Open Graph sont présentes', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toBeAttached();
    await expect(page.locator('meta[property="og:description"]')).toBeAttached();
    await expect(page.locator('meta[property="og:image"]')).toBeAttached();
  });

  test('un seul H1 sur la page', async ({ page }) => {
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });
});

test.describe('Homepage - Mobile', () => {
  test('s\'affiche correctement sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
  });
});
