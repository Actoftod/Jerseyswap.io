## 2024-01-24 - Missing CI/CD Infrastructure
**Learning:** This codebase lacks standard `test` and `lint` scripts in `package.json`. Verification relies heavily on `npm run build` (tsc) and visual checks.
**Action:** Prioritize `npm run build` to catch type errors and perform thorough visual verification for every change.
