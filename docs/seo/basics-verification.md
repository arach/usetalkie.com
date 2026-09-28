# SEO basics verification

Work starts from current origin/main in the isolated seo-basics checkout. The original working directory is unchanged.

Implemented:
- Descriptive support, about, brand, ideas, workflows, comparison, and philosophy titles.
- Legacy download route reuses canonical download metadata and content.
- Explicit about/brand social metadata; shared Twitter defaults no longer override page titles/descriptions.
- BreadcrumbList on ten documentation pages and the tour landing page.
- Optional article `updated` frontmatter feeds JSON-LD dateModified, Open Graph modifiedTime, and sitemap lastmod. Missing updated falls back to publication date.
- Build-time sitemap refresh uses published article routes. Static routes remain explicitly listed; unverified static-page dates are omitted.
- Audit covers unique/descriptive metadata, one H1, image alt attributes, social title consistency, JSON-LD parsing, breadcrumbs, canonical/indexing intent, and sitemap coverage.

Validation: production static export succeeds; 1,316/1,316 audit checks pass. All 60 production sitemap routes remain present. These results describe the local export, not a deployment.

Editorial rule: set `updated` only after a substantive article edit. Do not use build time or a generic commit timestamp. Add static routes to scripts/generate-sitemap.mjs; the audit fails when an indexable exported route is omitted.

Video markup remains excluded until its public upload date is established. No ratings, release requirements, or performance claims were invented.

Independent Opus 5.5 review: ready to ship, no remaining material defects. See opus-audit.md for scope, findings, and resolutions. Not deployed.
