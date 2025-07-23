// color-picker.js
const PRESET_COLORS = [
    '#ec5f67', '#f99157', '#fac863', '#99c794',
    '#5fb3b3', '#6699cc', '#c594c5', '#ab7967',
    '#d3869b', '#83a598', '#b8bb26', '#fabd2f',
    '#fb4934', '#b16286', '#458588', '#689d6a'
];

let currentWindowId = null;
let selectedColor = null;

// Get current window ID
async function initialize() {
    const windows = await browser.windows.getCurrent();
    currentWindowId = windows.id;
    
    // Load saved custom color if exists
    const saved = await browser.storage.local.get(`window_${currentWindowId}`);
    if (saved[`window_${currentWindowId}`]) {
        selectedColor = saved[`window_${currentWindowId}`];
        updateColorDisplay(selectedColor);
    }
    
    setupPresetColors();
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
    
    selectedColor = color;
    updateColorDisplay(color);
}

function updateColorDisplay(color) {
    document.getElementById('colorPicker').value = color;
    document.getElementById('colorValue').value = color;
}

function setupColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorValue = document.getElementById('colorValue');
    const applyBtn = document.getElementById('applyBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Sync color picker and text input
    colorPicker.addEventListener('input', (e) => {
        colorValue.value = e.target.value;
        selectedColor = e.target.value;
        // Remove preset selection when using custom color
        document.querySelectorAll('.color-option').forEach(el => {
            el.classList.remove('selected');
        });
    });
    
    colorValue.addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            colorPicker.value = color;
            selectedColor = color;
            document.querySelectorAll('.color-option').forEach(el => {
                el.classList.remove('selected');
            });
        }
    });
    
    // Apply button
    applyBtn.addEventListener('click', async () => {
        if (selectedColor) {
            // Save to storage
            await browser.storage.local.set({
                [`window_${currentWindowId}`]: selectedColor
            });
            
            // Send message to background script
            browser.runtime.sendMessage({
                action: 'setWindowColor',
                windowId: currentWindowId,
                color: selectedColor
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);