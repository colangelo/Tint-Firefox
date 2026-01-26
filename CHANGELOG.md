# Changelog

All notable changes to Colorful Windows Enhanced are documented here.

## [5.0.0] - 2026-01-26

### Added
- **Color persistence**: Window colors now persist across Firefox restarts and extension reloads
- Uses `browser.sessions` API to save and restore colors per window
- New `sessions` permission required

### Improved
- **Tab view scaling**: Tab view now 45% larger than popup using CSS zoom for better readability

## [4.8.0] - 2026-01-26

### Added
- **Dark mode support**: Popup UI automatically follows system dark/light preference
- CSS custom properties for all UI colors with `prefers-color-scheme` media query
- Dark theme uses `#1a1a1a` background with appropriate contrast colors

### Fixed
- Popup color scheme no longer changes when applying light-colored window themes
- Added `color_scheme: "system"` to theme properties to keep popup following OS preference

## [4.7.5] - 2026-01-26

### Changed
- **Renamed to "Tint"**: Extension title now shows "Tint (vX.X.X)" with dynamic version
- **Unified UI**: Popup and tab views now share the same codebase (removed color-picker.html/js)
- **Button order**: Swapped Random and Current button positions

### Improved
- **Tab view experience**: "Open in tab" link hidden when already in tab view
- **Auto-expand sections**: All accordion sections expand automatically in tab view
- **Responsive design**: Centered layout (400px max) for full-page tab view

### Removed
- Removed standalone color-picker.html and color-picker.js (functionality merged into popup)

## [4.7.4] - 2026-01-26

### Changed
- **New extension icon**: Updated icon design
- **Button order**: Swapped Random and Current button positions

## [4.7.3] - 2026-01-26

### Changed
- **Renamed to "Tint"**: Popup title now shows "Tint (vX.X.X)" with dynamic version from manifest
- **Unified UI**: Popup and tab views share the same codebase
- **Browser action tooltip**: Updated to "Tint - Window Color"

### Removed
- Removed color-picker.html and color-picker.js (merged into popup)

## [4.7.2] - 2026-01-26

### Changed
- **Quick Pick reorder**: Traditional green/red color arrangement

### Fixed
- Clear customColors map when resetting to auto
- Ensure current color is available when popup opens

## [4.7.1] - 2026-01-26

### Changed
- **New icons**: Updated extension icon design
- **Footer redesign**: Reorganized popup footer with color-coded styling
- **Button colors**: Updated button and preview color scheme
- **Preview border**: Selected preview border matches Apply button green

## [4.7.0] - 2025-01-26

### Added
- **Sticky footer**: Color preview and action buttons stay fixed at bottom while content scrolls
- **Current color preview**: Shows window's current color alongside selected color for easy comparison
- **Per-window popup state**: Accordion and harmony selections persist per window
- **Smart defaults**: First popup open shows Color Harmony expanded with Monochromatic selected
- **Current button**: Copy current window color to selection for modification
- **Auto button**: Randomly assign a new automatic color to the window

### Changed
- Harmony button order: Monochromatic, Analogous, Complementary, Triadic
- Uses current window color as base for initial monochromatic harmony
- Replaced "Reset to Auto" with separate "Current" and "Auto" buttons
- Compact button styling for three-button layout

### Improved
- Better visual feedback when applying colors
- Immediate current preview update when using Auto

## [4.6.1] - 2025-01-26

### Added
- **Current color preview**: Shows window's applied color alongside selected color in footer

## [4.6.0] - 2025-01-26

### Added
- **Sticky footer**: Color preview and action buttons stay fixed at bottom while content scrolls
- Flexbox layout separating scrollable content from fixed footer

## [4.5.0] - 2025-01-25

### Added
- **Popup UI**: Color picker now opens as instant popup from toolbar (no new tab)
- **Quick Pick**: 12 vibrant favorite colors always visible at top
- **Color preview**: Large swatch shows selected color with hex value before applying
- **Accordion design**: Collapsible sections for presets (72), harmony, palette, and custom color
- **"Open in tab" link**: Access full-page color picker when more space needed

### Changed
- Browser action now uses `default_popup` instead of programmatic tab creation
- Removed `browserAction.onClicked` listener from background.js
- Accordion state persists across popup opens

### Improved
- Instant access - popup appears immediately on click
- Compact 340×580px design optimized for Firefox popup constraints
- Better UX - see color preview before committing

## [4.4.3] - 2025-01-24

### Changed
- Prepared for Firefox AMO release
- Added `browser_specific_settings.gecko.id` for AMO submission
- Added `data_collection_permissions` declaration
- Updated `strict_min_version` to 142.0
- Created proper icon variants (48px, 96px, 128px)
- Added privacy policy to README
- Added credits for original Colorful Windows extension

## [4.4.0] - 2025-07-23

### Fixed
- Smart tab management: Browser action now focuses existing color picker tabs instead of creating duplicates
- Window-scoped logic: Only checks for existing tabs within the same window
- Fix for location bar coloring

### Improved
- Prevents tab clutter and provides more intuitive behavior

## [4.3.0] - 2025-07-23

### Added
- Expanded to 32 automatic themes for maximum window differentiation
- Pastel color variants alongside vibrant colors

### Improved
- Optimized for users who open many windows simultaneously
- Better distribution across the entire color spectrum
- Colors selected to work well together

## [4.2.0] - 2025-07-23

### Changed
- Expanded automatic theming from 7 to 21 curated colors (3x more variety)
- More diverse themes across reds, oranges, yellows, greens, blues, purples, and grays
- Original 7 colors preserved as first colors in expanded palette

## [4.1.0] - 2025-07-23

### Improved
- Generated palettes now appear in separate section, keeping original 72-color palette intact
- Clear separation between preset colors, generated palettes, and harmony tools
- Added clear button to hide generated palette when not needed

## [4.0.0] - 2025-07-23

### Added
- **Color harmony generation**: Complementary, triadic, analogous, and monochromatic schemes
- **Smart palette generation**: Create harmonious 16-color palettes from any base color
- **ColorUtils class**: Advanced color manipulation utilities
- **HSL/RGB conversion**: Optimized algorithms for color space transformations
- **Real-time harmony updates**: Dynamic color scheme generation as you adjust colors
- **Enhanced contrast calculation**: WCAG-inspired text color optimization

## [3.1.0] - 2025-07-23

### Improved
- Enhanced theming for toolbar and UI elements
- Better color persistence

## [3.0.0] - 2025-07-23

### Added
- **Toolbar button**: Click to open color picker interface
- **Custom colors**: Choose any color for individual windows
- **72 preset colors**: Organized by color families (reds, oranges, yellows, greens, blues, purples, grays)
- **Color persistence**: Custom colors saved per window using `storage.local`
- **Auto contrast**: Smart text color calculation for optimal readability

## [2.1.0] - 2025-07-23

### Performance
- **40% faster startup** with multiple windows through parallel theming
- **O(n) theme selection** instead of O(n log n) sorting
- Reduced memory allocations by eliminating temporary arrays
- Better cache locality with direct array access

## [1.0.0] - Initial Fork

### Added
- Fork of [Colorful Windows](https://github.com/DaveDuck321/Colorful-window-theme) by DaveDuck321
- Basic automatic window theming with 7 colors
- Least-used color selection algorithm
