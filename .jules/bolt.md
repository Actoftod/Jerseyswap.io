## 2024-05-22 - React Ref Instantiation Anti-Pattern
**Learning:** `useRef(new Class())` executes the constructor on *every* render, throwing away the instance on subsequent renders. This creates unnecessary object allocation and garbage collection pressure, especially in root components that re-render frequently.
**Action:** Use `useState(() => new Class())` for clean lazy initialization that runs exactly once.
