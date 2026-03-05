# Site Astro brainvix.com — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reproduire fidèlement le site WordPress brainvix.com en Astro statique avec Tailwind + CSS custom, formulaire via Lambda AWS.

**Architecture:** Astro pur (zéro framework JS client), composants `.astro` par section, Tailwind pour layout/spacing, CSS custom pour animations (compteurs, fade-in, scribble SVG), formulaire contactant une Lambda via `fetch`.

**Tech Stack:** Astro 5, Tailwind CSS, Playwright, Vitest, TypeScript strict.

---

### Task 1 : Setup Tailwind + copie des assets

**Files:**
- Modify: `astro.config.mjs`
- Modify: `package.json`
- Create: `public/assets/images/` (dossier)
- Create: `public/assets/videos/` (dossier)

**Step 1: Installer Tailwind**

```bash
npx astro add tailwind --yes
```

Expected: modifie `astro.config.mjs`, crée `tailwind.config.mjs`.

**Step 2: Copier les assets depuis l'export WordPress**

```bash
mkdir -p public/assets/images public/assets/videos

# Images clés
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/BCD-logosite.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/BCDSite-Favicon.png public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/BCD-capture.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/bruno-dubois-brainvix2.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/pierre-foulon-brainvix2.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/rafik-goulamhoussen-brainvix.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/09/tabletteBCD2-scaled.png public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/07/scenedevie.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/07/PrDubois.webp public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/08/cerveau.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/08/tablettehommeBCD.png public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/08/etudeclinique.jpg public/assets/images/
cp ../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/08/Firefly_A-close-up-of-a-young-white-person-with-fair-skin-and-light-brown-or-blond-hair-focu-437598.jpg public/assets/images/person.jpg

# Vidéos
cp "../../brainvix-com-20260305-155418-u0yt7gbbvhap/uploads/2025/08/Firefly-Top-down-view-of-a-calm-urban-street-in-the-early-morning-light.-Elderly-people-walk-slowly.mp4" public/assets/videos/hero.mp4
```

**Step 3: Configurer tailwind.config.mjs**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#33335e',
        blue: '#3452FF',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
};
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind CSS and copy WordPress assets"
```

---

### Task 2 : Styles globaux et animations

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/animations.css`
- Create: `src/utils/counter.ts`

**Step 1: global.css**

```css
/* src/styles/global.css */
@import './animations.css';

:root {
  --navy: #33335e;
  --blue: #3452FF;
  --white: #ffffff;
  --gray: #aaaaaa;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Open Sans', sans-serif;
  font-weight: 400;
  color: var(--navy);
  background: var(--white);
}

h1, h2, h3, h4, h5 {
  line-height: 1.2;
}

img {
  max-width: 100%;
  height: auto;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
```

**Step 2: animations.css**

```css
/* src/styles/animations.css */

/* Fade-in on scroll */
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-delay-1 { transition-delay: 0.1s; }
.fade-in-delay-2 { transition-delay: 0.2s; }
.fade-in-delay-3 { transition-delay: 0.3s; }

/* Scribble SVG underline */
.scribble-text {
  position: relative;
  display: inline-block;
}

.nectar-scribble path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.scribble-text.animate .nectar-scribble path {
  animation: drawScribble 0.8s ease forwards;
}

@keyframes drawScribble {
  to { stroke-dashoffset: 0; }
}

/* Counter */
.counter-number {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
}

/* Video hero overlay */
.video-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(51, 51, 94, 0.6);
}
```

**Step 3: counter.ts**

```ts
// src/utils/counter.ts
export function animateCounter(el: HTMLElement, target: number, duration = 1500) {
  const start = performance.now();
  const update = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

export function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.counter ?? '0', 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

export function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
}
```

**Step 4: Vérifier que les tests unitaires passent toujours**

```bash
npm test
```

Expected: 8/8 tests pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add global styles, animations CSS and counter utility"
```

---

### Task 3 : Layout — Header et Footer

**Files:**
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/layouts/Base.astro`

**Step 1: Base.astro**

```astro
---
// src/layouts/Base.astro
import '../styles/global.css';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const { title, description, ogImage = '/assets/images/BCD-logosite.jpg' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/assets/images/BCDSite-Favicon.png" />
    <!-- Google Fonts avec preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 2: Header.astro**

```astro
---
// src/components/layout/Header.astro
---

<header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
  <div class="section-container flex items-center justify-between py-4">
    <a href="/" id="logo" aria-label="Brainvix - BCD, retour à l'accueil">
      <img
        src="/assets/images/BCD-logosite.jpg"
        alt="Brainvix - BCD"
        width="160"
        height="87"
        class="h-10 w-auto"
      />
    </a>
    <nav aria-label="Menu principal">
      <ul class="hidden md:flex gap-8 list-none items-center">
        <li><a href="#alzheimer" class="text-navy hover:text-blue transition-colors font-semibold text-sm">Le BCD</a></li>
        <li><a href="#steps" class="text-navy hover:text-blue transition-colors font-semibold text-sm">Comment ça marche</a></li>
        <li><a href="#offre" class="text-navy hover:text-blue transition-colors font-semibold text-sm">Offre</a></li>
        <li><a href="#team" class="text-navy hover:text-blue transition-colors font-semibold text-sm">Équipe</a></li>
        <li>
          <a
            href="#contact"
            class="bg-blue text-white px-6 py-2 rounded font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Demander une démo
          </a>
        </li>
      </ul>
      <!-- Mobile menu button -->
      <button
        id="mobile-menu-btn"
        class="md:hidden p-2"
        aria-label="Ouvrir le menu"
        aria-expanded="false"
      >
        <span class="block w-6 h-0.5 bg-navy mb-1.5"></span>
        <span class="block w-6 h-0.5 bg-navy mb-1.5"></span>
        <span class="block w-6 h-0.5 bg-navy"></span>
      </button>
    </nav>
  </div>
  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-100">
    <ul class="section-container py-4 flex flex-col gap-4 list-none">
      <li><a href="#alzheimer" class="text-navy font-semibold">Le BCD</a></li>
      <li><a href="#steps" class="text-navy font-semibold">Comment ça marche</a></li>
      <li><a href="#offre" class="text-navy font-semibold">Offre</a></li>
      <li><a href="#team" class="text-navy font-semibold">Équipe</a></li>
      <li><a href="#contact" class="text-blue font-bold">Demander une démo</a></li>
    </ul>
  </div>
</header>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    const isOpen = !menu?.classList.contains('hidden');
    menu?.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
</script>
```

**Step 3: Footer.astro**

```astro
---
// src/components/layout/Footer.astro
---

<footer class="bg-navy text-white py-8">
  <div class="section-container flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
    <p>© {new Date().getFullYear()} Brainvix. Tous droits réservés.</p>
    <nav aria-label="Menu footer">
      <ul class="flex gap-6 list-none">
        <li>
          <a href="/mentions-legales" class="hover:underline opacity-80 hover:opacity-100 transition-opacity">
            Mentions légales
          </a>
        </li>
        <li>
          <a href="#contact" class="hover:underline opacity-80 hover:opacity-100 transition-opacity">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  </div>
</footer>
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Base layout, Header and Footer components"
```

---

### Task 4 : Section Hero

**Files:**
- Create: `src/components/sections/Hero.astro`

**Step 1: Hero.astro**

```astro
---
// src/components/sections/Hero.astro
---

<section class="relative min-h-screen flex items-center justify-center overflow-hidden" style="background-color: #33335e;">
  <!-- Vidéo background -->
  <video
    class="absolute inset-0 w-full h-full object-cover opacity-40"
    autoplay
    muted
    loop
    playsinline
    preload="none"
  >
    <source src="/assets/videos/hero.mp4" type="video/mp4" />
  </video>

  <!-- Overlay -->
  <div class="video-overlay"></div>

  <!-- Contenu -->
  <div class="relative z-10 section-container text-white text-center py-32 pt-48">
    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto leading-tight mb-6">
      Le premier test digital validé pour le repérage des troubles cognitifs.
    </h1>
    <p class="text-xl md:text-2xl font-light mb-10 opacity-90">
      Simple. Fiable. Validé scientifiquement.
    </p>
    <a
      href="#contact"
      class="inline-block border-2 border-white text-white px-10 py-4 text-lg font-semibold hover:bg-white hover:text-navy transition-all duration-300"
    >
      Demander une démo
    </a>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Hero section with video background"
```

---

### Task 5 : Section Stats (fond bleu, compteurs animés)

**Files:**
- Create: `src/components/sections/Stats.astro`

**Step 1: Stats.astro**

```astro
---
// src/components/sections/Stats.astro
---

<section class="bg-blue text-white py-20">
  <div class="section-container">
    <p class="text-center text-xl md:text-2xl font-semibold max-w-2xl mx-auto mb-16 fade-in">
      Le BCD est le seul bilan cognitif digital validé scientifiquement, développé par Brainvix
      sous la direction médicale et scientifique du Pr Bruno Dubois.
    </p>
    <a
      href="#contact"
      class="block w-fit mx-auto border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-blue transition-all duration-300 mb-20 fade-in"
    >
      Demander une démo
    </a>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
      <div class="fade-in">
        <div class="counter-number">
          <span data-counter="92">0</span><sup class="text-3xl">/100</sup>
        </div>
        <p class="mt-4 text-lg opacity-90">Sur l'échelle de System Usability Scale (SUS).</p>
      </div>
      <div class="fade-in fade-in-delay-1">
        <div class="counter-number">
          <span data-counter="97">0</span><sup class="text-3xl">%</sup>
        </div>
        <p class="mt-4 text-lg opacity-90">Sensibilité</p>
      </div>
      <div class="fade-in fade-in-delay-2">
        <div class="counter-number">
          <span data-counter="91">0</span><sup class="text-3xl">%</sup>
        </div>
        <p class="mt-4 text-lg opacity-90">Spécificité</p>
      </div>
    </div>
  </div>
</section>

<script>
  import { initCounters, initFadeIn } from '../../utils/counter';
  initCounters();
  initFadeIn();
</script>
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Stats section with animated counters"
```

---

### Task 6 : Section Alzheimer

**Files:**
- Create: `src/components/sections/Alzheimer.astro`

**Step 1: Alzheimer.astro**

```astro
---
// src/components/sections/Alzheimer.astro
---

<section id="alzheimer" class="py-24 bg-white">
  <div class="section-container">
    <!-- Texte + image -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
      <div class="fade-in">
        <h2 class="text-3xl md:text-4xl font-bold text-navy mb-6">
          Pourquoi les plaintes mnésiques sont complexes à interpréter :
        </h2>
        <p class="text-gray-600 text-lg mb-8 max-w-xl">
          La plainte de mémoire est <strong>fréquente après 60 ans</strong>, mais elle est souvent
          liée aux troubles de l'attention, du sommeil, à la fatigue ou au stress.<br /><br />
          Cependant, elle peut aussi être le <strong>premier signe d'une maladie neuro-évolutive</strong>.
        </p>
        <h4 class="text-2xl font-bold text-navy">
          Le défi : savoir faire
          <span class="scribble-text">
            la différence.
            <svg class="nectar-scribble squiggle-underline absolute bottom-0 left-0 w-full" role="presentation" viewBox="-320 -70.8161 640.4 59.82" preserveAspectRatio="none" style="height:12px;">
              <path style="animation-duration:0.8s;" d="M-300,-56 C-50,-72 298,-65 300,-59 C332,-53 -239,-36 -255,-27 C-271,-18 -88,-24 91,-20" stroke="#3452FF" pathLength="1" stroke-width="11" fill="none"/>
            </svg>
          </span>
        </h4>
      </div>
      <div class="fade-in fade-in-delay-1">
        <img
          src="/assets/images/scenedevie.jpg"
          alt="Scène de repas de famille en extérieur"
          width="800"
          height="800"
          class="rounded-2xl w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Chiffres Alzheimer -->
    <h3 class="text-2xl font-bold text-navy text-center mb-12 fade-in">Alzheimer en quelques chiffres</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div class="fade-in">
        <div class="text-7xl font-bold" style="color: #3452FF;">
          <span data-counter="10">0</span>
        </div>
        <p class="mt-4 text-gray-600">millions de nouveaux cas de démence par an dans le monde</p>
      </div>
      <div class="fade-in fade-in-delay-1">
        <div class="text-7xl font-bold" style="color: #3452FF;">
          <span data-counter="75">0</span><span class="text-4xl">%</span>
        </div>
        <p class="mt-4 text-gray-600">des personnes atteintes de démence ne sont pas diagnostiquées</p>
      </div>
      <div class="fade-in fade-in-delay-2">
        <div class="text-7xl font-bold" style="color: #3452FF;">
          <span data-counter="36">0</span>
        </div>
        <p class="mt-4 text-gray-600">mois entre les premiers signes et le diagnostic</p>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Alzheimer section with stats and scribble effect"
```

---

### Task 7 : Section PourquoiBCD + HowItWorks

**Files:**
- Create: `src/components/sections/PourquoiBCD.astro`
- Create: `src/components/sections/HowItWorks.astro`

**Step 1: PourquoiBCD.astro**

```astro
---
// src/components/sections/PourquoiBCD.astro
---

<section class="py-24 bg-gray-50">
  <div class="section-container">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div class="fade-in order-2 md:order-1">
        <img
          src="/assets/images/tablettehommeBCD.png"
          alt="Homme avec une tablette utilisant le BCD"
          width="800"
          height="800"
          class="rounded-2xl w-full object-cover"
          loading="lazy"
        />
      </div>
      <div class="fade-in fade-in-delay-1 order-1 md:order-2">
        <h2 class="text-3xl md:text-4xl font-bold text-navy mb-6">Pourquoi le BCD ?</h2>
        <h4 class="text-xl font-bold text-navy mb-4">Rassurer ou orienter</h4>
        <p class="text-gray-600 mb-6">
          Le BCD permet de distinguer efficacement les troubles cognitifs débutants des variations
          normales du vieillissement, offrant une double utilité :
        </p>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="text-blue font-bold mt-0.5">✓</span>
            <span><strong>Rassurer</strong> quand il n'y a pas d'inquiétude réelle</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="text-blue font-bold mt-0.5">✓</span>
            <span><strong>Orienter rapidement</strong> en cas de suspicion</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 3 avantages -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24">
      <div class="text-center fade-in">
        <div class="w-16 h-16 rounded-full bg-blue flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="white" role="presentation">
            <path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12-5.4 12-12 12zm-1-7.4l-3.3-3.3-1.4 1.4L15 23l9-9-1.4-1.4-8.6 8z"/>
          </svg>
        </div>
        <h4 class="font-bold text-navy text-lg mb-2">Rapidité d'exécution</h4>
        <p class="text-gray-500 text-sm">Test complet en seulement 5 minutes, adapté aux contraintes du quotidien médical.</p>
      </div>
      <div class="text-center fade-in fade-in-delay-1">
        <div class="w-16 h-16 rounded-full bg-blue flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="white" role="presentation">
            <path d="M18.5 26.5h-5c-5.8 0-5.9-15-5.9-15.7 0-4.8 4.8-8.9 8.2-10 .1 0 .3 0 .4 0 3.4 1.1 8.2 5.1 8.2 9.9 0 .6-.1 15.8-5.9 15.8zM16 2.2c-3 1-7.1 4.6-7.1 8.6 0 6 1.4 14.3 4.5 14.3h5.1c3.1 0 4.5-8.4 4.5-14.4 0-4-4.1-7.5-7.1-8.5z"/>
          </svg>
        </div>
        <h4 class="font-bold text-navy text-lg mb-2">Simplicité d'usage</h4>
        <p class="text-gray-500 text-sm">Interface intuitive, aucune formation spécifique requise pour la supervision du test.</p>
      </div>
      <div class="text-center fade-in fade-in-delay-2">
        <div class="w-16 h-16 rounded-full bg-blue flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="white" role="presentation">
            <path d="M16 4l3.1 6.3 6.9 1-5 4.9 1.2 6.9L16 19.7 9.8 23l1.2-6.9-5-4.9 6.9-1L16 4z"/>
          </svg>
        </div>
        <h4 class="font-bold text-navy text-lg mb-2">Fiabilité clinique</h4>
        <p class="text-gray-500 text-sm">97% de sensibilité et 91% de spécificité pour le diagnostic de la maladie d'Alzheimer.</p>
      </div>
    </div>
  </div>
</section>
```

**Step 2: HowItWorks.astro**

```astro
---
// src/components/sections/HowItWorks.astro
---

<section id="steps" class="py-24 bg-white">
  <div class="section-container">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-4 fade-in">
      Comment fonctionne le BCD ?
    </h2>
    <p class="text-center text-gray-500 mb-16 fade-in">
      Un processus en 3 phases optimisé pour détecter les troubles cognitifs avec précision et rapidité.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="text-center fade-in">
        <div class="text-6xl font-bold text-blue mb-4">1</div>
        <h3 class="text-xl font-bold text-navy mb-3">Phase 1 : Encodage</h3>
        <p class="text-gray-500">
          Le patient découvre une liste de mots associés à des images pour faciliter la mémorisation.
        </p>
        <div class="mt-6">
          <img
            src="/assets/images/BCD-capture.jpg"
            alt="Capture d'écran du BCD - phase encodage"
            class="rounded-xl mx-auto w-full max-w-xs"
            loading="lazy"
          />
        </div>
      </div>
      <div class="text-center fade-in fade-in-delay-1">
        <div class="text-6xl font-bold text-blue mb-4">2</div>
        <h3 class="text-xl font-bold text-navy mb-3">Phase 2 : Test NCT</h3>
        <p class="text-gray-500">
          Number Coding Test — évalue l'attention et la vitesse de traitement cognitif.
        </p>
      </div>
      <div class="text-center fade-in fade-in-delay-2">
        <div class="text-6xl font-bold text-blue mb-4">3</div>
        <h3 class="text-xl font-bold text-navy mb-3">Phase 3 : Rappel différé</h3>
        <p class="text-gray-500">
          Évaluation de la mémoire épisodique après un délai, indicateur clé de la maladie d'Alzheimer.
        </p>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add PourquoiBCD and HowItWorks sections"
```

---

### Task 8 : Sections Validation + Offre

**Files:**
- Create: `src/components/sections/Validation.astro`
- Create: `src/components/sections/Offre.astro`

**Step 1: Validation.astro**

```astro
---
// src/components/sections/Validation.astro
---

<section id="etudes" class="py-24 bg-gray-50">
  <div class="section-container">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-16 fade-in">
      Validation scientifique
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
      <div class="fade-in">
        <h3 class="text-xl font-bold text-navy mb-6">Étude clinique</h3>
        <ul class="space-y-4 text-gray-600">
          <li class="flex gap-3">
            <span class="text-blue font-bold">✓</span>
            <span><strong>129 participants</strong> incluant sujets contrôles et maladie d'Alzheimer biologiquement prouvée</span>
          </li>
          <li class="flex gap-3">
            <span class="text-blue font-bold">✓</span>
            <span>Comparaison directe avec évaluation neuropsychologique réalisée en centre expert</span>
          </li>
          <li class="flex gap-3">
            <span class="text-blue font-bold">✓</span>
            <span>Protocole approuvé par comité d'éthique</span>
          </li>
          <li class="flex gap-3">
            <span class="text-blue font-bold">✓</span>
            <span>Acceptabilité excellente : <strong>92/100</strong> à l'échelle SUS</span>
          </li>
        </ul>

        <div class="grid grid-cols-2 gap-8 mt-10">
          <div>
            <div class="text-5xl font-bold text-blue"><span data-counter="97">0</span>%</div>
            <p class="text-gray-500 mt-2">Spécificité</p>
          </div>
          <div>
            <div class="text-5xl font-bold text-blue"><span data-counter="91">0</span>%</div>
            <p class="text-gray-500 mt-2">Sensibilité</p>
          </div>
        </div>
      </div>

      <div class="fade-in fade-in-delay-1">
        <img
          src="/assets/images/etudeclinique.jpg"
          alt="Étude clinique du BCD"
          class="rounded-2xl w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Publications -->
    <div class="fade-in">
      <h3 class="text-xl font-bold text-navy mb-8 text-center">Publications scientifiques</h3>
      <p class="text-center text-gray-500 mb-8">
        Les résultats de nos études cliniques ont été publiés dans des revues scientifiques internationales à comité de lecture.
      </p>
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <a
          href="https://alzres.biomedcentral.com/articles/10.1186/s13195-023-01204-x"
          target="_blank"
          rel="noopener noreferrer"
          class="border border-navy text-navy px-6 py-3 rounded font-semibold hover:bg-navy hover:text-white transition-all text-center"
        >
          Alzheimer's Research &amp; Therapy
        </a>
        <a
          href="https://pubmed.ncbi.nlm.nih.gov/12467149/"
          target="_blank"
          rel="noopener noreferrer"
          class="border border-navy text-navy px-6 py-3 rounded font-semibold hover:bg-navy hover:text-white transition-all text-center"
        >
          La Presse Médicale
        </a>
      </div>
    </div>

    <!-- Citation -->
    <blockquote class="mt-16 bg-white rounded-2xl p-10 shadow-sm fade-in">
      <p class="text-lg text-gray-700 italic mb-6">
        "Le BCD représente une avancée majeure dans le repérage précoce des troubles cognitifs.
        Sa validation scientifique rigoureuse en fait un outil de confiance pour les professionnels de santé."
      </p>
      <div class="flex items-center gap-4">
        <img
          src="/assets/images/PrDubois.webp"
          alt="Pr Bruno Dubois"
          class="w-16 h-16 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p class="font-bold text-navy">Pr Bruno Dubois</p>
          <p class="text-gray-500 text-sm">Directeur scientifique</p>
        </div>
      </div>
    </blockquote>
  </div>
</section>
```

**Step 2: Offre.astro**

```astro
---
// src/components/sections/Offre.astro
---

<section id="offre" class="py-24 bg-white">
  <div class="section-container">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-4 fade-in">
      Offre pour les institutions
    </h2>
    <p class="text-center text-gray-500 mb-16 fade-in">
      Modèle B2B2C adapté aux besoins des mutuelles, caisses de retraite et organismes publics.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div class="space-y-8 fade-in">
        <div>
          <h3 class="text-xl font-bold text-navy mb-2">Avantages pour les institutions</h3>
        </div>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-blue flex-shrink-0 flex items-center justify-center text-white font-bold">€</div>
            <div>
              <h4 class="font-bold text-navy">Réduction des coûts</h4>
              <p class="text-gray-500 text-sm">Le repérage précoce permet une prise en charge précoce et une réduction des coûts de santé à long terme.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-blue flex-shrink-0 flex items-center justify-center text-white font-bold">★</div>
            <div>
              <h4 class="font-bold text-navy">Amélioration de la satisfaction</h4>
              <p class="text-gray-500 text-sm">Un service innovant avec un score d'excellence de 92/100 à l'échelle SUS.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-blue flex-shrink-0 flex items-center justify-center text-white font-bold">✓</div>
            <div>
              <h4 class="font-bold text-navy">Conformité réglementaire</h4>
              <p class="text-gray-500 text-sm">Outil médical validé scientifiquement respectant les standards de qualité et de sécurité.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6 fade-in fade-in-delay-1">
        <h3 class="text-xl font-bold text-navy">Intégration souple</h3>
        <div class="grid grid-cols-1 gap-4">
          <div class="border border-gray-200 rounded-xl p-6">
            <h4 class="font-bold text-navy mb-2">Marque blanche</h4>
            <p class="text-gray-500 text-sm">Intégration complète aux couleurs et à l'identité de votre institution</p>
          </div>
          <div class="border border-gray-200 rounded-xl p-6">
            <h4 class="font-bold text-navy mb-2">Co-branding</h4>
            <p class="text-gray-500 text-sm">Association de votre marque avec Brainvix pour valoriser l'innovation</p>
          </div>
        </div>
        <div class="mt-6">
          <img
            src="/assets/images/tabletteBCD2-scaled.png"
            alt="Interface du BCD sur tablette"
            class="rounded-2xl w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Validation scientifique and Offre sections"
```

---

### Task 9 : Section Team + Contact

**Files:**
- Create: `src/components/sections/Team.astro`
- Create: `src/components/sections/Contact.astro`

**Step 1: Team.astro**

```astro
---
// src/components/sections/Team.astro

const team = [
  {
    name: 'Pr Bruno Dubois',
    role: 'Directeur scientifique',
    photo: '/assets/images/bruno-dubois-brainvix2.jpg',
    linkedin: 'https://www.linkedin.com/in/bruno-dubois-8079aa127/',
  },
  {
    name: 'Pierre Foulon',
    role: 'Co-fondateur',
    photo: '/assets/images/pierre-foulon-brainvix2.jpg',
    linkedin: 'https://www.linkedin.com/in/pierre-foulon-7a539026/',
  },
  {
    name: 'Rafik Goulamhoussen',
    role: 'Co-fondateur & CTO',
    photo: '/assets/images/rafik-goulamhoussen-brainvix.jpg',
    linkedin: null,
  },
];
---

<section id="team" class="py-24 bg-gray-50">
  <div class="section-container">
    <h2 class="text-3xl md:text-4xl font-bold text-navy text-center mb-16 fade-in">Notre équipe</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      {team.map((member, i) => (
        <div class={`text-center fade-in ${i > 0 ? `fade-in-delay-${i}` : ''}`}>
          <img
            src={member.photo}
            alt={member.name}
            width="500"
            height="500"
            class="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg"
            loading="lazy"
          />
          <h3 class="text-xl font-bold text-navy">{member.name}</h3>
          <p class="text-gray-500 mt-1 mb-4">{member.role}</p>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Profil LinkedIn de ${member.name}`}
              class="inline-flex items-center gap-2 text-blue hover:underline text-sm font-semibold"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: Contact.astro**

```astro
---
// src/components/sections/Contact.astro
const apiUrl = import.meta.env.PUBLIC_CONTACT_API_URL;
const isProd = !!apiUrl;
---

<section id="contact" class="py-24 bg-navy text-white">
  <div class="section-container max-w-2xl">
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 fade-in">Demander une démo</h2>
    <p class="text-center opacity-80 mb-12 fade-in">
      Contactez-nous pour découvrir comment le BCD peut s'intégrer à votre offre.
    </p>

    {isProd ? (
      <form id="contact-form" class="space-y-6 fade-in" novalidate>
        <div>
          <label for="name" class="block text-sm font-semibold mb-2">Nom *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            class="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white"
            placeholder="Votre nom"
          />
          <p class="error-msg text-red-300 text-sm mt-1 hidden"></p>
        </div>
        <div>
          <label for="email" class="block text-sm font-semibold mb-2">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white"
            placeholder="votre@email.com"
          />
          <p class="error-msg text-red-300 text-sm mt-1 hidden"></p>
        </div>
        <div>
          <label for="message" class="block text-sm font-semibold mb-2">Message *</label>
          <textarea
            id="message"
            name="message"
            required
            rows="5"
            class="w-full bg-white/10 border border-white/30 rounded px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white resize-none"
            placeholder="Décrivez votre besoin..."
          ></textarea>
          <p class="error-msg text-red-300 text-sm mt-1 hidden"></p>
        </div>
        <button
          type="submit"
          class="w-full bg-blue text-white py-4 font-bold text-lg hover:opacity-90 transition-opacity rounded disabled:opacity-50"
        >
          Envoyer
        </button>
        <p id="form-success" class="hidden text-green-300 text-center font-semibold">
          ✓ Message envoyé ! Nous vous répondrons rapidement.
        </p>
        <p id="form-error" class="hidden text-red-300 text-center">
          Une erreur est survenue. Veuillez réessayer ou nous contacter par email.
        </p>
      </form>
    ) : (
      <div class="text-center py-12 border border-white/20 rounded-xl fade-in">
        <p class="opacity-60 mb-2">Formulaire disponible en production.</p>
        <p class="text-sm opacity-40">Configurez PUBLIC_CONTACT_API_URL pour activer.</p>
      </div>
    )}
  </div>
</section>

{isProd && (
  <script define:vars={{ apiUrl }}>
    import { validateContactForm } from '../../utils/contact-form.js';

    const form = document.getElementById('contact-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      };
      const { valid, errors } = validateContactForm(data);
      // Clear errors
      form.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
        el.classList.add('hidden');
      });
      if (!valid) {
        Object.entries(errors).forEach(([field, msg]) => {
          const input = form.querySelector(`#${field}`);
          const errEl = input?.nextElementSibling;
          if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
        });
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours...';
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          form.reset();
          document.getElementById('form-success').classList.remove('hidden');
        } else {
          document.getElementById('form-error').classList.remove('hidden');
        }
      } catch {
        document.getElementById('form-error').classList.remove('hidden');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Envoyer';
      }
    });
  </script>
)}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Team and Contact sections"
```

---

### Task 10 : Pages index.astro + mentions-legales.astro

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/mentions-legales.astro`

**Step 1: index.astro**

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import Hero from '../components/sections/Hero.astro';
import Stats from '../components/sections/Stats.astro';
import Alzheimer from '../components/sections/Alzheimer.astro';
import PourquoiBCD from '../components/sections/PourquoiBCD.astro';
import HowItWorks from '../components/sections/HowItWorks.astro';
import Validation from '../components/sections/Validation.astro';
import Offre from '../components/sections/Offre.astro';
import Team from '../components/sections/Team.astro';
import Contact from '../components/sections/Contact.astro';
---

<Base
  title="Brainvix – BCD | Test digital validé pour le repérage des troubles cognitifs"
  description="Le BCD est le premier test digital validé scientifiquement pour le repérage des troubles cognitifs. Simple, fiable, 97% de sensibilité. Développé par le Pr Bruno Dubois."
>
  <Hero />
  <Stats />
  <Alzheimer />
  <PourquoiBCD />
  <HowItWorks />
  <Validation />
  <Offre />
  <Team />
  <Contact />
</Base>

<script>
  import { initCounters, initFadeIn } from '../utils/counter';
  document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initFadeIn();
  });
</script>
```

**Step 2: mentions-legales.astro**

Extraire le contenu depuis la base de données SQL :

```bash
grep -a "mentions" ../../brainvix-com-20260305-155418-u0yt7gbbvhap/database.sql | head -5
```

Puis créer le fichier :

```astro
---
// src/pages/mentions-legales.astro
import Base from '../layouts/Base.astro';
---

<Base
  title="Mentions légales — Brainvix"
  description="Mentions légales du site brainvix.com — éditeur, hébergeur, propriété intellectuelle."
>
  <div class="pt-24 pb-16">
    <div class="section-container max-w-3xl">
      <h1 class="text-3xl font-bold text-navy mb-8">Mentions légales</h1>

      <section class="prose prose-navy max-w-none space-y-8 text-gray-700">
        <div>
          <h2 class="text-xl font-bold text-navy mb-3">Éditeur du site</h2>
          <p>Brainvix SAS<br />
          Site web : <a href="https://brainvix.com" class="text-blue hover:underline">brainvix.com</a></p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-navy mb-3">Directeur de la publication</h2>
          <p>Pierre Foulon</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-navy mb-3">Hébergement</h2>
          <p>Amazon Web Services (AWS)<br />
          38 Avenue John F. Kennedy, L-1855 Luxembourg</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-navy mb-3">Propriété intellectuelle</h2>
          <p>L'ensemble des contenus de ce site (textes, images, vidéos) est la propriété exclusive de Brainvix SAS.
          Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
        </div>

        <div>
          <h2 class="text-xl font-bold text-navy mb-3">Données personnelles</h2>
          <p>Les données collectées via le formulaire de contact sont utilisées uniquement pour répondre
          à vos demandes. Elles ne sont pas transmises à des tiers.</p>
        </div>
      </section>

      <div class="mt-12">
        <a href="/" class="text-blue hover:underline font-semibold">← Retour à l'accueil</a>
      </div>
    </div>
  </div>
</Base>
```

**Step 3: Configurer le site dans astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://brainvix.com',
  integrations: [tailwind()],
});
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add index and mentions-legales pages, wire all sections"
```

---

### Task 11 : Vérification — tests E2E

**Step 1: Lancer le dev server et les tests E2E**

```bash
npm run test:e2e
```

Expected : la majorité des tests passent. Corriger les éventuels sélecteurs qui ne matchent pas.

**Step 2: Lancer aussi les tests unitaires**

```bash
npm test
```

Expected : 8/8 tests pass.

**Step 3: Commit final**

```bash
git add -A
git commit -m "feat: complete Astro site - all sections implemented"
git push
```

---

### Task 12 : Optimisations finales

**Files:**
- Modify: `src/layouts/Base.astro` (preload LCP image)
- Modify: `public/assets/images/` (optimiser les PNG lourds)

**Step 1: Optimiser les images lourdes**

```bash
# Vérifier les tailles
ls -lh public/assets/images/

# Si tabletteBCD2-scaled.png > 500KB, convertir en webp
# (nécessite imagemagick ou squoosh-cli)
npx @squoosh/cli --webp '{}' public/assets/images/tabletteBCD2-scaled.png
```

**Step 2: Ajouter le preload du LCP dans Base.astro**

Dans le `<head>` :
```html
<link rel="preload" as="image" href="/assets/images/BCD-logosite.jpg" />
```

**Step 3: Commit**

```bash
git add -A
git commit -m "perf: optimize images and add LCP preload"
git push
```
