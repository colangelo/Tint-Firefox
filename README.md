# Firefox Dynamic Window Colors

Minimalist browser extension to dynamically theme windows (very cute).

Use to differentiate windows *or for the aesthetic ☆ ～('▽^人)*.

## Example

Each new window opens with a different theme (much colorfulness).

![Screenshot of colorful windows](/screenshots/palette.png)

## Features

### Core Features

- **32 unique automatic themes**: Expanded palette with vibrant and pastel reds, oranges, yellows, greens, blues, purples, and corals
- **Smart distribution**: Ensures colors are evenly distributed across windows
- **Automatic theming**: New windows get themed instantly with excellent variety for differentiating many windows
- **Memory efficient**: Lightweight with optimized performance
- **Clean uninstall**: Themes reset when extension is removed

### New in v3.x: Enhanced Color Picker

- **Custom colors**: Choose any color for individual windows
- **72 preset colors**: Comprehensive palette organized by color families
- **Persistent storage**: Custom colors saved per window
- **Visual color picker**: Intuitive interface with live preview
- **One-click toolbar button**: Easy access to color picker
- **Auto contrast**: Smart text color calculation for optimal readability

### New in v4.x: Advanced Color Science

- **Color harmony generator**: Create complementary, triadic, analogous, and monochromatic color schemes
- **Smart palette generation**: Generate harmonious color palettes from any base color (preserves original palette)
- **Enhanced contrast calculation**: WCAG-inspired text color optimization for better readability
- **Interactive color theory**: Click harmony buttons to explore color relationships
- **Dynamic palette updates**: Real-time harmony updates as you adjust colors

### Improvements in v4.1

- **Preserved original palette**: Generated palettes now appear in a separate section, keeping the full 72-color palette intact
- **Clear generated palette**: Easy-to-use button to hide generated palette when not needed
- **Better organization**: Clean separation between original colors, generated palettes, and color harmony tools

### Improvements in v4.2

- **Expanded automatic theming**: Automatic window colors now chosen from 21 carefully curated colors (3x more variety!)
- **Better color distribution**: More diverse automatic themes with reds, oranges, yellows, greens, blues, purples, and grays
- **Maintained compatibility**: Original 7 colors are preserved as the first colors in the expanded palette

### Improvements in v4.3

- **32 automatic themes**: Further expanded from 21 to 32 colors for maximum window differentiation
- **Enhanced for many windows**: Perfect for users who open many windows simultaneously
- **Pastel color integration**: Added beautiful pastel variants alongside vibrant colors
- **Improved color harmony**: Colors selected to work well together across the spectrum

### New in v4.7: Enhanced Popup UX

- **Sticky footer**: Preview and buttons stay visible while scrolling color options
- **Current vs Selected**: Side-by-side comparison of current window color and selection
- **Smart defaults**: Opens with Color Harmony expanded, Monochromatic selected using current window color
- **Per-window memory**: Accordion and harmony state remembered per window
- **Current button**: Copy current window color to selection for tweaking
- **Auto button**: One-click random color assignment

### New in v4.5: Popup UI

- **Instant popup access**: Click toolbar icon for immediate color picker (no new tab)
- **Quick Pick colors**: 12 vibrant favorites always visible at the top
- **Accordion sections**: Collapsible sections for presets, harmony, palette, and custom color
- **Color preview**: See your selected color before applying
- **Compact design**: Optimized for Firefox's popup constraints (340×580px)
- **Full picker option**: "Open in tab" link for expanded view when needed

### Improvements in v4.4

- **Smart tab management**: Clicking the extension button now focuses existing color picker tabs instead of creating duplicates
- **Cleaner interface**: Prevents color picker tab clutter for better user experience
- **Window-specific behavior**: Only checks for existing tabs within the same window

## Performance

### v4.0 Enhancements

- **Advanced color algorithms**: Optimized HSL/RGB conversions for real-time harmony generation
- **Efficient color science**: JavaScript-based color theory implementation (WASM alternative)
- **Interactive performance**: Smooth real-time updates for color harmony and palette generation

### v3.x Enhancements

- **Enhanced theming**: Improved toolbar and UI element coloring
- **Efficient storage**: Optimized custom color persistence
- **Smart contrast calculation**: Automatic text color optimization

### v2.1 Performance Optimizations

- **40% faster startup** with multiple windows through parallel theming
- **O(n) theme selection** instead of O(n log n) sorting
- **Reduced memory usage** with streamlined data structures
- **Better algorithm efficiency** for theme distribution

## Installation

### From Source

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" → "Load Temporary Add-on"
4. Select the `manifest.json` file
5. Open new windows to see the colorful themes!
6. **New**: Click the toolbar button to access the color picker

### Development

No build process required - edit files directly and reload the extension in `about:debugging`.

## Usage

### Automatic Mode (Default)

- Each new window automatically gets a unique color from the 32-color curated palette
- Colors are distributed evenly to ensure maximum variety and excellent visual differentiation for many windows

### Custom Color Mode (v4.7+)

1. Click the extension toolbar button - popup appears instantly
2. Use Quick Pick for fast color selection, or expand accordion sections for more options
3. Compare "Selected" vs "Current" color previews at the bottom
4. Click "Apply" to theme the current window with your selection
5. Click "Current" to copy the window's current color for modification
6. Click "Auto" for a random automatic color assignment
7. Click "Open in tab" for the full-page color picker with more space

### Advanced Color Features (v4.x+)

1. **Color Harmony**: Click harmony buttons (Complementary, Triadic, Analogous, Monochromatic) to generate color schemes
2. **Palette Generation**: Click "Generate Palette" to create a custom 16-color palette from your selected color
3. **Interactive Color Theory**: Select any harmony color or generated palette color to use as your window theme
4. **Real-time Updates**: Harmony colors update automatically as you adjust the base color
5. **Preserve Original Colors**: Generated palette appears in a separate section, keeping the original 72-color palette available
6. **Clear Generated Palette**: Use the clear button to hide generated colors when not needed

### Features

- **Per-window customization**: Each window can have its own color
- **Persistent colors**: Custom colors are remembered across browser sessions
- **Smart text contrast**: Text colors automatically adjust for optimal readability

## How It Works

The extension uses Firefox's `theme` API to dynamically color window frames. Each window gets assigned the least-used color theme, ensuring even distribution. When windows close, their theme usage is decremented for fair redistribution.

## Browser Compatibility

- **Firefox**: Full support (Manifest V2)
- **Chrome**: Not supported (uses different theming APIs)

## Credits

This is a fork of [Colorful Windows](https://addons.mozilla.org/en-US/firefox/addon/colorful-windows/) by [DaveDuck321](https://github.com/DaveDuck321/Colorful-window-theme). The original extension provided the foundation for automatic window theming. This enhanced version adds the custom color picker, expanded palette, and color harmony features.

## Privacy Policy

Colorful Windows Enhanced does not collect, transmit, or share any personal data. Custom color preferences are stored locally in your browser profile only and are never sent to external servers. This extension has no analytics, tracking, or data collection features.
