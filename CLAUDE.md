# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firefox browser extension that dynamically themes browser windows with different colors. Each new window gets assigned a unique color theme to help differentiate between windows or for aesthetic purposes.

**Fork of**: [Colorful Windows](https://github.com/DaveDuck321/Colorful-window-theme) by DaveDuck321

## Architecture

```
├── manifest.json      # WebExtension manifest (v2)
├── background.js      # Main extension logic (ThemeManager class)
├── color-picker.html  # Color picker UI
├── color-picker.js    # Color picker frontend logic
├── color-utils.js     # Color science utilities (HSL/RGB, harmony)
├── icons/             # Extension icons (48, 96, 128px)
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

**Color Picker** (`color-picker.js`):
- 72 preset colors organized by families
- Custom hex input with validation
- Harmony generation buttons
- Palette generation
- Per-window persistence via `storage.local`

### Event Flow

1. Window created → `getNextTheme()` → `applyTheme()`
2. Browser action clicked → Open/focus color picker tab
3. User selects color → Message to background → `applyTheme(windowId, color)`
4. Window closed → `freeTheme()` decrements usage counter

## Development

No build process required. Files are used directly.

### Testing

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json`

### Packaging for AMO

```bash
./package.sh
```

Creates:
- `colorful-windows-enhanced-X.X.X.xpi` - Extension package
- `colorful-windows-enhanced-X.X.X-source.zip` - Source for review

### Key Permissions

| Permission | Purpose |
|------------|---------|
| `tabs` | Query/manage tabs for color picker deduplication |
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
