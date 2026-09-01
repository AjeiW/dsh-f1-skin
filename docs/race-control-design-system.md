# F1 Race Control Workspace

## Design contract

The skin is a work interface first and an F1 atmosphere second. Photography owns empty space; local material owns readability; repeated component rules own identity. Decorative labels must not imply telemetry the host does not expose.

## Layers

1. **Scene** — one fixed team photograph with per-team desktop and mobile focal points.
2. **Material** — navigation, reading, control, instrument, and overlay surfaces have separate opacity duties.
3. **Components** — compact typography, precise borders, short shadows, restrained cut corners, and accent rails repeat across the interface.
4. **State** — DSH `data-state` values drive running, completed, warning, and error styling.
5. **Team DNA** — all teams share layout and semantics; palette, geometry, grid density, and surface character vary.

## Host integration

Team selection and visual controls live in DSH's official `settings.section` slot under “F1 车队”. The skin never applies `filter` or `backdrop-filter` to layout ancestors, never globally restyles dialogs, and never changes the box model of fixed-height tool rows. Host controls keep their native typography, width, and overlay behavior.

## Team personalities

- Red Bull: aggressive navy structure and yellow speed marks.
- Ferrari: weighted red framing, warm surfaces, restrained mechanical geometry.
- McLaren: papaya accents, lighter material, asymmetric corners.
- Mercedes: silver-black precision, teal indicators, tighter grid.

## Version boundary

Semantic selectors (`role`, native elements, `data-state`) are preferred. DSH 0.1.1-rc.2 CSS Module selectors are isolated in `src/styles/` and must degrade by losing enhancement rather than breaking layout.
