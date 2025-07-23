# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Firefox browser extension called "Colorful Windows Enhanced" that dynamically themes browser windows with different colors. Each new window gets assigned a unique color theme to help differentiate between windows or for aesthetic purposes. Version 4.0 adds advanced color science features including color harmony generation and smart palette creation.

## Architecture

The extension consists of:

- **manifest.json**: WebExtension manifest (v2) defining permissions for `tabs`, `theme`, and `storage` APIs
- **background.js**: Main extension logic using the WebExtensions API with ThemeManager class
- **color-picker.html**: Advanced color picker interface with harmony generation
- **color-picker.js**: Frontend logic for color selection, harmony, and palette generation
- **color-utils.js**: Advanced color science utilities (HSL/RGB conversion, harmony algorithms)
- **icon.png**: Extension icon (128px)
- **screenshots/**: Visual documentation

### Core Components

**ThemeManager class** (`background.js:7-83`):
- Manages theme distribution and custom color storage
- Tracks theme usage with least-used selection algorithm
- Handles automatic contrast calculation for custom colors
- Maintains separate maps for window themes and custom colors

**Theme Management**:
- `DEFAULT_THEMES`: Array of 21 carefully curated color themes for automatic assignment
- `windowThemes`: Map tracking automatic theme assignments
- `customColors`: Map storing per-window custom color preferences

**Core Functions**:
- `getNextTheme()`: O(n) selection of least-used theme
- `applyTheme(windowId, customColor)`: Applies theme with optional custom color
- `calculateContrastColor()`: Determines optimal text color for readability
- `freeTheme()`: Cleans up theme assignments when windows close

**Color Picker Interface**:
- 72 preset colors organized by color families (reds, oranges, yellows, greens, blues, purples, grays)
- Custom color picker with hex input validation
- Scrollable grid layout with 12-column responsive design
- Per-window color persistence using `storage.local`
- Real-time color preview and application

**Advanced Color Science (v4.0)**:
- **ColorUtils class**: Comprehensive color manipulation utilities
- **Color harmony generation**: Complementary, triadic, analogous, and monochromatic schemes
- **HSL/RGB conversion**: Optimized algorithms for color space transformations
- **Smart palette generation**: Create harmonious color palettes from base colors
- **Enhanced contrast calculation**: WCAG-inspired text color optimization
- **Interactive color theory**: Real-time harmony updates and selection

**Event Listeners**:
- Window creation/removal for automatic theming
- Browser action click for color picker access
- Message passing for UI-background communication

## Development

This is a simple browser extension with no build process, test suite, or package dependencies. Files can be modified directly and loaded into Firefox for testing using `about:debugging`.

### Performance Optimizations (v2.1)

The extension has been optimized with several performance improvements:

- **O(n) theme selection**: Replaced O(n log n) sorting with single-pass selection
- **Parallel window theming**: Uses `Promise.all` for faster startup with multiple windows  
- **Reduced memory allocations**: Eliminated temporary arrays and object creation
- **Better cache locality**: Direct array access instead of object property lookups

### Testing the Extension
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select the `manifest.json` file from this directory
4. Open new windows to see different color themes applied

### Performance Testing
To verify performance improvements:
1. Open Firefox DevTools (F12)
2. Go to Performance tab
3. Start recording before opening multiple windows
4. Compare with previous version metrics

### Key Extension Permissions
- `tabs`: Access to browser tabs API for window management
- `theme`: Ability to modify browser theme colors per window
- `storage`: Local storage for custom color persistence

### New Features in v4.x
- **Color harmony generation**: Interactive buttons for complementary, triadic, analogous, and monochromatic schemes
- **Smart palette generation**: Create harmonious color palettes from any base color
- **Advanced color science**: HSL/RGB conversion utilities and color theory algorithms
- **Real-time harmony updates**: Dynamic color scheme generation as you adjust colors
- **Enhanced contrast calculation**: WCAG-inspired text color optimization

### Improvements in v4.1
- **Preserved original palette**: Generated palettes appear in separate section, maintaining access to 72 original colors
- **Better UX organization**: Clear separation between preset colors, generated palettes, and harmony tools
- **Enhanced usability**: Clear button to hide generated palette when not needed

### Improvements in v4.2
- **Expanded automatic theming**: Automatic window colors now use 21 curated colors (3x more variety)
- **Better color distribution**: More diverse themes across reds, oranges, yellows, greens, blues, purples, and grays
- **Maintained compatibility**: Original 7 colors preserved as first colors in expanded palette

### Features from v3.x
- **Toolbar button**: Click to open color picker interface
- **Custom colors**: Choose any color for individual windows
- **Color persistence**: Custom colors saved and restored
- **Enhanced theming**: Improved toolbar and UI element coloring

## Claude's Learning Journey

- Learned that this is a Firefox-specific browser extension for dynamic window theming
- Understood the core logic of theme selection and application using JavaScript and WebExtensions API
- Recognized the performance optimization techniques implemented in version 2.1
- Noted the simplicity of the extension with direct file modifications and no complex build process
- Appreciated the thoughtful approach to theme distribution using usage tracking and timestamps