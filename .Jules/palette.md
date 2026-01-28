## 2025-02-23 - Accessibility in Glassmorphism
**Learning:** Glassmorphism and minimalistic designs often omit visible labels for aesthetic reasons, relying heavily on icons and placeholders. This creates significant accessibility gaps for screen reader users who cannot see the visual context.
**Action:** When working with this design system, always enforce `aria-label` on icon-only buttons and inputs that lack visible `<label>` elements, even if the visual design doesn't change. Use `title` attributes on icon buttons to provide tooltips for mouse users as a secondary benefit.
