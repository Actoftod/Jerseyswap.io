## 2026-01-27 - [Manual Code Splitting in State-Based Routing]
**Learning:** This project uses a monolithic `App.tsx` with state-based routing ('AppStep') instead of a routing library. This means all components were statically imported, bloating the initial bundle.
**Action:** Applied `React.lazy` and `Suspense` manually around the conditional render blocks. Future optimizations should watch for `App.tsx` growing too large and consider splitting the state management or using a router if complexity increases.
