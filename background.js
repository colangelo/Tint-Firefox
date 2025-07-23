// Enhanced background.js with color picker functionality
const DEFAULT_THEMES = [
    '#ec5f67', '#f99157', '#fac863', '#99c794',
    '#5fb3b3', '#6699cc', '#c594c5'
];

class ThemeManager {
    constructor() {
        this.themes = DEFAULT_THEMES.map(color => ({
            color,
            usage: 0,
            lastUsed: Math.random()
        }));
        this.windowThemes = new Map();
        this.customColors = new Map();
    }

    getNextTheme() {
        let selected = this.themes[0];
        let minUsage = selected.usage;
        
        for (const theme of this.themes) {
            if (theme.usage < minUsage || 
                (theme.usage === minUsage && theme.lastUsed < selected.lastUsed)) {
                selected = theme;
                minUsage = theme.usage;
            }
        }
        return selected;
    }

    async applyTheme(windowId, customColor = null) {
        let color, textColor = '#111';
        
        if (customColor) {
            color = customColor;
            textColor = this.calculateContrastColor(color);
            this.customColors.set(windowId, { color, textColor });
        } else {
            const theme = this.getNextTheme();
            color = theme.color;
            theme.usage++;
            theme.lastUsed = Date.now();
            this.windowThemes.set(windowId, theme);
        }

        await browser.theme.update(windowId, {
            colors: {
                frame: color,
                tab_background_text: textColor,
                toolbar: color,
                toolbar_text: textColor,
                toolbar_field: color,
                toolbar_field_text: textColor
            }
        });
    }

    freeTheme(windowId) {
        const theme = this.windowThemes.get(windowId);
        if (theme) {
            theme.usage--;
            this.windowThemes.delete(windowId);
        }
        this.customColors.delete(windowId);
    }

    // Calculate optimal contrast color for text
    calculateContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Expand shorthand hex (e.g., "ddd" to "dddddd")
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Browser action (toolbar button) for color picker
browser.browserAction.onClicked.addListener(async (tab) => {
    browser.tabs.create({
        url: browser.runtime.getURL('color-picker.html'),
        windowId: tab.windowId
    });
});

// Message handler for color picker
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'setWindowColor') {
        await themeManager.applyTheme(message.windowId, message.color);
    } else if (message.action === 'resetWindowColor') {
        await themeManager.applyTheme(message.windowId);
    }
});

// Window event handlers
browser.windows.onCreated.addListener(window => {
    themeManager.applyTheme(window.id);
});

browser.windows.onRemoved.addListener(windowId => {
    themeManager.freeTheme(windowId);
});

// Startup handlers
async function initializeAllWindows() {
    const windows = await browser.windows.getAll();
    await Promise.all(windows.map(window => 
        themeManager.applyTheme(window.id)
    ));
}

browser.runtime.onStartup.addListener(initializeAllWindows);
browser.runtime.onInstalled.addListener(initializeAllWindows);