# Tint - Firefox Window Colors

Firefox extension that gives each browser window a unique color theme. Originally a fork of [Colorful Windows](https://github.com/DaveDuck321/Colorful-window-theme) by DaveDuck321, Tint has evolved significantly with an expanded color palette, custom color picker, color harmony tools, and a redesigned interface.

**Why?** Visually distinguish between windows when working with multiple browser windows, or just enjoy the colors.

## Features

### Automatic Theming
- **32 curated themes**: Vibrant and pastel colors across the spectrum
- **Smart distribution**: Least-used color selection ensures variety
- **Instant theming**: New windows themed automatically


### Color Picker
- **Instant popup**: Click toolbar icon for immediate access
- **Quick Pick**: 12 vibrant favorites always visible
- **60 preset colors**: Curated and sorted by hue
- **Custom hex input**: Choose any color you want
- **Color preview**: Compare current vs selected before applying

### Color Science
- **Harmony generator**: Complementary, triadic, analogous, monochromatic schemes
- **Palette generation**: Create 16-color palettes from any base color
- **WCAG contrast**: Smart text color for optimal readability

### Interface
- **Dark mode**: Automatically follows system dark/light preference
- **Popup mode**: Compact 356x580px with accordion sections
- **Tab mode**: Centered 400px layout, all sections expanded
- **Persistent colors**: Window colors remembered per window, even after restart


## Installation

### From Source

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" > "Load Temporary Add-on"
4. Select the `manifest.json` file

### Development

No build process required - edit files directly and reload in `about:debugging`.

## How It Works

The extension uses Firefox's `theme` API to dynamically color window frames. Each window gets assigned the least-used color theme, ensuring even distribution. When windows close, their theme usage is decremented for fair redistribution.

## Browser Compatibility

- **Firefox**: Full support (Manifest V2)
- **Chrome**: Not supported (uses different theming APIs)

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Privacy Policy

This extension does not collect, transmit, or share any personal data. Color preferences are stored locally in your browser profile only.
