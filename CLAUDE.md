# usetalkie.com

Marketing website and release distribution for Talkie.

## Architecture

```
usetalkie.com/
├── app/                    # Next.js App Router pages
│   ├── page.jsx           # Landing page (/)
│   ├── dictation/         # Talkie for Mac (/dictation)
│   ├── capture/           # Talkie for Mobile (/capture)
│   ├── workflows/         # Talkie for Agents (/workflows)
│   ├── docs/              # Documentation (/docs/*)
│   ├── philosophy/        # Philosophy page
│   ├── security/          # Security page
│   └── ...
├── components/            # React components
│   ├── LandingPage.jsx   # Main landing page component
│   ├── docs/             # Documentation components
│   └── ...
├── public/               # Static assets (images, videos)
│   └── CNAME            # Custom domain config
└── .github/workflows/    # GitHub Actions
    └── deploy.yml       # Build & deploy to GitHub Pages
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, static export)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: GitHub Pages via GitHub Actions
- **Domain**: usetalkie.com (custom domain)

## Development

```bash
# Install dependencies
bun install  # or npm install

# Run dev server
bun run dev  # Opens at http://localhost:5173

# Build static export
bun run build  # Outputs to ./out
```

## Feature Flags

Feature flags are defined at the top of components:

```javascript
// components/LandingPage.jsx
const SHOW_AGENTS = false  // Hide Talkie for Agents

// components/docs/DocsIndexPage.jsx
const SHOW_TAILSCALE_DOCS = false  // Hide Tailscale setup guide
```

Pages behind feature flags are hidden from navigation/listings but remain accessible via direct URL.

## Deployment

Automatic via GitHub Actions on push to `main`:
1. Checkout → Install deps → Build → Deploy to GitHub Pages
2. Custom domain served via CNAME file in `public/`

No `BASE_PATH` needed - custom domain serves from root.

## Releases

Binary releases (DMG files) are hosted on GitHub Releases:
- Release URL format: `https://github.com/arach/usetalkie.com/releases/download/vX.Y.Z/Talkie-X.Y.Z.dmg`
- Create releases with: `gh release create vX.Y.Z /path/to/Talkie-X.Y.Z.dmg --title "Talkie X.Y.Z" --notes "..."`

Source archives auto-attached by GitHub contain only this website code (not the Talkie app source).

## Key Files

| File | Purpose |
|------|---------|
| `components/LandingPage.jsx` | Main landing page with hero, features, pricing |
| `components/docs/DocsIndexPage.jsx` | Documentation index |
| `public/CNAME` | Custom domain configuration |
| `.github/workflows/deploy.yml` | Build and deploy workflow |
| `next.config.js` | Next.js config (static export, basePath) |

## Common Tasks

### Update download links
Search for `releases/download` in components and update version numbers.

### Add a new page
1. Create `app/your-page/page.jsx`
2. Import and use a component from `components/`
3. Add navigation link if needed

### Hide content behind feature flag
1. Add flag at top of component: `const SHOW_FEATURE = false`
2. Wrap content: `{SHOW_FEATURE && <Component />}`

## Related Repos

- **talkie** (private): Main app source code (Swift)
- **usetalkie.com** (this repo, public): Website + release distribution

## Git Commits

- Use gitmoji
- No co-authoring attribution
