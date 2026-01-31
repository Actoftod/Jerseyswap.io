## 2024-05-22 - Semantic Refactoring Impact
**Learning:** Replacing clickable `div`s with semantic `<button>` elements immediately enables keyboard focus and interaction, but can introduce default user agent styles (borders, padding) that need resetting.
**Action:** When refactoring for accessibility, verify that existing utility classes (like Tailwind's) sufficiently override browser defaults for the new element type.
