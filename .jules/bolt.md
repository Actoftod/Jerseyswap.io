## 2025-10-26 - useRef Constructor Anti-Pattern

**Learning:** Initializing `useRef` with `new Class()` (e.g., `useRef(new GeminiService())`) executes the constructor on *every* render, even though the result is discarded after the first render. This causes unnecessary allocations and potentially expensive initialization logic (like API key validation) to run repeatedly.

**Action:** Use lazy initialization for expensive objects in `useRef`:
```typescript
const ref = useRef<Service | null>(null);
if (!ref.current) {
  ref.current = new Service();
}
```
