# Palette's Journal

This journal tracks critical UX and accessibility learnings for the JerseySwap project.

## Format
`## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2024-10-26 - Custom Modals Lack Semantics
**Learning:** The application uses custom `div` overlays for modals (e.g., `PlayerCard`) without native `<dialog>` elements or ARIA roles. This makes them invisible to screen readers as modal dialogs.
**Action:** Always check `fixed inset-0` overlays for `role="dialog"`, `aria-modal="true"`, and focus management gaps.
