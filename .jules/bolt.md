## 2025-05-23 - Render Loop Allocations
**Learning:** `useRef(new Class())` executes the constructor on *every* render, even though the result is only used once.
**Action:** Use lazy initialization pattern or `useMemo(() => new Class(), [])` for expensive objects.

## 2025-05-23 - Constant Definition
**Learning:** Defining large constant arrays/objects inside component body causes reallocation on every render.
**Action:** Move static data outside the component or use `useMemo`.
