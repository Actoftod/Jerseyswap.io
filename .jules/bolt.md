## 2026-02-03 - Lazy Initialization of refs
**Learning:** Found `useRef(new Service())` pattern which causes the service constructor to run on every render, even though the ref value is stable.
**Action:** Use `useRef<Service | null>(null)` and initialize lazily inside render logic or effect to avoid expensive object creation on every render.
