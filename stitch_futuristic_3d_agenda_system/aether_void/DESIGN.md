---
name: Aether Void
colors:
  surface: '#0e131f'
  surface-dim: '#0e131f'
  surface-bright: '#343946'
  surface-container-lowest: '#080e1a'
  surface-container-low: '#161c28'
  surface-container: '#1a202c'
  surface-container-high: '#242a36'
  surface-container-highest: '#2f3542'
  on-surface: '#dde2f3'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dde2f3'
  inverse-on-surface: '#2b303d'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#fff3f2'
  on-tertiary: '#67001b'
  tertiary-container: '#ffcdcf'
  on-tertiary-container: '#bc0b3b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0e131f'
  on-background: '#dde2f3'
  surface-variant: '#2f3542'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Space Grotesk
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.45'
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.08em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.625rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies deep-space telemetry, cybernetic computing, and futuristic command consoles. It projects precision, high intelligence, and cutting-edge operational authority for orbital telemetry, autonomous network operations, and complex algorithmic dashboards.

The visual language bridges high-tech minimalism with luminous glassmorphism. It uses vast, pitch-black slate voids pierced by calibrated neon beams, illuminated data readouts, and translucent multi-layered HUD panels. Interfaces feel atmospheric yet mechanically disciplined—evoking the sensory experience of a pressurized command bridge overlooking deep interstellar space.

## Colors

The palette is engineered specifically for ultra-dark environments to reduce fatigue while maximizing visual telemetry clarity:

- **Deep Void Base:** `#030712` serves as the canvas substrate, layered with `#0b0f19` for primary elevation tiers and secondary panel backing.
- **Neon Cyan (`#00f0ff`):** Primary signal color. Used for active command states, focused input vectors, and critical navigational telemetry.
- **Ultraviolet Purple (`#a855f7`):** Secondary resonance accent. Powers secondary actions, AI computation markers, and structural elevation highlights.
- **Electric Rose (`#f43f5e`):** Critical alerts, hazardous states, and emergency telemetry interruptions.
- **Synthetic Emerald (`#10b981`):** Subsystem integrity, nominal operational status, and authenticated states.
- **Surface Translucency:** Panel surfaces utilize RGBA variants (`rgba(11, 15, 25, 0.65)` to `rgba(15, 23, 42, 0.4)`) paired with high-specular glass borders.

## Typography

Typography establishes an instant operational posture. Headlines and body copy leverage **Space Grotesk** for clean, forward-leaning geometric cadence without ornamental excess. Data readouts, status identifiers, metadata badges, timestamps, and input fields utilize **JetBrains Mono** to enforce high-density technical scanability.

Text transforms such as uppercase styling are reserved for `label-md` and `label-sm` tiers to simulate tactical terminal interfaces. Micro telemetry text must maintain high contrast against dark glass surfaces using crisp off-white (`#e2e8f0`) and muted slate (`#94a3b8`).

## Layout & Spacing

The layout follows an adaptive 12-column modular grid designed for variable density dashboards, spatial viewports, and multi-monitor operations:

- **Desktop (>= 1280px):** 12 columns, 1.5rem gutters, 2rem canvas margin. Panels group telemetry modules into visual clusters with strict alignment.
- **Tablet (768px - 1279px):** 8 columns, 1.25rem gutters, 1.5rem canvas margin. Secondary diagnostics collapse into modal drawers or tabbed panes.
- **Mobile (< 768px):** 4 columns, 1rem gutters, 1rem canvas margin. Data ribbons stack vertically with horizontal touch-scroll telemetry tracks.

Spacing is calculated on an exact 4px mathematical scale, prioritizing compact information architecture with ample visual breathing room provided by structural margins.

## Elevation & Depth

Visual hierarchy is constructed through luminous glassmorphic stratification rather than drop shadows:

- **Void Layer (0):** The deep `#030712` canvas background with optional sub-surface radial ambient glow gradients (cyan and purple tinted, under 8% opacity).
- **Sub-Panel (Level 1):** `background: rgba(11, 15, 25, 0.65)`, `backdrop-filter: blur(20px)`, border: 1px solid `rgba(255, 255, 255, 0.06)`.
- **Floating HUD (Level 2):** `background: rgba(15, 23, 42, 0.75)`, `backdrop-filter: blur(28px)`, border: 1px solid `rgba(0, 240, 255, 0.25)`, subtle ambient box shadow: `0 0 25px -5px rgba(0, 240, 255, 0.15)`.
- **Active Overlay (Level 3):** `background: rgba(11, 15, 25, 0.9)`, `backdrop-filter: blur(36px)`, border: 1px solid `rgba(168, 85, 247, 0.45)`, glow shadow: `0 0 35px -5px rgba(168, 85, 247, 0.25)`.

## Shapes

The design system employs a soft, technical corner philosophy (`roundedness: 1`). Radius scale:
- Standard elements (buttons, inputs, chips): `0.25rem` (4px).
- Panels and containers: `0.5rem` (8px).
- Overlays and viewport frames: `0.75rem` (12px).

Rounded corners are deliberately subdued to maintain the precision of aerospace instrumentation while preventing visual harshness. Chamfered or cut-corner aesthetics can be applied selectively to micro-badges and primary trigger accents.

## Components

### Buttons
- **Primary Cybernetic Action:** Background in neon cyan (`#00f0ff`) with ultra-dark text (`#030712`), font weight 600. On hover: box-shadow `0 0 20px rgba(0, 240, 255, 0.6)`. Active state scales to 0.98.
- **Secondary Ghost Telemetry:** Background `rgba(168, 85, 247, 0.08)`, border 1px solid `rgba(168, 85, 247, 0.5)`, text `#e2e8f0`. On hover: border `#a855f7`, background `rgba(168, 85, 247, 0.2)`.
- **Destructive/Emergency:** Border 1px solid `rgba(244, 63, 94, 0.6)`, text `#f43f5e`, background `rgba(244, 63, 94, 0.08)`. On hover: glow `0 0 16px rgba(244, 63, 94, 0.4)`.

### Cards & Glass Panels
- Constructed with backdrop blur (`backdrop-blur-xl`), `rgba(11, 15, 25, 0.7)` fill, and hairline perimeter borders (`rgba(255, 255, 255, 0.08)` or contextual neon border highlights).
- Headers include a high-contrast mono label indicator and optional terminal dot markers.

### Input Fields
- Dark slate fill (`rgba(3, 7, 18, 0.85)`) with a hairline border (`rgba(255, 255, 255, 0.12)`). Monospace placeholder in muted slate (`#64748b`).
- Focused state: border-color `#00f0ff`, box-shadow `0 0 12px rgba(0, 240, 255, 0.35)`.

### Chips & Telemetry Badges
- Compact padding (`0.125rem 0.5rem`), monospace uppercase typography (`label-sm`).
- Bordered glass pill or 4px soft rectangle containing a solid pulsing status indicator dot (e.g., emerald for nominal, rose for breach, cyan for uplink).

### Checkboxes & Radios
- Crisp 4px soft-radius boxes for checkboxes; circular nodes for radios.
- Inactive: dark background with `rgba(255, 255, 255, 0.2)` border.
- Selected: `#00f0ff` fill with black geometric check icon or inner glow dot.

### Specialized HUD Modules
- **Data Scanners:** Oscilloscope line visualizers, system diagnostic gauges, and coordinate trackers integrated into translucent panel headers.