# Design System Document: Dream Wedding Syariah

## 1. Overview & Creative North Star
**Creative North Star: "The Sacred Curator"**
This design system is the visual foundation for **Dream Wedding Syariah**, built to bridge the gap between divine tradition and modern luxury. It rejects the "app-like" feel of standard digital tools in favor of a high-end editorial experience that honors faith. By utilizing expansive whitespace, intentional asymmetry, and a focus on tonal depth, the interface should feel more like a bespoke wedding invitation or a luxury fashion magazine. We don't just organize events; we curate a sacred legacy of love and values.

To achieve this, the system breaks from traditional rigid grids. Elements should occasionally overlap, typography scales must be dramatic, and "breathing room" is treated as a core functional component that reflects the serenity of a Syariah-compliant union.

---

## 2. Colors
Our palette is anchored in the deep, authoritative **Navy Blue (#001F3F)** representing trust and the regal, metallic-inspired **Gold (#C5A059)** representing the value of the union.

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or containment. Boundaries must be defined through:
- **Background Color Shifts:** Transitioning from `surface` to `surface-container-low`.
- **Tonal Transitions:** Using subtle value shifts to imply edge without a hard line, mimicking the softness of premium silk.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper and frosted glass. Use the `surface-container` tiers to create depth:
- **Base Layer:** `surface` (#f8f9fa).
- **Secondary Content:** `surface-container-low` (#f3f4f5).
- **Interactive Cards/Modals:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel against the off-white base.

### Glass & Gradient Rules
- **Signature Textures:** For Hero backgrounds and Primary CTAs, use a subtle radial gradient: `primary` (#000613) to `primary_container` (#001f3f). This adds a "soul" to the depth that flat navy cannot provide.
- **Glassmorphism:** Use semi-transparent versions of `surface_container_lowest` with a `backdrop-blur (20px)` for floating navigation bars to maintain the feeling of airy, modern luxury.

---

## 3. Typography
The typography is a dialogue between the timelessness of a serif and the precision of a modern sans-serif.

- **Display & Headlines (Noto Serif):** Used for large-scale editorial moments. High contrast in size conveys authority and luxury. `display-lg` should be used sparingly for impactful poetic statements or section headers.
- **Titles & Labels (Manrope):** A clean, geometric sans-serif used for structure and navigation. It provides a functional counter-weight to the serif, ensuring the design feels "modern Syariah" rather than purely traditional.
- **Hierarchy of Trust:** Large serif headers establish the "Dream" (aspiration), while clear, well-spaced Manrope body text establishes the "Organizer" (reliability).

---

## 4. Elevation & Depth
We define hierarchy through **Tonal Layering** and **Ambient Light**, not structural scaffolding.

- **The Layering Principle:** Avoid shadows where background shifts can suffice. Place a `surface-container-lowest` card on a `surface-container-low` background to create a soft, natural lift.
- **Ambient Shadows:** When a "floating" element (like a primary modal) is required, use extra-diffused shadows:
  - Blur: 30px - 60px
  - Opacity: 4% - 8%
  - Tint: Use a navy-tinted version of `on-surface` rather than pure black to keep the shadow feeling like a natural reflection of the room.
- **The "Ghost Border":** If a container requires a border (e.g., input fields), use the `outline_variant` token at **15% opacity**. A 100% opaque border is too aggressive for this aesthetic.
- **Gold Accents:** The gold (`secondary`) should be used for thin, "metallic" lines in decorative contexts only—never for structural containment.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), white text, `xl` (0.75rem) corner radius. No border.
- **Secondary:** Transparent background with a `secondary` (Gold) "Ghost Border" (20% opacity) and `on_secondary_container` text.
- **Tertiary:** Text only in `secondary`, all-caps with generous letter spacing (0.1rem).

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Structure:** Use vertical whitespace (spacing scale) to separate list items. For cards, use the `surface-container-lowest` fill to distinguish them from the base `surface`.
- **Editorial Card:** Large image-top cards should have an asymmetric text overlay, slightly bleeding out of the container bounds for a custom feel.

### Input Fields
- **Style:** Underline only or "Ghost Border." Focus state should transition the bottom border to `secondary` (Gold) and introduce a subtle `secondary_container` glow.

### Signature Component: The "Gilded Frame"
- For featured wedding galleries or testimonials, use a `surface-container-highest` background with a very thin (0.5px) `secondary` gold border and 40px internal padding to frame the content like a piece of art.

---

## 6. Do's and Don'ts

### Do
- **Use Intentional Asymmetry:** Offset images and text blocks to create a high-end editorial rhythm.
- **Embrace Whitespace:** Allow at least 80px-120px of vertical space between major sections.
- **Prioritize Legibility:** Ensure `body-md` has at least a 1.5 line-height for readability.

### Don't
- **Don't use pure black:** Use `primary` (#000613) for the darkest elements to maintain color depth.
- **Don't use standard shadows:** Never use default `0, 4, 8, 0` shadows; they look "cheap" and "templated."
- **Don't crowd the Gold:** Gold is an accent. If it covers more than 10% of the screen, the "premium" feel is lost and it becomes gaudy.
- **Don't use 1px solid borders:** Re-read the "No-Line" Rule. If you find yourself drawing a line, ask if a color shift could do the job better.