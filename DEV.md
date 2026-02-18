# Development Setup

## Quick Start

**Launch everything:**
```bash
bun run dev:all
```

This starts:
- Main site at `http://localhost:5173`
- Marketing API at `http://localhost:3100`

## Individual Services

**Main site only:**
```bash
bun dev
```

**Marketing API only:**
```bash
bun run dev:marketing
```

## Configuration

### Ports
Port configuration is in **`dev.config.sh`** (used by `dev.sh`):

```bash
MAIN_PORT=5173          # Main site
MARKETING_PORT=3100     # Marketing API
```

**To change ports, update these files:**
1. `dev.config.sh` (for `dev:all` script)
2. `package.json` scripts (for `bun dev`)
3. `marketing-api/package.json` scripts (for `dev:marketing`)
4. `.env.local` - `NEXT_PUBLIC_MARKETING_API_URL`

### Environment Variables
Local development uses `.env.local`:

```bash
# Must match MARKETING_PORT in dev.config.sh
NEXT_PUBLIC_MARKETING_API_URL=http://localhost:3100/api
```

In production, this defaults to `https://marketing.usetalkie.com/api`

## Features That Need Marketing API

These features require the marketing API to be running:
- Email signup (pricing section)
- Feedback widget (`⌘K`)
- Download modal

If you're not working on these, you can just run `bun dev` for the main site.

## Logs

Marketing API logs are written to `logs/marketing-api.log` when using `dev:all`
