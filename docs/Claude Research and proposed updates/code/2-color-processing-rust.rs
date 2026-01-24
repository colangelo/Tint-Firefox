// src/lib.rs - Rust module for high-performance color operations
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct ColorProcessor;

#[wasm_bindgen]
impl ColorProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ColorProcessor {
        ColorProcessor
    }

    // Generate complementary colors for a given hex color
    pub fn generate_palette(&self, base_color: &str, count: usize) -> Vec<JsValue> {
        let rgb = hex_to_rgb(base_color);
        let hsl = rgb_to_hsl(rgb);
        
        let mut palette = Vec::new();
        for i in 0..count {
            let hue_shift = (360.0 / count as f64) * i as f64;
            let new_hue = (hsl.0 + hue_shift) % 360.0;
            let new_rgb = hsl_to_rgb((new_hue, hsl.1, hsl.2));
            palette.push(JsValue::from_str(&rgb_to_hex(new_rgb)));
        }
        palette
    }

    // Calculate optimal text color (black or white) for contrast
    pub fn get_contrast_color(&self, bg_color: &str) -> String {
        let rgb = hex_to_rgb(bg_color);
        let luminance = (0.299 * rgb.0 + 0.587 * rgb.1 + 0.114 * rgb.2) / 255.0;
        if luminance > 0.5 { "#000000" } else { "#ffffff" }.to_string()
    }

    // Validate and normalize hex colors
    pub fn validate_hex(&self, hex: &str) -> Option<String> {
        if let Ok(rgb) = hex_to_rgb(hex) {
            Some(rgb_to_hex(rgb))
        } else {
            None
        }
    }
}

// Helper functions
fn hex_to_rgb(hex: &str) -> (f64, f64, f64) {
    let hex = hex.trim_start_matches('#');
    let r = u8::from_str_radix(&hex[0..2], 16).unwrap_or(0) as f64;
    let g = u8::from_str_radix(&hex[2..4], 16).unwrap_or(0) as f64;
    let b = u8::from_str_radix(&hex[4..6], 16).unwrap_or(0) as f64;
    (r, g, b)
}

fn rgb_to_hex(rgb: (f64, f64, f64)) -> String {
    format!("#{:02x}{:02x}{:02x}", 
        rgb.0 as u8, rgb.1 as u8, rgb.2 as u8)
}

fn rgb_to_hsl(rgb: (f64, f64, f64)) -> (f64, f64, f64) {
    let (r, g, b) = (rgb.0 / 255.0, rgb.1 / 255.0, rgb.2 / 255.0);
    let max = r.max(g).max(b);
    let min = r.min(g).min(b);
    let lightness = (max + min) / 2.0;
    
    if max == min {
        return (0.0, 0.0, lightness);
    }
    
    let delta = max - min;
    let saturation = if lightness > 0.5 {
        delta / (2.0 - max - min)
    } else {
        delta / (max + min)
    };
    
    let hue = if max == r {
        ((g - b) / delta + if g < b { 6.0 } else { 0.0 }) / 6.0
    } else if max == g {
        ((b - r) / delta + 2.0) / 6.0
    } else {
        ((r - g) / delta + 4.0) / 6.0
    };
    
    (hue * 360.0, saturation, lightness)
}

fn hsl_to_rgb(hsl: (f64, f64, f64)) -> (f64, f64, f64) {
    let (h, s, l) = (hsl.0 / 360.0, hsl.1, hsl.2);
    
    if s == 0.0 {
        let gray = (l * 255.0) as f64;
        return (gray, gray, gray);
    }
    
    let q = if l < 0.5 { l * (1.0 + s) } else { l + s - l * s };
    let p = 2.0 * l - q;
    
    let r = hue_to_rgb(p, q, h + 1.0/3.0) * 255.0;
    let g = hue_to_rgb(p, q, h) * 255.0;
    let b = hue_to_rgb(p, q, h - 1.0/3.0) * 255.0;
    
    (r, g, b)
}

fn hue_to_rgb(p: f64, q: f64, mut t: f64) -> f64 {
    if t < 0.0 { t += 1.0; }
    if t > 1.0 { t -= 1.0; }
    if t < 1.0/6.0 { return p + (q - p) * 6.0 * t; }
    if t < 1.0/2.0 { return q; }
    if t < 2.0/3.0 { return p + (q - p) * (2.0/3.0 - t) * 6.0; }
    p
}