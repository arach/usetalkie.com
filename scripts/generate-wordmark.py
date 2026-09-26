"""Export the existing Talkie lockup as font-independent paths.
Run: uv run --with fonttools python scripts/generate-wordmark.py
"""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

root = Path(__file__).resolve().parents[1]
font = TTFont(root / 'public/fonts/Talkie-Medium.ttf')
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
advances = [600, 600, 600, 600, 340, 600]
gap = sum(advances) * (1 - .92) / 5
x = 0
paths = []
bounds = []
for index, letter in enumerate('talkie'):
    transform = (1, 0, 0, -1, x, 820)
    pen = SVGPathPen(glyphs)
    glyphs[cmap[ord(letter)]].draw(TransformPen(pen, transform))
    paths.append(pen.getCommands())
    bound = BoundsPen(glyphs)
    glyphs[cmap[ord(letter)]].draw(TransformPen(bound, transform))
    bounds.append(bound.bounds)
    if letter == 'i':
        dot = {'cx': round(x + 45, 3), 'cy': 81, 'r': 75.6}
    x += advances[index] - gap - (24 if index == 2 else 0)
left = min(b[0] for b in bounds) - 12
right = max(b[2] for b in bounds) + 12
top = min(min(b[1] for b in bounds), dot['cy'] - dot['r']) - 12
bottom = max(b[3] for b in bounds) + 12
view = [round(v, 3) for v in [left, top, right-left, bottom-top]]
data = {'viewBox': ' '.join(map(str, view)), 'width': view[2], 'height': view[3], 'paths': paths, 'dot': dot}
(root / 'components/brand/wordmark-paths.json').write_text(json.dumps(data, indent=2) + '\n')
for name, ink in [('dark', '#15140F'), ('light', '#F4EFE6')]:
    shapes = ''.join(f'<path d="{d}"/>' for d in paths)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{data["viewBox"]}" role="img" aria-label="Talkie"><g fill="{ink}">{shapes}</g><circle cx="{dot["cx"]}" cy="{dot["cy"]}" r="{dot["r"]}" fill="#FF5346"/></svg>\n'
    (root / f'public/brand/talkie-wordmark-{name}.svg').write_text(svg)
