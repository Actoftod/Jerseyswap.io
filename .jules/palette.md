## 2026-01-30 - Div-based Buttons Accessibility
**Learning:** The application frequently uses `div` elements as buttons (e.g., logo, upload area) without proper ARIA roles or keyboard handlers.
**Action:** When touching these components, always convert them to `<button>` tags or ensure `role="button"`, `tabIndex={0}`, and `onKeyDown` (handling both Enter and Space) are present.
