# Palette's Journal

## 2025-05-23 - Accessibility in Minimalist Interfaces
**Learning:** Icon-only buttons in minimalist designs are a frequent accessibility pitfall. In "JerseySwap", the high-contrast, neon-on-black aesthetic relies heavily on iconography. Without ARIA labels, these controls are invisible to screen readers, making the app unusable for visually impaired users despite the strong visual contrast.
**Action:** Always audit icon-only buttons for `aria-label` or `title` attributes, especially in "glassmorphism" or "cyberpunk" styled interfaces where text labels are often omitted for style.
