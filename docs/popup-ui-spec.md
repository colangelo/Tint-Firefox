# Plan: Popup UI with Accordion Design

## Summary

Redesign the color picker to work as a browser action popup instead of opening in a new tab. Use collapsible accordion sections to fit all features within Firefox's 800×600px popup limit.

## Current vs Target

| Aspect | Current | Target |
|--------|---------|--------|
| Opens as | New tab | Popup from toolbar |
| Width | 360px (unlimited height) | 360px × ~500px max |
| Sections | All expanded | Accordion (collapsed by default) |
| Access | Click icon → new tab | Click icon → instant popup |

## Design Mockup

```
┌─────────────────────────────────┐
│ 🎨 Choose Window Color          │
├─────────────────────────────────┤
│ ⭐ Quick Pick                    │
│ ●●●●●●●●●●●● (12 favorites)     │
├─────────────────────────────────┤
│ ▶ All Preset Colors (72)        │  <- Click to expand
├─────────────────────────────────┤
│ ▶ Color Harmony                 │  <- Complementary, Triadic, etc.
├─────────────────────────────────┤
│ ▶ Generate Palette              │
├─────────────────────────────────┤
│ ▶ Custom Color                  │  <- Hex input + picker
├─────────────────────────────────┤
│ [  Apply Color  ] [Reset Auto]  │
└─────────────────────────────────┘
```

When expanded:
```
│ ▼ All Preset Colors (72)        │
│ ┌─────────────────────────────┐ │
│ │ ●●●●●●●●●●●●                │ │
│ │ ●●●●●●●●●●●●  (scrollable)  │ │
│ │ ●●●●●●●●●●●●                │ │
│ └─────────────────────────────┘ │
```

---

## Implementation Plan

### Phase 1: Update manifest.json

Change from programmatic tab opening to popup:

```json
"browser_action": {
  "default_icon": {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png"
  },
  "default_popup": "popup.html",
  "default_title": "Choose window color"
}
```

### Phase 2: Create popup.html

New file with accordion structure using native `<details>` elements:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <h3>🎨 Choose Window Color</h3>

  <!-- Quick Pick (always visible) -->
  <section class="quick-pick">
    <h4>Quick Pick</h4>
    <div id="quickColors" class="color-grid quick"></div>
  </section>

  <!-- Accordion sections -->
  <details id="presetsSection">
    <summary>All Preset Colors (72)</summary>
    <div id="presetColors" class="color-grid"></div>
  </details>

  <details id="harmonySection">
    <summary>Color Harmony</summary>
    <div class="harmony-buttons">
      <button data-type="complementary">Complementary</button>
      <button data-type="triadic">Triadic</button>
      <button data-type="analogous">Analogous</button>
      <button data-type="monochromatic">Monochromatic</button>
    </div>
    <div id="harmonyColors" class="color-grid harmony"></div>
  </details>

  <details id="paletteSection">
    <summary>Generate Palette</summary>
    <button id="generatePaletteBtn">Generate from Selected</button>
    <div id="generatedPalette" class="color-grid"></div>
  </details>

  <details id="customSection">
    <summary>Custom Color</summary>
    <div class="custom-input">
      <input type="color" id="colorPicker" value="#6699cc">
      <input type="text" id="colorValue" value="#6699cc" placeholder="#RRGGBB">
    </div>
  </details>

  <!-- Actions (always visible) -->
  <div class="actions">
    <button id="applyBtn" class="primary">Apply Color</button>
    <button id="resetBtn" class="danger">Reset to Auto</button>
  </div>

  <script src="color-utils.js"></script>
  <script src="popup.js"></script>
</body>
</html>
```

### Phase 3: Create popup.css

Compact styles optimized for popup constraints:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  width: 340px;
  max-height: 580px;
  padding: 12px;
  font-family: system-ui, sans-serif;
  font-size: 13px;
  overflow-y: auto;
  overflow-x: hidden;
}

h3 { margin-bottom: 12px; font-size: 15px; }
h4 { margin-bottom: 8px; font-size: 12px; color: #666; }

/* Color grids */
.color-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
}
.color-grid.quick { grid-template-columns: repeat(12, 1fr); }
.color-grid.harmony { grid-template-columns: repeat(5, 1fr); }

.color-option {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s;
}
.color-option:hover { transform: scale(1.15); }
.color-option.selected { border-color: #333; }

/* Accordion */
details {
  border-top: 1px solid #eee;
  padding: 8px 0;
}
details summary {
  cursor: pointer;
  padding: 6px 0;
  font-weight: 500;
  user-select: none;
  list-style: none;
}
details summary::before {
  content: '▶ ';
  font-size: 10px;
}
details[open] summary::before {
  content: '▼ ';
}
details > div, details > button {
  padding-top: 8px;
}

/* Scrollable preset colors when expanded */
#presetColors {
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: thin;
}

/* Harmony buttons */
.harmony-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}
.harmony-buttons button {
  padding: 6px;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.harmony-buttons button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* Custom color input */
.custom-input {
  display: flex;
  gap: 8px;
  align-items: center;
}
#colorPicker { width: 40px; height: 32px; border: none; }
#colorValue { flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; }

/* Action buttons */
.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.actions button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}
.primary { background: #4CAF50; color: white; }
.danger { background: #f44336; color: white; }

/* Quick pick section */
.quick-pick {
  padding-bottom: 8px;
  margin-bottom: 4px;
}
```

### Phase 4: Create popup.js

Refactored from color-picker.js for popup context:

- Remove tab management logic (popup auto-closes)
- Add Quick Pick favorites (first 12 most vibrant colors)
- Simplify initialization (popup knows current window automatically)
- Remember accordion state in localStorage
- Keep all color harmony and palette features

### Phase 5: Update background.js

Remove tab creation logic, simplify to just message handling:

```javascript
// Remove browserAction.onClicked listener (popup handles it now)
// Keep only message handlers for setWindowColor and resetWindowColor
```

### Phase 6: Keep color-picker.html (Optional)

Optionally keep the full tab version accessible via:
- Right-click context menu "Open full color picker"
- Or link in popup footer "Open in tab →"

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `manifest.json` | Add `default_popup` |
| `popup.html` | Create (new) |
| `popup.css` | Create (new) |
| `popup.js` | Create (new, based on color-picker.js) |
| `background.js` | Remove browserAction.onClicked |
| `color-picker.html` | Keep as optional full version |

---

## Quick Pick Colors (12 favorites)

Select 12 vibrant, distinct colors for always-visible quick pick:

```javascript
const QUICK_COLORS = [
  '#ec5f67', '#f99157', '#fac863', '#99c794',  // red, orange, yellow, green
  '#5fb3b3', '#6699cc', '#c594c5', '#ff4757',  // cyan, blue, purple, pink
  '#32ff7e', '#70a1ff', '#feca57', '#a55eea'   // lime, sky, gold, violet
];
```

---

## Verification

1. `just package` and load in Firefox
2. Click toolbar icon → popup appears instantly
3. Test Quick Pick colors apply correctly
4. Expand each accordion section, verify scrolling works
5. Test all harmony buttons generate colors
6. Test palette generation
7. Test custom hex input
8. Verify Apply/Reset work correctly
9. Popup dismisses when clicking outside
10. State persists (accordion open/closed) across popup opens

---

## Version

This will be version **4.5.0** - new popup UI
