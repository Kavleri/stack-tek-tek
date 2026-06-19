# Design System Strategy: The Curated Sanctuary

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Curated Sanctuary**. 

In the context of a Syariah-themed wedding management platform, we must move away from the frantic, cluttered look of typical "admin dashboards." Instead, we treat the UI as a digital extension of a high-end concierge service. The design breaks the "generic template" look through **intentional asymmetry**, high-contrast typography scales, and a philosophy of **Tonal Depth**. By utilizing wide gutters, overlapping editorial elements, and a serif-heavy hierarchy, we create a workspace that feels calm, authoritative, and deeply intentional.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
This system utilizes a sophisticated palette where the Deep Navy (`#0B2545`) provides an anchor of trust, and the Soft Teal (`#B2D0CC`) and Cream (`#F5F0E0`) introduce a soft, breathable elegance.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through:
1.  **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Tonal Transitions:** Using subtle shifts in the neutral scale to define where one content block ends and another begins.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
- **Base Layer:** `surface` (#faf9fc).
- **Secondary Containers:** `surface-container-low` (#f5f3f6).
- **Interactive/Primary Cards:** `surface-container-lowest` (#ffffff) to provide a "pop" of clean white.
- **Nesting:** Never place two containers of the same tier inside each other. Use the hierarchy (Lowest to Highest) to guide the eye from the general workspace to specific interactive elements.

### Glass & Signature Textures
- **The Glass Factor:** Floating navigation or modal overlays must use a `backdrop-blur` (12px-20px) combined with a semi-transparent `surface-container-lowest` color. 
- **Gradients:** To add "soul," use a subtle linear gradient on primary CTAs transitioning from `primary_container` (#0b2545) to `primary` (#001026) at a 135-degree angle.

---

## 3. Typography: Editorial Authority
The typography system relies on the interplay between the timeless **Noto Serif** and the modern, highly legible **Manrope**.

- **Display & Headlines (Noto Serif):** Used for page titles, section headers, and high-level data summaries. This conveys a sense of traditional Syariah values and professional heritage.
- **Body & Labels (Manrope):** Used for all data entry, descriptions, and functional UI. The clean sans-serif ensures that complex management tasks remain legible and reduce cognitive load.
- **Hierarchy Tip:** Use `display-md` for empty state headers and `headline-sm` for card titles. Always maintain a 2:1 ratio between heading sizes and body text to ensure a "magazine" feel.

---

## 4. Elevation & Depth: Tonal Layering
We reject the heavy, "drop-shadow-everything" approach of 2010s UI. We define depth through **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking" surface-container tiers. A card (lowest tier) sits on a section (low tier) which sits on the background (base).
- **Ambient Shadows:** When a float is required (e.g., a calendar popover), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(11, 37, 69, 0.05)`. The shadow uses a Navy tint, not grey, to feel integrated into the environment.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in forms, use the `outline_variant` token at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons
- **Primary:** High-contrast `primary` background with `on_primary` text. Uses `xl` (0.75rem) roundedness for a soft but professional feel.
- **Secondary:** `secondary_container` background. No border.
- **Tertiary:** Text-only using the `primary` color token, with a `surface-container-high` background shift on hover.

### Data Tables (The "Ghost" Table)
- **Rule:** Forbid all vertical and horizontal divider lines.
- **Structure:** Use `body-md` for row text. Header row should be `surface-container-low` with `label-md` uppercase text. 
- **Separation:** Rows are separated by `16px` of vertical whitespace. Hover states should trigger a `surface-container-lowest` background shift with an `xl` corner radius.

### Calendars & Scheduling
- **Styling:** Use `surface-container-lowest` for the calendar grid. 
- **Selected State:** Use the Soft Teal (`secondary_fixed`) to highlight dates, ensuring a calm, non-aggressive selection.
- **Indicator:** Use a tiny `primary` dot for "Event Scheduled" markers, maintaining a clean, minimal look.

### Status Badges
- **Style:** Pill-shaped (`full` roundedness). 
- **Colors:** Instead of harsh red/green, use the container tokens. 
  - *Confirmed:* `secondary_container` (#cae9e4) text on `on_secondary_container` background.
  - *Pending:* `tertiary_fixed` (#e7e2d3) background.
- **Note:** Badges should never have borders.

### Professional Forms
- **Input Fields:** Use `surface-container-low` as the field background. 
- **Focus State:** Transitions to `surface-container-lowest` with a 1px `primary` "Ghost Border" (20% opacity).
- **Labels:** Use `label-md` in `on_surface_variant`. Place labels above the field with a 4px gap.

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace as a functional tool. If elements feel crowded, increase the margin rather than adding a line.
- **Do** use the `notoSerif` for numbers in data summaries to make them feel like "achievements" rather than just "data."
- **Do** utilize the `secondary` (Soft Teal) for success states to keep the palette harmonious with the Syariah theme.

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#1b1b1e) to maintain a premium, softer contrast.
- **Don't** use standard `md` (0.375rem) rounding for large containers. Use `xl` (0.75rem) to lean into the "Soft Minimalism" aesthetic.
- **Don't** allow "Stark Grids." Break the grid occasionally by indenting specific content blocks to create an editorial, high-end feel.