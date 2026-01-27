# Roadmap

## Current Status

**Version 5.1.0** - UI polish and color curation

### Completed Phases

| Phase | Version | Status | Description |
|-------|---------|--------|-------------|
| 1 | v2.1 | ✅ Done | Performance optimizations (parallel init, O(n) selection) |
| 2 | v3.0-v4.4 | ✅ Done | Color picker, presets, harmony tools, palette generation |
| 3 | v4.5.0 | ✅ Done | Popup UI with accordion, Quick Pick, color preview |
| 4 | v4.7.0 | ✅ Done | Sticky footer, per-window state, current/auto buttons |
| 5 | v4.7.5 | ✅ Done | Unified popup/tab UI, renamed to "Tint", responsive tab view |
| 6 | v4.8.0 | ✅ Done | Dark mode support with system preference detection |
| 7 | v4.8.4 | ✅ Done | Tab view scaled 45% larger for better readability |
| 8 | v5.0.0 | ✅ Done | Color persistence across Firefox restarts |
| 9 | v5.1.0 | ✅ Done | UI polish: curated presets, smarter harmony, icon button |

## Future Development

### Phase 4: WebAssembly Enhancement (Optional)

**Priority**: Low - Current JS implementation is already efficient

WebAssembly would benefit computationally intensive features:

- **Color space conversions**: LAB, LCH color spaces for perceptually uniform colors
- **Advanced color harmonies**: More sophisticated harmony algorithms
- **Real-time color analysis**: Extract dominant colors from images
- **Batch processing**: Process large color palettes efficiently

**Expected benefits**:
- 4-10x faster color calculations
- Near-native performance for complex operations
- Better support for advanced color science

**Implementation approach**:
- Rust-based color processor compiled to WASM via `wasm-pack`
- Hybrid architecture: JS for WebExtension APIs, WASM for color math
- Fallback to JS for browsers without WASM support

### Phase 5: System Integration (Future Consideration)

**Priority**: Low - Only if system-level features are needed

Native messaging with Rust host for:
- Reading system theme preferences (dark/light mode)
- Monitoring window manager events
- Deep system integration for advanced theming

**Trade-offs**:
- Increased deployment complexity
- Requires separate native app installation
- Platform-specific code needed

## Not Planned

The following are **not recommended** for this use case:

- **Web Workers**: Extension background scripts already run off the main thread
- **Manifest V3 migration**: Firefox still fully supports MV2; MV3 migration adds complexity without benefits for this extension
- **Chrome support**: Uses Firefox-specific `theme` API with `windowId` support

## Contributing

Feature requests and contributions welcome. For major changes, please open an issue first to discuss the approach.

## Research

Additional research and prototype code available in `Claude Research and proposed updates/`:
- Performance optimization analysis
- Rust/WASM prototype code
- Implementation recommendations
