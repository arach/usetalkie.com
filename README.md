# Talkie Landing Site

Static marketing site for Talkie built with Next.js and Tailwind CSS. Configured for static export and GitHub Pages.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS 3 (with extended color shades)
- Static export (`output: 'export'`) for GitHub Pages

## Local Development

```bash
bun install
bun dev
# portless prints the local preview URL
```

## Build & Preview

```bash
bunx next build
bun run seo:audit
# static site in out/
```

## Deploy to GitHub Pages

This repo includes a workflow at `.github/workflows/deploy-landing.yml` that:
- builds the Next.js site
- exports static files to `out/`
- publishes to GitHub Pages using the Pages deployment action

### One-time setup

1. Push changes to `main` branch
2. In GitHub → Settings → Pages:
   - Build and deployment: **GitHub Actions**
3. Trigger a build by pushing to `main` (or use Workflow Dispatch)

By default, the site assumes a custom domain and builds at the root path. To deploy under a project path (e.g. `https://<user>.github.io/<repo>/`), set env `BASE_PATH=/<repo>` during build/export.

## Customize

- Edit content in `app/page.jsx`
- Global styles in `app/globals.css`
- Tailwind theme in `tailwind.config.js`
- Next.js export options in `next.config.js`
- Google Analytics is configured in `app/layout.jsx` using GA4 Measurement ID `G-EP7F8TC801`.

## Introductory Offer Form (Formspree)

The Pricing section includes an email capture card powered by Formspree (free tier).

- A default Formspree endpoint is already configured: `mkgaanoo`.
- To use your own endpoint instead:
  - Create a form at https://formspree.io (name: `Talkie Intro`)
  - Copy the form ID (looks like `abcdxyz1`)
  - Add a repo secret named `FORMSPREE_ID` with that value
  - The workflow injects it as `NEXT_PUBLIC_FORMSPREE_ID` during build/export and overrides the default

Local dev:

```bash
export NEXT_PUBLIC_FORMSPREE_ID=abcdxyz1
bun dev
```

If no ID is set, the site uses the default `mkgaanoo`. If you remove both, it will gracefully fall back to `mailto:`.

## Configure Pricing Anchors

You can override launch and regular prices at build time (static export):

- `NEXT_PUBLIC_REGULAR_PRICE` (default: `29.99`)
- `NEXT_PUBLIC_LAUNCH_PRICE` (default: `2.99` — set to `0` for free)

Local:

```bash
export NEXT_PUBLIC_REGULAR_PRICE=29.99
export NEXT_PUBLIC_LAUNCH_PRICE=2.99
npm run dev
```

CI (GitHub Actions): add repository variables (or secrets) with those names to customize the deployed site.

## Custom Domain (Configured)

- Domain: `usetalkie.com`
- File `public/CNAME` is included so Pages serves the custom domain.
- DNS: point `usetalkie.com` at the deployed host.
- In GitHub → Settings → Pages, set Custom domain to `usetalkie.com` and enforce HTTPS.
