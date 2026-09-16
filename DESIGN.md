# Homepage design system

## Scope

The scenic design is mounted at `/` by `app/page.jsx`. It combines `components/home/HomePage.jsx` and its CSS module with the opt-in `talkie-home-shell` class in `MainShell.jsx`. Homepage-specific shell rules live at the end of `app/globals.css`.

Other routes retain their established shell styling. `MainShell` defaults `home` to `false`; no other route opts into this design. The shared navigation, footer, theme control, narrator, and existing demo player remain shared components.

## Direction

The supplied reference is https://www.trysynara.com/. The homepage uses a full-width illustration of a lakeside listening pavilion, left-aligned product copy, two clear actions, and a large real Mac screenshot. Open supporting sections continue into a real dictation demo, mobile capture, local ownership, and a download action.

The illustration is generated artwork, not product evidence. The Mac screenshots, iPhone artwork, and demo are existing product assets. See `design/talkie-listening-pavilion.asset.md` for the current artwork's provenance and prompt, and `design/homepage-scenic.md` for the earlier coastal asset.

Buttons are transparent. Over the hero artwork and other dark surfaces, the primary action uses a near-opaque white outline with a light translucent fill and blur; the secondary action uses a fainter outline. Hierarchy comes from border strength and hover fill, not from solid backgrounds.

The page alternates surfaces deliberately: scenic hero, open paper sections, a dark slate mobile-capture band, paper again for ownership, and a scenic closing bookend. The mobile-capture band presents the dark iPhone UI without a container box; the phone sits flush with the band's bottom edge, and the band's hard edges are the transitions. The closing section reuses the pavilion artwork as a wide lake panorama (opposite crop from the hero) under a heavier shade, with white text and the same glass buttons — a bookend to the hero.

## Color and typography

Homepage content uses the existing `--font-talkie-sans` font. Headings use weight 500 and tracking of -0.035em. The desktop hero reaches 68px; section headings reach 46px. Body copy uses 14–17px with generous line height.

The light palette uses paper `#f7f8fa`, ink `#19252d`, muted text `#55626c`, and blue accent `#2f5c8e`. A restrained amber accent (`#a5732c` light, `#d8ab5e` dark) picks up the artwork's warm timber and the phone UI's amber accents: link underline hovers, the small dot beside the "Talkie for Mac" label, and the mobile band's eyebrow label. The mobile-capture band uses slate `#141f2a` (light mode) and `#10171e` with hairline block borders (dark mode). Dark mode uses paper `#17212b`, ink `#edf3f8`, muted text `#b7c4d0`, and blue accent `#bdd6f3`. The scenic hero and closing sections keep white text over shaded artwork in both modes. Product screenshots remain the light product captures, except the mobile band's intentionally dark iPhone artwork.

Homepage shell variables recolor the existing header and footer. The header is 62px tall, navigation uses regular sans-serif labels, and the download action is rounded. The footer's decorative grid is hidden only inside the homepage shell.

## Layout and surfaces

Most content is constrained to 1176px including 28px horizontal padding. The hero screenshot fills the inner 1120px width. The screenshot surface has rounded upper corners and a soft downward shadow. Supporting content uses open columns and horizontal separators rather than boxed feature cards.

At widths below 768px, supporting sections become single-column layouts, horizontal padding reduces to 20–24px, the product caption stacks, and the final actions stack. Shared navigation continues to use its existing mobile behavior.

## Interaction and accessibility

The screenshot selector uses native buttons with `aria-pressed`. Each screenshot has descriptive alternative text, and its supporting description updates in a polite live region. Selection is manual; there is no automatic carousel.

Download links lead to `/downloads`. The hero demo link navigates to `#product-demo`. The existing demo player owns playback, captions, loading feedback, and retry behavior. Mobile acquisition uses the shared product-link configuration.

Homepage links and buttons have a visible blue keyboard outline. Text selection uses a pale blue background with dark text. Decorative hero artwork has empty alternative text. Headings follow the page's h1/h2/h3 hierarchy.

## Verification boundary

The finish review covered source structure, scoped styling, control semantics, and linked destinations. It did not include an independent rendered visual review or measured contrast over the scenic image. Runtime, screenshot, and production-build evidence should be reported separately by the implementing agent.
