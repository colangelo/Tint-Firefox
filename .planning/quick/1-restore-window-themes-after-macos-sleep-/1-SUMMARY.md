---
phase: quick-1
plan: 01
subsystem: background
tags: [idle-api, sleep-wake, theme-restoration, gpu-context]

requires:
  - phase: none
    provides: n/a
provides:
  - "Sleep/wake theme restoration via browser.idle API"
  - "reapplyAllThemes() sequential window repainting function"
affects: [background-js, manifest-permissions]

tech-stack:
  added: [browser.idle.onStateChanged]
  patterns: [sequential-with-delay for GPU-safe repainting]

key-files:
  created: []
  modified: [background.js, manifest.json]

key-decisions:
  - "Sequential reapply with 200ms delay to avoid CPU spikes on wake"
  - "Read from in-memory maps first, session storage fallback, to avoid unnecessary writes"
  - "2s initial delay after 'active' state to let GPU context settle"

patterns-established:
  - "Sleep/wake pattern: idle listener -> delay -> sequential reapply"

requirements-completed: [SLEEP-WAKE-RESTORE]

duration: 1min
completed: 2026-03-07
---

# Quick Task 1: Restore Window Themes After macOS Sleep Summary

**Sleep/wake theme restoration using browser.idle API with sequential 200ms-staggered reapply and 2s wake delay**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-07T13:31:09Z
- **Completed:** 2026-03-07T13:31:59Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added reapplyAllThemes() function with sequential window iteration and 200ms delay between windows
- Added idle.onStateChanged listener that triggers theme restoration 2s after wake
- Added idle permission to manifest.json

## Task Commits

Each task was committed atomically:

1. **Task 1: Add reapplyAllThemes and idle listener to background.js** - `a52c5c6` (feat)
2. **Task 2: Add idle permission to manifest.json** - `44b4734` (chore)

## Files Created/Modified
- `background.js` - Added reapplyAllThemes() async function and idle.onStateChanged listener
- `manifest.json` - Added "idle" to permissions array

## Decisions Made
- Sequential reapply (for...of) instead of parallel (Promise.all) to avoid CPU spikes when GPU context is re-initializing
- In-memory map lookup first (customColors, windowThemes) before falling back to session storage, avoiding unnecessary applyTheme calls that would increment usage counters
- 2-second initial delay after 'active' state detection to let the GPU context fully settle before issuing theme.update calls

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Feature complete and ready for manual testing (load extension, open windows, sleep/wake Mac, verify themes restore)
- No blockers

---
*Phase: quick-1*
*Completed: 2026-03-07*
