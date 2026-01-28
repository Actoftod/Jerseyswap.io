## 2024-05-23 - [Service Instantiation Anti-Pattern]
**Learning:** Found `useRef(new Service())` pattern which causes service instantiation on every render, even though the ref only uses the first instance. This is a silent performance cost, especially if the constructor has side effects or heavy initialization (like environment variable parsing or SDK setup).
**Action:** Use `useMemo(() => new Service(), [])` or lazy `useRef` initialization to ensure singleton-like behavior in components.
