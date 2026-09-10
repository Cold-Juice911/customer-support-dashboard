# Verification record

Checked on September 11, 2026. The production bundle was served locally and exercised through the browser interface. Deployment is reserved for the repository owner.

## Automated checks

- `npm run check`: passed ESLint, Prettier, 14 Vitest tests, strict TypeScript compilation, and the Vite production build.
- The unit tests cover combined filters, trimmed/case-insensitive searches, subject/ID searches, global statistics, sort direction and immutability, empty data, status/priority updates, invalid IDs, unchanged values, timestamps, conversation preservation, errors/retry, overlapping requests, and invalid or blocked browser storage.
- Dependency audit after updating Vitest: zero known vulnerabilities in the installed dependency tree at the time checked.
- The final production browser session reported no console errors.

## Browser checks

| Flow                                                 | Desktop light | Desktop dark | Mobile light | Mobile dark |
| ---------------------------------------------------- | ------------- | ------------ | ------------ | ----------- |
| Search and combined status/priority filters          | Passed        | Passed       | Passed       | Passed      |
| Filtered-empty state and clearing filters            | Passed        | Passed       | Passed       | Passed      |
| Inline status changes and live statistics            | Passed        | Passed       | Passed       | Passed      |
| Detail status/priority edits and conversation        | Passed        | Passed       | Passed       | Passed      |
| Mark Resolved / Reopen ticket                        | Passed        | Passed       | Passed       | Passed      |
| Created-date / priority sorting                      | Passed        | Passed       | Passed       | Passed      |
| Loading, error, Retry, empty workspace, sample reset | Passed        | Passed       | Passed       | Passed      |

Desktop captures use 1440 × 1000. Mobile captures use 390 × 844. Additional checks covered 320 px narrow-screen layout, 768 px tablet layout, and the 1024/1025 px navigation boundary. Tables turn into cards on mobile; the tablet detail panel is 600 px wide; mobile details fill the available screen. No horizontal page or panel overflow was found at the checked widths.

Theme and combined filters survived reloads. Session ticket edits reset to the sample dataset on reload, as documented. `/` focuses search without intercepting typing in form controls. Native selects and all ticket actions were operated through browser controls.

Tab and Shift+Tab wrap within the ticket dialog. Escape closes it and restores the opening subject's focus. If an edit removes the opening ticket from the current filter, focus returns to search. The same fallback works for an inline status edit that removes its row. Notifications render in the active dialog. Mobile navigation opens, filters the queue, and closes correctly.

The production CSS contains the reduced-motion override. Computed theme-token contrast checks covered primary, secondary, and accent text on the main surfaces, button text on the accent, and semantic badge text on its tinted surface. The lowest checked text contrast was **4.59:1 in light mode** and **4.95:1 in dark mode**. These checks and keyboard review are not a claim of a complete independent accessibility certification or testing on every browser/device.

## Fixes found during review

- Added explicit dialog focus wrapping, since native Tab behavior could reach browser chrome.
- Moved status notifications into the active dialog's accessible layer.
- Preserved keyboard focus when an inline edit removes a ticket from a filtered list.
- Made Clear filters cancel search text that is still waiting for the debounce.
- Regenerated the production CSS to verify the exact tablet/desktop boundary after a development-preview cache held an earlier rule.

Screenshots in `docs/screenshots/` are actual captures of the working application. GitHub Actions reruns the code checks for subsequent changes and performs no deployment.
