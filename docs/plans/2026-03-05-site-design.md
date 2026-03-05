# Design — Site Astro brainvix.com

## Objectif

Reproduire fidèlement le site WordPress brainvix.com en site statique Astro,
hébergé sur AWS (S3 + CloudFront) via SST.

## Stack

- **Framework** : Astro (zéro framework JS côté client)
- **CSS** : Tailwind CSS (layout/spacing) + CSS custom (animations)
- **Tests** : Playwright (E2E) + Vitest (unit) — déjà en place
- **Formulaire** : Web3Forms en dev → AWS Lambda + SES en prod (SST)
- **Déploiement** : SST v3, S3 + CloudFront, domaine brainvix.com

## Architecture des fichiers

```
src/
├── pages/
│   ├── index.astro
│   └── mentions-legales.astro
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   └── sections/
│       ├── Hero.astro
│       ├── Stats.astro
│       ├── Alzheimer.astro
│       ├── PourquoiBCD.astro
│       ├── HowItWorks.astro
│       ├── Validation.astro
│       ├── Offre.astro
│       ├── Team.astro
│       └── Contact.astro
├── styles/
│   ├── global.css
│   └── animations.css
└── utils/
    ├── contact-form.ts  (✅ fait)
    └── counter.ts
public/
└── assets/
    ├── images/
    └── videos/
```

## Pages

- `/` — homepage, 10 sections scrollables avec ancres
- `/mentions-legales` — page simple, header/footer partagés

## Design system

- **Couleurs** : `--navy: #33335e` · `--blue: #3452FF` · `--white: #ffffff`
- **Police** : Open Sans (300, 400, 600, 700) via Google Fonts avec preconnect
- **Sections homepage** : Hero · Stats · Alzheimer · PourquoiBCD · HowItWorks · Validation · Offre · Team · Contact

## Animations

| Effet | Technique |
|---|---|
| Compteurs animés | IntersectionObserver + requestAnimationFrame |
| Fade-in sections | IntersectionObserver + CSS opacity/translate |
| Scribble SVG | stroke-dashoffset animation CSS |
| Vidéo hero background | `<video autoplay muted loop playsinline>` |

## Formulaire de contact

- Validation côté client : `validateContactForm()` (✅ testé)
- Dev : désactivé avec message "Disponible en production"
- Prod : `fetch` vers `PUBLIC_CONTACT_API_URL` (API Gateway → Lambda → SES)

## Assets

Copiés depuis l'export WordPress :
- Images : `uploads/2025/{07,08,09}/` → `public/assets/images/`
- Vidéos : `Firefly-Top-down-...mp4` (hero) + `slomosf.mp4` → `public/assets/videos/`
