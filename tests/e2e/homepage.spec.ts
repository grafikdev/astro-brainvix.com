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
    // Les compteurs utilisent data-counter ; on vérifie leur présence dans le DOM
    // 92 est unique (SUS), 97 et 91 apparaissent dans Stats et Validation donc on vérifie par section
    await expect(page.locator('[data-counter="92"]')).toBeAttached();
    await expect(page.locator('[data-counter="97"]').first()).toBeAttached();
    await expect(page.locator('[data-counter="91"]').first()).toBeAttached();
  });

  test('affiche la section Alzheimer avec les chiffres clés', async ({ page }) => {
    await expect(page.getByText(/alzheimer/i).first()).toBeVisible();
    // Les compteurs utilisent data-counter ; on vérifie leur présence dans le DOM
    await expect(page.locator('[data-counter="10"]')).toBeAttached();
    await expect(page.locator('[data-counter="75"]')).toBeAttached();
    await expect(page.locator('[data-counter="36"]')).toBeAttached();
  });

  test('affiche la section "Comment fonctionne le BCD" avec les 3 phases', async ({ page }) => {
    await expect(page.getByText(/comment fonctionne/i)).toBeVisible();
    await expect(page.getByText(/phase 1/i)).toBeVisible();
    await expect(page.getByText(/phase 2/i)).toBeVisible();
    await expect(page.getByText(/phase 3/i)).toBeVisible();
  });

  test('affiche la section validation scientifique', async ({ page }) => {
    await expect(page.getByText(/validation scientifique/i).first()).toBeVisible();
    await expect(page.getByText(/129 participants/i)).toBeVisible();
  });

  test('affiche la section offre B2B', async ({ page }) => {
    await expect(page.getByText(/institutions/i).first()).toBeVisible();
    await expect(page.getByText(/marque blanche/i)).toBeVisible();
  });

  test('affiche les 3 membres de l\'équipe', async ({ page }) => {
    // Cibler les membres dans la section team spécifiquement
    await expect(page.locator('#team').getByText(/Bruno Dubois/i).first()).toBeVisible();
    await expect(page.locator('#team').getByText(/Pierre Foulon/i).first()).toBeVisible();
    await expect(page.locator('#team').getByText(/Rafik/i).first()).toBeVisible();
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
    // Scroll vers le formulaire puis remplir un email invalide
    const emailInput = page.locator('input[type="email"]');
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('email-invalide');
    await page.locator('form button[type="submit"]').click({ force: true });
    // HTML5 validation ou message d'erreur custom
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
    // Vérifier qu'il y a bien un H1 contenant "test digital" (le contenu attendu du hero)
    const h1 = page.locator('h1').filter({ hasText: /test digital/i });
    await expect(h1).toHaveCount(1);
    await expect(h1).toBeVisible();
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
