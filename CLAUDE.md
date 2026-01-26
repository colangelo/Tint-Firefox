# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tint** - Firefox browser extension that dynamically themes browser windows with different colors. Each new window gets assigned a unique color theme to help differentiate between windows or for aesthetic purposes.

**Fork of**: [Colorful Windows](https://github.com/DaveDuck321/Colorful-window-theme) by DaveDuck321

## Architecture

```txt
├── manifest.json      # WebExtension manifest (v2)
├── background.js      # Main extension logic (ThemeManager class)
├── popup.html         # Unified UI (popup and tab view)
├── popup.css          # Styles (responsive for popup/tab)
├── popup.js           # UI logic (Quick Pick, accordion, harmony)
├── color-utils.js     # Color science utilities (HSL/RGB, harmony)
├── icons/             # Extension icons (48, 96, 128px)
├── justfile           # Project management recipes
├── package.sh         # Packaging script for AMO submission
└── screenshots/       # Visual documentation
```

### Core Components

**ThemeManager class** (`background.js`):

- `DEFAULT_THEMES`: Array of 32 curated color themes
- `windowThemes`: Map tracking automatic theme assignments
- `customColors`: Map storing per-window custom colors
- `getNextTheme()`: O(n) selection of least-used theme
- `applyTheme(windowId, customColor)`: Applies theme with optional custom color
- `calculateContrastColor()`: WCAG-inspired text color calculation
- `freeTheme()`: Cleanup when windows close

**ColorUtils class** (`color-utils.js`):

- `hexToRgb()` / `rgbToHex()`: Color format conversion
- `rgbToHsl()` / `hslToRgb()`: Color space conversion
- `generateHarmony(color, type)`: Complementary, triadic, analogous, monochromatic
- `generatePalette(color, count)`: Create harmonious palettes
- `getContrastRatio()`: WCAG contrast calculation
- `getAccessibleTextColor()`: AA-compliant text color selection

**Popup UI** (`popup.js`):

- Unified interface for both popup and tab views
- Quick Pick: 12 vibrant colors always visible
- Accordion sections: Presets (72), Harmony, Palette, Custom
- Color preview: Current vs Selected comparison
- Per-window state persistence via `storage.local`
- Responsive: popup (356px) vs tab (400px centered, auto-expand)

### Event Flow

1. Window created → `getNextTheme()` → `applyTheme()`
2. Browser action clicked → Popup appears (via `default_popup`)
3. User selects color → Preview updates → Apply button → Message to background
4. Background receives message → `applyTheme(windowId, color)`
5. Window closed → `freeTheme()` decrements usage counter

## Development

No build process required. Files are used directly.

### Project Management (justfile)

```bash
just                    # Show all available recipes
just debug              # Open Firefox about:debugging
just validate           # Check manifest.json validity
just version            # Show current version
just package            # Build .xpi and source.zip
just bump 4.5.0         # Update version in manifest
just release 4.5.0      # Bump + package
just full-release 4.5.0 # Clean + release + checklist
just clean              # Remove build artifacts
just inspect            # List .xpi contents
just commit "msg"       # Stage all + commit
just push               # Push main to casomai
just push-branch        # Push current branch
just gh-casomai         # Switch GitHub CLI account
```

### Testing

1. Run `just debug` or open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

### Packaging for AMO

```bash
just package   # or ./package.sh
```

Creates:

- `colorful-windows-enhanced-X.X.X.xpi` - Extension package
- `colorful-windows-enhanced-X.X.X-source.zip` - Source for review

### Key Permissions

| Permission | Purpose |
| ------------ | --------- |
| `tabs` | Open full color picker tab from popup |
| `theme` | Apply per-window color themes |
| `storage` | Persist custom color preferences |

## Performance Notes

- **Parallel initialization**: `Promise.all` for multiple windows at startup
- **O(n) theme selection**: Single-pass instead of sorting
- **Minimal allocations**: Reuses theme objects, avoids temporary arrays

## Related Documents

- `CHANGELOG.md` - Version history
- `ROADMAP.md` - Future development plans
- `README.md` - User documentation
