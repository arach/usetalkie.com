# AGENTS.md — Landing Page

Landing page specific instructions. See root `/AGENTS.md` for shared conventions.

---

## Overview

Marketing website for Talkie built with Next.js and React.

## Build

```bash
bun install
bun dev           # http://localhost:5173
bun run build     # Production build
bun start        # Serve production build
```

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Bun

## Project Structure

```
Landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── privacy/
│       └── page.tsx
├── components/
│   ├── FeaturesPage.jsx
│   ├── Hero.tsx
│   └── ...
├── public/
│   ├── screenshots/
│   └── og-image.png
├── scripts/
│   └── generate-og-image.js
├── tailwind.config.js
└── package.json
```

## Commands

```bash
bun dev                       # Development server
bun run build                 # Production build
node scripts/generate-og-image.js  # Regenerate OG image
```

## Conventions

### TypeScript

- Strict mode enabled
- Prefer interfaces over types for object shapes
- No `any` types

### Components

```tsx
// Functional components with TypeScript
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {icon}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
```

### Tailwind

- Use design tokens from `tailwind.config.js`
- Prefer utility classes over custom CSS
- Extract repeated patterns to components
- In multi-column story panels, use one shared horizontal separator between primary content and supporting details. Keep the separator aligned across all columns.
- Align the primary content start across the `Situation`, `Action`, and `Result` columns.
- Render `Situation` as a scene brief with `Context`, `Constraint`, and `Need` rows.
- Render `Result` as a Markdown document with a filename, state, destination, and details.
- In the center column, show the complete device or product surface in use. Do not show a detached app window when a device frame provides useful context.
- Do not show ordinal carousel counters when selection state is already visible.

### Images

- Screenshots in `public/screenshots/`
- Use Next.js `Image` component for optimization
- Generate OG images with `scripts/generate-og-image.js`

### Copy

- Use ASD-STE100 controlled-English principles for all interface and explanatory copy.
- Use short, complete sentences. Express one idea or instruction in each sentence.
- Prefer active voice and simple verb tenses.
- Use one term for each product concept. Do not vary terms for style.
- Avoid idioms, metaphors, ornamental phrases, and ambiguous verbs.
- Describe each situation directly. Do not assign the visitor a role in the scene.
- Avoid repeated second-person pronouns. Use them only for a necessary direct instruction.
- Keep quoted user speech natural and verbatim when it represents a transcript.
- Use `Situation`, `Action`, and `Result` for the primary row.
- Use `Input`, `Download`, and `Output` for the supporting row.
- Keep the primary row headings unqualified. Do not add redundant labels such as `Scene brief`, device names, or format names beside them.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero, features, screenshots |
| `/privacy` | Privacy policy |

## Deployment

Static export compatible. Deploy to Vercel, Netlify, or any static host.

```bash
bun run build
# Output in .next/ or out/ depending on config
```

## Notes

- Keep bundle size minimal
- Optimize images before committing
- Test on mobile viewports
