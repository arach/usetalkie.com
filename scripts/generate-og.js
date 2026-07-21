import satori from 'satori';
import sharp from 'sharp';
import matter from 'gray-matter';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const ogDir = join(publicDir, 'og');
const ogIdeasDir = join(ogDir, 'ideas');

// Ensure og directories exist
mkdirSync(ogDir, { recursive: true });
mkdirSync(ogIdeasDir, { recursive: true });

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
  paper: '#F4EFE6',
  paperDeep: '#E4D6BE',
  ink: '#0E0D0A',
  muted: '#7A6E5C',
  edge: '#CFC0A7',
  hotMic: '#FF5346',
  cassette: '#E68A3C',
  // Compatibility aliases for the docs template below.
  bg: '#F4EFE6',
  accent: '#FF5346',
  text: '#0E0D0A',
  textMuted: '#7A6E5C',
};

// Helper to create elements
const h = (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.length === 1 ? children[0] : children.length > 0 ? children : undefined,
  },
});

// Helpers
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncate(str, max = 140) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, '') + '...';
}

function ideasTitleSize(title) {
  if (title.length > 90) return 44;
  if (title.length > 75) return 48;
  if (title.length > 58) return 56;
  return 62;
}

function captureStrip() {
  const bars = [22, 44, 76, 36, 96, 58, 28, 72, 48, 84];

  return [
    h('span', {
      style: {
        position: 'absolute', top: 204, right: 76, color: COLORS.paper,
        fontSize: 10, letterSpacing: '0.16em', fontFamily: 'JetBrains Mono',
      },
    }, 'LIVE CAPTURE'),
    h('div', {
      style: {
        position: 'absolute', top: 236, right: 52, width: 102, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      },
    },
      ...bars.map((height) => h('div', {
        style: { width: 4, height, backgroundColor: COLORS.hotMic, borderRadius: 2 },
      }))
    ),
    // Screenshot mode — a selected portion of the screen, complete with
    // handles, rather than another line of explanatory copy.
    h('div', {
      style: {
        position: 'absolute', top: 338, right: 52, width: 102, height: 78,
        border: '1px solid rgba(244, 239, 230, 0.48)', padding: 8, display: 'flex',
      },
    },
      h('div', {
        style: {
          width: 64, height: 43, marginLeft: 12, marginTop: 8,
          border: `1px dashed ${COLORS.paper}`, backgroundColor: 'rgba(244, 239, 230, 0.10)',
          position: 'relative', display: 'flex',
        },
      },
        ...[
          { top: -3, left: -3 }, { top: -3, right: -3 },
          { bottom: -3, left: -3 }, { bottom: -3, right: -3 },
        ].map((position) => h('div', {
          style: { position: 'absolute', ...position, width: 6, height: 6, backgroundColor: COLORS.paper },
        }))
      ),
    ),
    // Camera mode — a small lens and the record light make the third module
    // immediately legible without needing to label it.
    h('div', {
      style: {
        position: 'absolute', top: 450, right: 70, width: 66, height: 54,
        borderRadius: 27, border: `1px solid ${COLORS.paper}`, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      },
    },
      h('div', { style: { width: 22, height: 22, borderRadius: 11, border: `4px solid ${COLORS.paper}` } }),
      h('div', { style: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.hotMic } }),
    ),
    h('span', {
      style: {
        position: 'absolute', bottom: 76, right: 80, color: COLORS.paper,
        fontSize: 11, letterSpacing: '0.08em', fontFamily: 'JetBrains Mono',
      },
    }, '00:18'),
  ];
}

// Shared brand background elements. Keep the cards tactile and print-like;
// the product has moved beyond the old neon-terminal treatment.
function brandBackground() {
  return [
    h('div', {
      style: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `linear-gradient(118deg, ${COLORS.paper} 0%, ${COLORS.paper} 69%, ${COLORS.paperDeep} 69%, ${COLORS.paperDeep} 100%)`,
      },
    }),
    h('div', {
      style: {
        position: 'absolute', top: 0, right: 0, width: 206, height: '100%',
        backgroundColor: COLORS.ink,
      },
    }),
    h('div', {
      style: {
        position: 'absolute', top: 64, right: 64, width: 78, height: 78,
        borderRadius: 39, backgroundColor: COLORS.hotMic,
      },
    }),
    h('div', {
      style: {
        position: 'absolute', top: 100, right: 78, width: 50, height: 50,
        border: `1px solid ${COLORS.paper}`,
      },
    }),
    h('div', {
      style: {
        position: 'absolute', bottom: 64, right: 78, width: 50, height: 1,
        backgroundColor: COLORS.paper,
      },
    }),
    ...captureStrip(),
  ];
}

// Talkie Docs OG Template
const talkieDocsOG = ({ title, subtitle, tag = 'Documentation' }) => h('div', {
  style: {
    width: 1200, height: 630, display: 'flex', flexDirection: 'column',
    backgroundColor: COLORS.bg, fontFamily: 'Inter', position: 'relative', overflow: 'hidden',
  },
},
  ...brandBackground(),

  // Content container
  h('div', {
    style: {
      display: 'flex', flexDirection: 'column', padding: '100px 120px',
      position: 'relative', height: '100%',
    },
  },
    // Top row: ;)Talkie on left, Tag badge on right
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56,
      },
    },
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', padding: '12px 24px',
          borderRadius: 12, border: `3px solid ${COLORS.accent}`,
          backgroundColor: 'rgba(34, 197, 94, 0.08)', transform: 'rotate(-10deg)',
        },
      },
        h('span', {
          style: { fontSize: 20, fontWeight: 600, color: COLORS.accent, fontFamily: 'Inter' },
        }, ';)'),
        h('span', {
          style: { fontSize: 20, fontWeight: 600, color: COLORS.text, letterSpacing: '-0.01em' },
        }, 'Talkie'),
      ),
      h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
          borderRadius: 6, backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
        },
      },
        h('span', {
          style: {
            fontSize: 13, fontWeight: 600, color: COLORS.accent,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          },
        }, tag),
      ),
    ),

    // Title
    h('div', {
      style: {
        fontSize: 64, fontWeight: 700, color: COLORS.text,
        lineHeight: 1.1, maxWidth: 900, marginBottom: 16, letterSpacing: '-0.02em',
      },
    }, title),

    // Subtitle
    subtitle && h('div', {
      style: {
        fontSize: 26, fontWeight: 400, color: COLORS.textMuted,
        lineHeight: 1.5, maxWidth: 700,
      },
    }, subtitle),

    // Spacer
    h('div', { style: { flex: 1 } }),

    // Footer with URL in mono
    h('div', {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    },
      h('span', {
        style: {
          fontSize: 15, fontWeight: 400, color: COLORS.textMuted,
          fontFamily: 'JetBrains Mono', letterSpacing: '0.01em',
        },
      }, 'https://usetalkie.com/docs'),
    ),
  ),
);

// Talkie Ideas OG Template
const talkieIdeasOG = ({ title, description, date, tags = [] }) => h('div', {
  style: {
    width: 1200, height: 630, display: 'flex', flexDirection: 'column',
    backgroundColor: COLORS.paper, fontFamily: 'Inter', position: 'relative', overflow: 'hidden',
  },
},
  ...brandBackground(),

  // Content container
  h('div', {
    style: {
      display: 'flex', flexDirection: 'column', padding: '70px 274px 62px 88px',
      position: 'relative', height: '100%',
    },
  },
    // Top row: "Ideas" label + date
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32,
      },
    },
      h('span', {
        style: {
          fontSize: 14, fontWeight: 400, color: COLORS.ink,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          fontFamily: 'JetBrains Mono',
        },
      }, 'Talkie / Ideas'),
      // Thin separator
      h('div', {
        style: { width: 1, height: 14, backgroundColor: COLORS.edge },
      }),
      h('span', {
        style: {
          fontSize: 14, fontWeight: 400, color: COLORS.muted,
          fontFamily: 'JetBrains Mono',
        },
      }, formatDate(date)),
    ),

    h('div', {
      style: {
        fontSize: ideasTitleSize(title), fontWeight: 400, color: COLORS.ink,
        lineHeight: 1.02, maxWidth: 790, marginBottom: 24,
        letterSpacing: '-0.035em', fontFamily: 'Inter',
      },
    }, title),

    // Description
    description && h('div', {
      style: {
        fontSize: 20, fontWeight: 400, color: COLORS.muted,
        lineHeight: 1.45, maxWidth: 710,
      },
    }, truncate(description, 130)),

    // Spacer
    h('div', { style: { flex: 1 } }),

    // Footer: tags on left, URL on right
    h('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      },
    },
      // Tags
      h('div', {
        style: { display: 'flex', gap: 16 },
      },
        ...tags.slice(0, 3).map(tag =>
          h('div', {
            style: {
              display: 'flex', alignItems: 'center',
              padding: '7px 0', borderRadius: 0,
              borderTop: `1px solid ${COLORS.edge}`,
            },
          },
            h('span', {
              style: {
                fontSize: 11, fontWeight: 400, color: COLORS.ink,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                fontFamily: 'JetBrains Mono',
              },
            }, tag),
          )
        ),
      ),
      // URL
      h('span', {
        style: {
          fontSize: 13, fontWeight: 400, color: COLORS.muted,
          fontFamily: 'JetBrains Mono', letterSpacing: '0.01em',
        },
      }, 'usetalkie.com/ideas'),
    ),
  ),
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
  console.log('Generating Talkie OG images...\n');

  // Docs pages
  console.log('Docs:');
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

  // Ideas articles
  const ideasDir = join(__dirname, '..', 'content', 'ideas');
  const ideasFiles = readdirSync(ideasDir).filter(f => f.endsWith('.mdx'));

  console.log('\nIdeas:');
  for (const file of ideasFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const raw = readFileSync(join(ideasDir, file), 'utf8');
    const { data } = matter(raw);

    if (data.draft) continue;

    await generateOGImage(
      talkieIdeasOG({
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
      }),
      join('ideas', `${slug}.png`)
    );
  }

  console.log('\nDone! Images saved to public/og/');
}

main().catch(console.error);
