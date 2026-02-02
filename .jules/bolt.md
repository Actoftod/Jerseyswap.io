## 2026-02-02 - Avoid instantiation in useRef default value
**Learning:** Passing `new Service()` directly to `useRef` causes the constructor to run on every render, even though `useRef` discards subsequent values.
**Action:** Use lazy initialization: `useRef(null)` and check `if (!ref.current) ref.current = new Service()` during render.
