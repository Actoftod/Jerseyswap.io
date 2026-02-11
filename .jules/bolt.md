## 2025-02-12 - [Code Splitting named exports]
**Learning:** When using `React.lazy` on a component that only has a named export, you must either convert it to a default export or use the `{ default: module.Component }` pattern. I chose to add a default export to `components/SocialFeed.tsx` to maintain backward compatibility while enabling lazy loading.
**Action:** Always check component export types (named vs default) before applying `React.lazy`.
