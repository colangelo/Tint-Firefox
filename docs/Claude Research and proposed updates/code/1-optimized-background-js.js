// Optimized version with performance improvements
const THEMES = [
    '#ec5f67', '#f99157', '#fac863', '#99c794',
    '#5fb3b3', '#6699cc', '#c594c5'
].map(color => ({
    colors: { frame: color, tab_background_text: '#111' },
    usage: 0,
    lastUsed: Math.random()
}));

const windowThemes = new Map();

// Optimized theme selection - O(n) but with early exit
function getNextTheme() {
    let selected = THEMES[0];
    let minUsage = selected.usage;
    
    for (let i = 1; i < THEMES.length; i++) {
        const theme = THEMES[i];
        if (theme.usage < minUsage || 
            (theme.usage === minUsage && theme.lastUsed < selected.lastUsed)) {
            selected = theme;
            minUsage = theme.usage;
        }
    }
    return selected;
}

// Batch window operations on startup
async function applyThemeToAllWindows() {
    const windows = await browser.windows.getAll();
    // Use Promise.all for parallel theme application
    await Promise.all(windows.map(window => {
        const theme = getNextTheme();
        theme.usage++;
        theme.lastUsed = Date.now();
        windowThemes.set(window.id, theme);
        return browser.theme.update(window.id, theme);
    }));
}

function applyThemeToWindow(window) {
    const theme = getNextTheme();
    theme.usage++;
    theme.lastUsed = Date.now();
    windowThemes.set(window.id, theme);
    browser.theme.update(window.id, theme);
}

function freeThemeOfDestroyedWindow(windowId) {
    const theme = windowThemes.get(windowId);
    if (theme) {
        theme.usage--;
        windowThemes.delete(windowId);
    }
}

// Event listeners
browser.windows.onCreated.addListener(applyThemeToWindow);
browser.windows.onRemoved.addListener(freeThemeOfDestroyedWindow);
browser.runtime.onStartup.addListener(applyThemeToAllWindows);
browser.runtime.onInstalled.addListener(applyThemeToAllWindows);