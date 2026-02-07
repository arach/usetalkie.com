import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const ogDir = join(publicDir, 'og');

// Ensure og directory exists
mkdirSync(ogDir, { recursive: true });

// Load fonts
const interBold = readFileSync(join(__dirname, 'fonts', 'Inter-Bold.ttf'));
const interRegular = readFileSync(join(__dirname, 'fonts', 'Inter-Regular.ttf'));
const jetbrainsMono = readFileSync(join(__dirname, 'fonts', 'JetBrainsMono-Regular.ttf'));

const fonts = [
  { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
  { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
  { name: 'JetBrains Mono', data: jetbrainsMono, weight: 400, style: 'normal' },
];

// Talkie brand colors
const COLORS = {
  bg: '#0a0a0a',
  gridLine: '#1a2e1a',
  accent: '#22c55e', // green-500 (more green)
  text: '#ffffff',
  textMuted: '#a1a1aa',
  crossColor: '#22c55e',
};

// Helper to create elements
const h = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.length === 1 ? children[0] : children.length > 0 ? children : undefined,
  },
});

// Talkie Docs OG Template
const talkieDocsOG = ({ title, subtitle, tag = 'Documentation' }) => h('div', {
  style: {
    width: 1200,
    height: 630,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.bg,
    fontFamily: 'Inter',
    position: 'relative',
    overflow: 'hidden',
  },
},
  // Major grid (80px) with emerald tint
  h('div', {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `linear-gradient(to right, ${COLORS.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${COLORS.gridLine} 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      opacity: 0.4,
    },
  }),

  // Radial glow from top-left cross
  h('div', {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(circle at 80px 80px, rgba(34, 197, 94, 0.12) 0%, transparent 40%)`,
    },
  }),

  // Radial glow from bottom-right cross
  h('div', {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(circle at 1120px 560px, rgba(34, 197, 94, 0.10) 0%, transparent 40%)`,
    },
  }),

  // Top-left cross at (80, 80) - with fade effect
  // Horizontal line - faded outer
  h('div', {
    style: {
      position: 'absolute',
      top: 79,
      left: 20,
      width: 180,
      height: 2,
      background: `linear-gradient(to right, transparent, ${COLORS.crossColor}40 30px, ${COLORS.crossColor}40 150px, transparent)`,
    },
  }),
  // Horizontal line - bold inner dashed
  h('div', {
    style: {
      position: 'absolute',
      top: 79,
      left: 40,
      width: 120,
      height: 2,
      background: `repeating-linear-gradient(to right, ${COLORS.crossColor} 0px, ${COLORS.crossColor} 6px, transparent 6px, transparent 10px)`,
      opacity: 0.9,
    },
  }),
  // Vertical line - faded outer
  h('div', {
    style: {
      position: 'absolute',
      top: 20,
      left: 79,
      width: 2,
      height: 180,
      background: `linear-gradient(to bottom, transparent, ${COLORS.crossColor}40 30px, ${COLORS.crossColor}40 150px, transparent)`,
    },
  }),
  // Vertical line - bold inner dashed
  h('div', {
    style: {
      position: 'absolute',
      top: 40,
      left: 79,
      width: 2,
      height: 120,
      background: `repeating-linear-gradient(to bottom, ${COLORS.crossColor} 0px, ${COLORS.crossColor} 6px, transparent 6px, transparent 10px)`,
      opacity: 0.9,
    },
  }),

  // Bottom-right cross at (1120, 560) - with fade effect
  // Horizontal line - faded outer
  h('div', {
    style: {
      position: 'absolute',
      top: 559,
      left: 1000,
      width: 180,
      height: 2,
      background: `linear-gradient(to right, transparent, ${COLORS.crossColor}40 30px, ${COLORS.crossColor}40 150px, transparent)`,
    },
  }),
  // Horizontal line - bold inner dashed
  h('div', {
    style: {
      position: 'absolute',
      top: 559,
      left: 1040,
      width: 120,
      height: 2,
      background: `repeating-linear-gradient(to right, ${COLORS.crossColor} 0px, ${COLORS.crossColor} 6px, transparent 6px, transparent 10px)`,
      opacity: 0.9,
    },
  }),
  // Vertical line - faded outer
  h('div', {
    style: {
      position: 'absolute',
      top: 430,
      left: 1119,
      width: 2,
      height: 180,
      background: `linear-gradient(to bottom, transparent, ${COLORS.crossColor}40 30px, ${COLORS.crossColor}40 150px, transparent)`,
    },
  }),
  // Vertical line - bold inner dashed
  h('div', {
    style: {
      position: 'absolute',
      top: 470,
      left: 1119,
      width: 2,
      height: 120,
      background: `repeating-linear-gradient(to bottom, ${COLORS.crossColor} 0px, ${COLORS.crossColor} 6px, transparent 6px, transparent 10px)`,
      opacity: 0.9,
    },
  }),

  // Content container
  h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '100px 120px',
      position: 'relative',
      height: '100%',
    },
  },
    // Top row: ;)Talkie on left, Tag badge on right
    h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 56,
      },
    },
      // ;)Talkie branding - angled
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '12px 24px',
          borderRadius: 12,
          border: `3px solid ${COLORS.accent}`,
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          transform: 'rotate(-10deg)',
        },
      },
        h('span', {
          style: {
            fontSize: 20,
            fontWeight: 600,
            color: COLORS.accent,
            fontFamily: 'Inter',
          },
        }, ';)'),
        h('span', {
          style: {
            fontSize: 20,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: '-0.01em',
          },
        }, 'Talkie'),
      ),

      // Tag badge
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 6,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
        },
      },
        h('span', {
          style: {
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.accent,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        }, tag),
      ),
    ),

    // Title
    h('div', {
      style: {
        fontSize: 64,
        fontWeight: 700,
        color: COLORS.text,
        lineHeight: 1.1,
        maxWidth: 900,
        marginBottom: 16,
        letterSpacing: '-0.02em',
      },
    }, title),

    // Subtitle
    subtitle && h('div', {
      style: {
        fontSize: 26,
        fontWeight: 400,
        color: COLORS.textMuted,
        lineHeight: 1.5,
        maxWidth: 700,
      },
    }, subtitle),

    // Spacer
    h('div', { style: { flex: 1 } }),

    // Footer with URL in mono
    h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
    },
      h('span', {
        style: {
          fontSize: 15,
          fontWeight: 400,
          color: COLORS.textMuted,
          fontFamily: 'JetBrains Mono',
          letterSpacing: '0.01em',
        },
      }, 'https://usetalkie.com/docs'),
    ),
  ),

  // Bottom accent line (solid green)
  h('div', {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: COLORS.accent,
      opacity: 0.6,
    },
  }),
);

// Docs pages configuration
const docsPages = [
  {
    slug: 'docs',
    title: 'Documentation',
    subtitle: 'Setup guides and technical docs for Talkie',
    tag: 'Docs',
  },
  {
    slug: 'docs-overview',
    title: 'Overview',
    subtitle: 'Philosophy, local-first design, and multi-process architecture',
    tag: 'Getting Started',
  },
  {
    slug: 'docs-architecture',
    title: 'Architecture',
    subtitle: 'How Talkie, TalkieLive, TalkieEngine, and TalkieServer work together',
    tag: 'Deep Dive',
  },
  {
    slug: 'docs-api',
    title: 'API Reference',
    subtitle: 'HTTP endpoints, URL schemes, and integration points',
    tag: 'Reference',
  },
  {
    slug: 'docs-workflows',
    title: 'Workflows',
    subtitle: 'Triggers, actions, and custom automations',
    tag: 'Automation',
  },
  {
    slug: 'docs-extensibility',
    title: 'Extensibility',
    subtitle: 'Hooks, webhooks, and building on the Talkie platform',
    tag: 'Extend',
  },
  {
    slug: 'docs-data',
    title: 'Data Layer',
    subtitle: 'Database structure, models, storage, and export formats',
    tag: 'Reference',
  },
  {
    slug: 'docs-lifecycle',
    title: 'Lifecycle',
    subtitle: 'The journey from voice to action with extension points',
    tag: 'Concepts',
  },
  {
    slug: 'docs-bridge-setup',
    title: 'TalkieServer Setup',
    subtitle: 'Install and configure the local bridge for Mac and iPhone',
    tag: 'Setup Guide',
  },
  {
    slug: 'docs-tailscale',
    title: 'Tailscale Setup',
    subtitle: 'Secure peer-to-peer networking between Mac and iPhone',
    tag: 'Setup Guide',
  },
];

async function generateOGImage(element, filename) {
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts,
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(ogDir, filename), png);
  console.log(`  Generated ${filename}`);
}

async function main() {
  console.log('Generating Talkie Docs OG images...\n');

  for (const page of docsPages) {
    await generateOGImage(
      talkieDocsOG({
        title: page.title,
        subtitle: page.subtitle,
        tag: page.tag,
      }),
      `${page.slug}.png`
    );
  }

  console.log('\nDone! Images saved to public/og/');
}

main().catch(console.error);
