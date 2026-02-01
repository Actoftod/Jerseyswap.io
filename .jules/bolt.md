## 2026-02-01 - useRef Instantiation Anti-Pattern
**Learning:** Instantiating classes directly in `useRef(new Class())` causes the constructor to run on every render, even though the result is discarded after the first render.
**Action:** Use lazy initialization: `const ref = useRef(null); if (!ref.current) ref.current = new Class();` to ensure the constructor only runs once.
