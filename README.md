# Firefox Dynamic Window Colors

Minimalist browser extension to dynamically theme windows (very cute).

Use to differentiate windows *or for the aesthetic ☆ ～('▽^人)*.

## Example

Each new window opens with a different theme (much colorfulness).

![Screenshot of colorful windows](/screenshots/palette.png)

## Features

### Core Features

- **7 unique color themes**: Red, orange, yellow, green, cyan, blue, purple
- **Smart distribution**: Ensures colors are evenly distributed across windows
- **Automatic theming**: New windows get themed instantly
- **Memory efficient**: Lightweight with optimized performance
- **Clean uninstall**: Themes reset when extension is removed

### New in v3.x: Enhanced Color Picker

- **Custom colors**: Choose any color for individual windows
- **72 preset colors**: Comprehensive palette organized by color families
- **Persistent storage**: Custom colors saved per window
- **Visual color picker**: Intuitive interface with live preview
- **One-click toolbar button**: Easy access to color picker
- **Auto contrast**: Smart text color calculation for optimal readability

### New in v4.0: Advanced Color Science

- **Color harmony generator**: Create complementary, triadic, analogous, and monochromatic color schemes
- **Smart palette generation**: Generate harmonious color palettes from any base color
- **Enhanced contrast calculation**: WCAG-inspired text color optimization for better readability
- **Interactive color theory**: Click harmony buttons to explore color relationships
- **Dynamic palette updates**: Real-time harmony updates as you adjust colors

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

- Each new window automatically gets a unique color from the 7-color palette
- Colors are distributed evenly to ensure variety

### Custom Color Mode (v3.x+)

1. Click the extension toolbar button (colorful window icon)
2. Choose from 72 preset colors organized by color families or use the custom color picker
3. Click "Apply Color" to theme the current window
4. Use "Reset to Auto" to return to automatic color assignment

### Advanced Color Features (v4.0+)

1. **Color Harmony**: Click harmony buttons (Complementary, Triadic, Analogous, Monochromatic) to generate color schemes
2. **Palette Generation**: Click "Generate Palette" to create a custom color palette from your selected color
3. **Interactive Color Theory**: Select any harmony color to use it as your window theme
4. **Real-time Updates**: Harmony colors update automatically as you adjust the base color

### Features

- **Per-window customization**: Each window can have its own color
- **Persistent colors**: Custom colors are remembered across browser sessions
- **Smart text contrast**: Text colors automatically adjust for optimal readability

## How It Works

The extension uses Firefox's `theme` API to dynamically color window frames. Each window gets assigned the least-used color theme, ensuring even distribution. When windows close, their theme usage is decremented for fair redistribution.

## Browser Compatibility

- **Firefox**: Full support (Manifest V2)
- **Chrome**: Not supported (uses different theming APIs)
