// Enhanced background.js with color picker functionality
const DEFAULT_THEMES = [
    // Original 7 colors (maintained for compatibility)
    '#ec5f67', '#f99157', '#fac863', '#99c794',
    '#5fb3b3', '#6699cc', '#c594c5',
    
    // Expanded palette - 25 additional colors for 32 total (maximum window differentiation)
    // Vibrant reds and pinks (4)
    '#ff4757', '#ff6b9d', '#e55039', '#ff7675',
    
    // Oranges and corals (3)  
    '#ffa502', '#ff7f50', '#feca57',
    
    // Yellows and golds (3)
    '#ffdd59', '#f1c40f', '#fffa65',
    
    // Greens - vibrant to pastel (6)
    '#32ff7e', '#2ed573', '#20bf6b', '#81ecec',
    '#00b894', '#26de81',
    
    // Blues and cyans (5)
    '#70a1ff', '#0abde3', '#74b9ff', '#00cec9',
    '#0984e3',
    
    // Purples and magentas (4)
    '#a55eea', '#8c7ae6', '#fd79a8', '#e84393'
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
                toolbar_text: textColor
                // Removed toolbar_field properties to keep address bar default
            },
            properties: {
                color_scheme: "system"  // Keep popup following system dark/light preference
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

    // Calculate optimal contrast color for text with enhanced algorithm
    calculateContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        
        // Enhanced contrast calculation with better threshold
        // Use WCAG-inspired calculation for better readability
        return luminance > 0.179 ? '#000000' : '#ffffff';
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

// Message handler for color picker (popup and full-page color picker)
browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'setWindowColor') {
        await themeManager.applyTheme(message.windowId, message.color);
    } else if (message.action === 'resetWindowColor') {
        // Clear any custom color first
        themeManager.customColors.delete(message.windowId);
        await themeManager.applyTheme(message.windowId);
        // Return the newly assigned color
        const theme = themeManager.windowThemes.get(message.windowId);
        return { color: theme?.color };
    } else if (message.action === 'getWindowColor') {
        // Return current color for the window
        const custom = themeManager.customColors.get(message.windowId);
        if (custom) {
            return { color: custom.color, isCustom: true };
        }
        let theme = themeManager.windowThemes.get(message.windowId);
        if (!theme) {
            // Window not initialized yet, apply theme now
            await themeManager.applyTheme(message.windowId);
            theme = themeManager.windowThemes.get(message.windowId);
        }
        return { color: theme?.color, isCustom: false };
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