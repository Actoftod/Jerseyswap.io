# Bolt's Journal

## 2024-05-22 - [Initial Setup]
**Learning:** Bolt journal initialized.
**Action:** Use this to track critical performance learnings.

## 2026-01-25 - React Memo Stability
**Learning:** `React.memo` on list items is ineffective without stable callbacks from the parent. `App.tsx` passes raw functions to `SocialFeed`, causing prop changes on every render.
**Action:** Always audit prop stability (use `useCallback`) when implementing `React.memo`, especially for handlers passed from root components.
