## 2024-05-22 - [Pattern: Missing ARIA Labels]
**Learning:** Icon-only buttons are consistently implemented without ARIA labels or alternative text, making core navigation inaccessible to screen readers. This seems to be a systematic oversight in the current design system.
**Action:** When adding new icon-only interactive elements, enforce a requirement for 'aria-label' props during code review or component creation.
