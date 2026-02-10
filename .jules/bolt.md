## 2026-01-26 - Code Splitting Implementation
**Learning:** Monolithic bundles in React 19/Vite apps can be easily optimized by lazy loading route-level components. Even without a traditional router, conditional rendering in the main App component serves as a perfect boundary for code splitting.
**Action:** Always identify large, conditionally rendered component trees (like 'pages' or heavy modals) and wrap them in React.lazy + Suspense to improve initial load time.
