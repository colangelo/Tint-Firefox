---
phase: quick-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - background.js
  - manifest.json
autonomous: true
requirements: [SLEEP-WAKE-RESTORE]

must_haves:
  truths:
    - "Window themes visually restore after macOS sleep/wake cycle"
    - "Restoration is sequential with delays, not parallel"
    - "Extension continues to function normally for new/closed windows after wake"
  artifacts:
    - path: "background.js"
      provides: "reapplyAllThemes() function and idle.onStateChanged listener"
      contains: "reapplyAllThemes"
    - path: "manifest.json"
      provides: "idle permission"
      contains: "idle"
  key_links:
    - from: "browser.idle.onStateChanged"
      to: "reapplyAllThemes()"
      via: "setTimeout with 2000ms delay on 'active' state"
      pattern: "idle\\.onStateChanged"
    - from: "reapplyAllThemes()"
      to: "browser.theme.update()"
      via: "sequential loop with 200ms delay between windows"
      pattern: "theme\\.update"
---

<objective>
Add sleep/wake theme restoration to the Tint extension.

Purpose: When macOS sleeps, the GPU context is discarded and all window themes are lost visually. The color data is preserved in memory but the rendering layer forgets. This adds a listener that detects wake and sequentially reapplies all themes with staggered delays to avoid CPU spikes.

Output: Updated background.js with reapplyAllThemes() and idle listener, updated manifest.json with idle permission.
</objective>

<execution_context>
@/Users/ac/.config/claude/get-shit-done/workflows/execute-plan.md
@/Users/ac/.config/claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@background.js
@manifest.json
@PLAN.md
</context>

<interfaces>
<!-- Key types and contracts the executor needs from existing code -->

From background.js:
```javascript
// ThemeManager instance (global)
const themeManager = new ThemeManager();

// In-memory maps to read from:
themeManager.customColors    // Map<windowId, {color, textColor}>
themeManager.windowThemes    // Map<windowId, {color, usage, lastUsed}>

// Methods to call:
themeManager.applyTheme(windowId, customColor?)  // Full theme apply + session persist
themeManager.calculateContrastColor(hexColor)     // Returns '#000000' or '#ffffff'

// Session storage key: 'tintColor' per window
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Add reapplyAllThemes and idle listener to background.js</name>
  <files>background.js</files>
  <action>
Add a standalone `reapplyAllThemes()` async function BEFORE the startup handlers section (before line 164). This function:

1. Gets all windows via `browser.windows.getAll()`
2. Iterates sequentially (for...of loop, NOT Promise.all) over each window
3. For each window, checks in-memory maps first:
   - `themeManager.customColors.get(window.id)` for custom colors
   - `themeManager.windowThemes.get(window.id)` for tracked themes
   - If either exists, call `browser.theme.update(window.id, ...)` directly with the stored color and text color (use `calculateContrastColor` for tracked themes that lack textColor)
4. If no in-memory data, fall back to `browser.sessions.getWindowValue(window.id, 'tintColor')` and call `themeManager.applyTheme(window.id, savedColor)` if found
5. After each window, await a 200ms delay: `await new Promise(r => setTimeout(r, 200))`

Then add the idle listener AFTER the startup handlers (after line 180):

```javascript
// Sleep/wake handler — reapply themes after macOS discards GPU context
browser.idle.onStateChanged.addListener((state) => {
    if (state === 'active') {
        setTimeout(reapplyAllThemes, 2000);
    }
});
```

Use the exact theme update structure from the existing `applyTheme` method (frame, tab_background_text, toolbar, toolbar_text + color_scheme: "system").
  </action>
  <verify>
    <automated>grep -c "reapplyAllThemes" /Users/ac/_sync/ac-devops/_projects/Infra/Colorful-window-theme/background.js && grep -c "idle.onStateChanged" /Users/ac/_sync/ac-devops/_projects/Infra/Colorful-window-theme/background.js && grep "setTimeout(reapplyAllThemes, 2000)" /Users/ac/_sync/ac-devops/_projects/Infra/Colorful-window-theme/background.js</automated>
  </verify>
  <done>reapplyAllThemes() function exists with sequential 200ms-delayed loop, idle.onStateChanged listener registered with 2s initial delay on 'active' state</done>
</task>

<task type="auto">
  <name>Task 2: Add idle permission to manifest.json</name>
  <files>manifest.json</files>
  <action>
Add `"idle"` to the permissions array in manifest.json, after `"sessions"`.

Result should be:
```json
"permissions": [
    "tabs",
    "theme",
    "storage",
    "sessions",
    "idle"
]
```
  </action>
  <verify>
    <automated>node -e "const m = require('./manifest.json'); if (!m.permissions.includes('idle')) process.exit(1); console.log('idle permission present')" 2>/dev/null || python3 -c "import json; m=json.load(open('manifest.json')); assert 'idle' in m['permissions']; print('idle permission present')"</automated>
  </verify>
  <done>manifest.json permissions array includes "idle"</done>
</task>

</tasks>

<verification>
1. `grep "reapplyAllThemes" background.js` shows function definition and idle listener reference
2. `grep "idle" manifest.json` shows idle in permissions
3. Manual: Load extension in about:debugging, open 3+ windows, sleep/wake Mac, themes restore within ~4s
</verification>

<success_criteria>
- background.js contains reapplyAllThemes() with sequential 200ms-delayed window loop
- background.js contains idle.onStateChanged listener with 2s delay on 'active'
- manifest.json includes "idle" permission
- No changes to existing functionality (window create/remove/message handling unchanged)
</success_criteria>

<output>
After completion, create `.planning/quick/1-restore-window-themes-after-macos-sleep-/1-SUMMARY.md`
</output>
