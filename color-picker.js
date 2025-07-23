// color-picker.js
const PRESET_COLORS = [
    // Reds & Pinks
    '#ff4757', '#ff3838', '#ff6348', '#ec5f67', '#fb4934', '#e55039',
    '#ff9ff3', '#f368e0', '#ff6b9d', '#d3869b', '#b16286', '#ff7675',
    
    // Oranges & Yellows  
    '#ffa502', '#ff9500', '#f99157', '#ff7f50', '#fabd2f', '#ffc048',
    '#fac863', '#ffdd59', '#f1c40f', '#b8bb26', '#fffa65', '#feca57',
    
    // Greens
    '#32ff7e', '#18dcff', '#7bed9f', '#99c794', '#689d6a', '#2ed573',
    '#5f27cd', '#00d2d3', '#ff9ff3', '#83a598', '#26de81', '#20bf6b',
    
    // Blues & Cyans
    '#70a1ff', '#5352ed', '#6699cc', '#458588', '#3742fa', '#2f3542',
    '#7bed9f', '#5fb3b3', '#00d2d3', '#0abde3', '#006ba6', '#74b9ff',
    
    // Purples & Magentas
    '#c594c5', '#a55eea', '#8c7ae6', '#9c88ff', '#e056fd', '#be2edd',
    '#6c5ce7', '#fd79a8', '#fdcb6e', '#6c5b7b', '#4834d4', '#c44569',
    
    // Grays & Darks
    '#57606f', '#2f3640', '#747d8c', '#a4b0be', '#dddddd', '#95a5a6',
    '#636e72', '#2d3436', '#b2bec3', '#888888', '#555555', '#333333'
];

let currentWindowId = null;
let selectedColor = null;

// Use ColorUtils for normalization
function normalizeHex(hex) {
    return ColorUtils.normalizeHex(hex);
}

let currentHarmonyType = null;

// Get current window ID
async function initialize() {
    const windows = await browser.windows.getCurrent();
    currentWindowId = windows.id;
    
    // Load saved custom color if exists
    const saved = await browser.storage.local.get(`window_${currentWindowId}`);
    if (saved[`window_${currentWindowId}`]) {
        selectedColor = normalizeHex(saved[`window_${currentWindowId}`]);
        updateColorDisplay(selectedColor);
    }
    
    setupPresetColors();
    setupColorHarmony();
    setupColorPicker();
}

function setupPresetColors() {
    const container = document.getElementById('presetColors');
    
    PRESET_COLORS.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-option';
        colorDiv.style.backgroundColor = color;
        colorDiv.dataset.color = color;
        
        if (color === selectedColor) {
            colorDiv.classList.add('selected');
        }
        
        colorDiv.addEventListener('click', () => {
            selectPresetColor(color);
        });
        
        container.appendChild(colorDiv);
    });
}

function selectPresetColor(color) {
    // Remove previous selection
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked color
    const selected = document.querySelector(`[data-color="${color}"]`);
    if (selected) {
        selected.classList.add('selected');
    }
    
    selectedColor = normalizeHex(color);
    updateColorDisplay(selectedColor);
}

function updateColorDisplay(color) {
    const normalizedColor = normalizeHex(color);
    document.getElementById('colorPicker').value = normalizedColor;
    document.getElementById('colorValue').value = normalizedColor;
}

function setupColorHarmony() {
    const harmonyButtons = {
        'complementaryBtn': 'complementary',
        'triadicBtn': 'triadic', 
        'analogousBtn': 'analogous',
        'monochromaticBtn': 'monochromatic'
    };
    
    Object.entries(harmonyButtons).forEach(([btnId, harmonyType]) => {
        document.getElementById(btnId).addEventListener('click', () => {
            generateColorHarmony(harmonyType);
            setActiveHarmonyButton(btnId);
        });
    });
}

function setActiveHarmonyButton(activeId) {
    document.querySelectorAll('.harmony-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

function generateColorHarmony(type) {
    const baseColor = selectedColor || '#6699cc';
    const colors = ColorUtils.generateHarmony(baseColor, type);
    currentHarmonyType = type;
    
    const container = document.getElementById('harmonyColors');
    container.innerHTML = '';
    
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'harmony-color';
        colorDiv.style.backgroundColor = color;
        colorDiv.title = color;
        
        colorDiv.addEventListener('click', () => {
            selectColor(color);
        });
        
        container.appendChild(colorDiv);
    });
}

function selectColor(color) {
    selectedColor = normalizeHex(color);
    updateColorDisplay(selectedColor);
    
    // Remove selection from preset colors
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Highlight selected color in harmony if it matches
    document.querySelectorAll('.harmony-color').forEach(el => {
        el.style.border = el.style.backgroundColor === color ? '2px solid #333' : '2px solid transparent';
    });
}

function setupColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorValue = document.getElementById('colorValue');
    const applyBtn = document.getElementById('applyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const generatePaletteBtn = document.getElementById('generatePaletteBtn');
    
    // Sync color picker and text input
    colorPicker.addEventListener('input', (e) => {
        const normalizedColor = normalizeHex(e.target.value);
        colorValue.value = normalizedColor;
        selectedColor = normalizedColor;
        // Remove preset selection when using custom color
        document.querySelectorAll('.color-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Update harmony if active
        if (currentHarmonyType) {
            generateColorHarmony(currentHarmonyType);
        }
    });
    
    colorValue.addEventListener('input', (e) => {
        const color = e.target.value;
        // Accept both 3 and 6 character hex codes
        if (/^#[0-9A-F]{3,6}$/i.test(color)) {
            const normalizedColor = normalizeHex(color);
            colorPicker.value = normalizedColor;
            selectedColor = normalizedColor;
            document.querySelectorAll('.color-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Update harmony if active
            if (currentHarmonyType) {
                generateColorHarmony(currentHarmonyType);
            }
        }
    });
    
    // Apply button
    applyBtn.addEventListener('click', async () => {
        if (selectedColor) {
            const normalizedColor = normalizeHex(selectedColor);
            
            // Save to storage
            await browser.storage.local.set({
                [`window_${currentWindowId}`]: normalizedColor
            });
            
            // Send message to background script
            browser.runtime.sendMessage({
                action: 'setWindowColor',
                windowId: currentWindowId,
                color: normalizedColor
            });
            
            // Visual feedback
            applyBtn.textContent = '✓ Applied';
            setTimeout(() => {
                applyBtn.textContent = 'Apply Color';
            }, 1000);
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', async () => {
        // Remove from storage
        await browser.storage.local.remove(`window_${currentWindowId}`);
        
        // Send message to background script
        browser.runtime.sendMessage({
            action: 'resetWindowColor',
            windowId: currentWindowId
        });
        
        // Reset UI
        selectedColor = null;
        document.querySelectorAll('.color-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Visual feedback
        resetBtn.textContent = '✓ Reset';
        setTimeout(() => {
            resetBtn.textContent = 'Reset to Auto';
        }, 1000);
    });
    
    // Generate palette button
    generatePaletteBtn.addEventListener('click', () => {
        const baseColor = selectedColor || '#6699cc';
        const palette = ColorUtils.generatePalette(baseColor, 12);
        
        // Replace current preset colors with generated palette
        const container = document.getElementById('presetColors');
        container.innerHTML = '';
        
        palette.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color-option';
            colorDiv.style.backgroundColor = color;
            colorDiv.dataset.color = color;
            
            colorDiv.addEventListener('click', () => {
                selectPresetColor(color);
            });
            
            container.appendChild(colorDiv);
        });
        
        // Visual feedback
        generatePaletteBtn.textContent = '✓ Generated';
        setTimeout(() => {
            generatePaletteBtn.textContent = 'Generate Palette';
        }, 1000);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);