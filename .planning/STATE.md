# Tint - Project State

**Current milestone:** 1 - Maintenance & Bug Fixes
**Current phase:** None (quick tasks only)
**Last activity:** 2026-03-07 - Completed quick task 1 (sleep/wake theme restoration)

### Completed Quick Tasks

| Task | Name | Duration | Date |
|------|------|----------|------|
| 1 | Restore window themes after macOS sleep | 1 min | 2026-03-07 |

### Decisions

- Sequential reapply with 200ms delay to avoid CPU spikes on wake
- In-memory map lookup before session storage fallback
- 2s initial delay after idle 'active' state for GPU context settling

### Blockers/Concerns

None.
