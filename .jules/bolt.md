## 2024-05-22 - Code Splitting for Performance
**Learning:** Moving large components to `React.lazy` imports significantly reduces the initial bundle size, which is critical for the "Auth" path where these components are not needed. Also, defining static data like the `sports` array outside the component avoids unnecessary allocations on every render.
**Action:** Always evaluate if a component needs to be in the main bundle or if it can be lazy loaded, especially for route-based or step-based rendering. Keep static constants outside of React components.
