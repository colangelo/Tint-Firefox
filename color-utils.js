// Advanced color utilities for enhanced theming
class ColorUtils {
    // Convert hex to RGB
    static hexToRgb(hex) {
        hex = hex.replace('#', '');
        
        // Expand shorthand hex (e.g., "ddd" to "dddddd")
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return { r, g, b };
    }
    
    // Convert RGB to hex
    static rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    // Convert RGB to HSL
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    // Convert HSL to RGB
    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return { r: r * 255, g: g * 255, b: b * 255 };
    }
    
    // Generate color harmony (complementary, triadic, analogous)
    static generateHarmony(baseColor, type = 'complementary') {
        const rgb = this.hexToRgb(baseColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const colors = [baseColor];
        
        switch (type) {
            case 'complementary':
                const compHue = (hsl.h + 180) % 360;
                const compRgb = this.hslToRgb(compHue, hsl.s, hsl.l);
                colors.push(this.rgbToHex(compRgb.r, compRgb.g, compRgb.b));
                break;
                
            case 'triadic':
                for (let i = 1; i <= 2; i++) {
                    const triadHue = (hsl.h + i * 120) % 360;
                    const triadRgb = this.hslToRgb(triadHue, hsl.s, hsl.l);
                    colors.push(this.rgbToHex(triadRgb.r, triadRgb.g, triadRgb.b));
                }
                break;
                
            case 'analogous':
                for (let i = 1; i <= 4; i++) {
                    const analogHue = (hsl.h + i * 30) % 360;
                    const analogRgb = this.hslToRgb(analogHue, hsl.s, hsl.l);
                    colors.push(this.rgbToHex(analogRgb.r, analogRgb.g, analogRgb.b));
                }
                break;
                
            case 'monochromatic': {
                // 4 lightness stops evenly spaced, skipping near-duplicates of base
                const stops = [10, 30, 50, 70, 90];
                const seen = new Set([baseColor.toLowerCase()]);
                for (const l of stops) {
                    if (colors.length >= 5) break;
                    if (Math.abs(l - hsl.l) < 8) continue;
                    const rgb2 = this.hslToRgb(hsl.h, hsl.s, l);
                    const hex = this.rgbToHex(rgb2.r, rgb2.g, rgb2.b).toLowerCase();
                    if (!seen.has(hex)) {
                        seen.add(hex);
                        colors.push(this.rgbToHex(rgb2.r, rgb2.g, rgb2.b));
                    }
                }
                break;
            }
        }
        
        return colors;
    }
    
    // Generate a palette of related colors
    static generatePalette(baseColor, count = 7) {
        const rgb = this.hexToRgb(baseColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const palette = [];
        
        for (let i = 0; i < count; i++) {
            const hueShift = (360 / count) * i;
            const newHue = (hsl.h + hueShift) % 360;
            const newRgb = this.hslToRgb(newHue, hsl.s, hsl.l);
            palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
        }
        
        return palette;
    }
    
    // Enhanced contrast calculation with WCAG standards
    static getContrastColor(bgColor, threshold = 0.5) {
        const rgb = this.hexToRgb(bgColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > threshold ? '#000000' : '#ffffff';
    }
    
    // Calculate WCAG contrast ratio between two colors
    static getContrastRatio(color1, color2) {
        const getLuminance = (color) => {
            const rgb = this.hexToRgb(color);
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }
    
    // Get readable text color that meets WCAG AA standards
    static getAccessibleTextColor(bgColor) {
        const whiteRatio = this.getContrastRatio(bgColor, '#ffffff');
        const blackRatio = this.getContrastRatio(bgColor, '#000000');
        
        // WCAG AA requires 4.5:1 for normal text
        if (whiteRatio >= 4.5 && whiteRatio > blackRatio) {
            return '#ffffff';
        } else if (blackRatio >= 4.5) {
            return '#000000';
        } else {
            // Fallback to better contrast
            return whiteRatio > blackRatio ? '#ffffff' : '#000000';
        }
    }
    
    // Normalize hex color format
    static normalizeHex(hex) {
        hex = hex.replace('#', '');
        
        // Expand shorthand hex
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        return '#' + hex.toLowerCase();
    }
}