# Firefox Dynamic Window Colors

Minimalist browser extension to dynamically theme windows (very cute).

Use to differentiate windows *or for the aesthetic ☆ ～('▽^人) *.

## Example

Each new window opens with a different theme (much colorfulness).

![Screenshot of colorful windows](/screenshots/palette.png)

## Features

- **7 unique color themes**: Red, orange, yellow, green, cyan, blue, purple
- **Smart distribution**: Ensures colors are evenly distributed across windows
- **Automatic theming**: New windows get themed instantly
- **Memory efficient**: Lightweight with optimized performance
- **Clean uninstall**: Themes reset when extension is removed

## Performance (v2.1)

This version includes significant performance optimizations:

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

### Development
No build process required - edit files directly and reload the extension in `about:debugging`.

## How It Works

The extension uses Firefox's `theme` API to dynamically color window frames. Each window gets assigned the least-used color theme, ensuring even distribution. When windows close, their theme usage is decremented for fair redistribution.

## Browser Compatibility

- **Firefox**: Full support (Manifest V2)
- **Chrome**: Not supported (uses different theming APIs)