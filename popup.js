// popup.js - Color picker popup UI

// Quick Pick: 12 vibrant, distinct colors for always-visible selection
const QUICK_COLORS = [
  '#ec5f67', '#f99157', '#fac863', '#99c794',  // red, orange, yellow, green
  '#5fb3b3', '#6699cc', '#c594c5', '#ff4757',  // cyan, blue, purple, pink
  '#32ff7e', '#70a1ff', '#feca57', '#a55eea'   // lime, sky, gold, violet
];

// Full 72 preset colors
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
let currentHarmonyType = null;

// Normalize hex color format
function normalizeHex(hex) {
  return ColorUtils.normalizeHex(hex);
}

// Initialize popup
async function initialize() {
  const windows = await browser.windows.getCurrent();
  currentWindowId = windows.id;

  // Load saved custom color if exists
  const saved = await browser.storage.local.get(`window_${currentWindowId}`);
  if (saved[`window_${currentWindowId}`]) {
    selectedColor = normalizeHex(saved[`window_${currentWindowId}`]);
    updateColorDisplay(selectedColor);
  } else {
    // Initialize empty preview state
    updatePreview(null);
  }

  setupQuickColors();
  setupPresetColors();
  setupHarmonyButtons();
  setupColorPicker();
  setupPaletteGenerator();
  setupActionButtons();
  setupOpenFullLink();
  restoreAccordionState();
  setupAccordionPersistence();
}

// Setup Quick Pick colors (always visible)
function setupQuickColors() {
  const container = document.getElementById('quickColors');

  QUICK_COLORS.forEach(color => {
    const colorDiv = createColorOption(color);
    container.appendChild(colorDiv);
  });
}

// Setup preset colors (in accordion)
function setupPresetColors() {
  const container = document.getElementById('presetColors');

  PRESET_COLORS.forEach(color => {
    const colorDiv = createColorOption(color);
    container.appendChild(colorDiv);
  });
}

// Create a color option element
function createColorOption(color) {
  const colorDiv = document.createElement('div');
  colorDiv.className = 'color-option';
  colorDiv.style.backgroundColor = color;
  colorDiv.dataset.color = color;
  colorDiv.title = color;

  if (color === selectedColor) {
    colorDiv.classList.add('selected');
  }

  colorDiv.addEventListener('click', () => {
    selectColor(color, true);
  });

  return colorDiv;
}

// Select a color
function selectColor(color, isPreset = false) {
  // Remove previous selection from all color grids
  document.querySelectorAll('.color-option, .harmony-color, .palette-color').forEach(el => {
    el.classList.remove('selected');
    el.style.borderColor = 'transparent';
  });

  selectedColor = normalizeHex(color);
  updateColorDisplay(selectedColor);

  // Highlight selected color if it's a preset
  if (isPreset) {
    const selected = document.querySelector(`[data-color="${color}"]`);
    if (selected) {
      selected.classList.add('selected');
    }
  }

  // Update harmony if active
  if (currentHarmonyType) {
    generateColorHarmony(currentHarmonyType);
  }
}

// Update color picker display and preview
function updateColorDisplay(color) {
  const normalizedColor = normalizeHex(color);
  document.getElementById('colorPicker').value = normalizedColor;
  document.getElementById('colorValue').value = normalizedColor;
  updatePreview(normalizedColor);
}

// Update the color preview swatch
function updatePreview(color) {
  const preview = document.getElementById('colorPreview');
  const swatch = document.getElementById('previewSwatch');
  const hex = document.getElementById('previewHex');

  if (color) {
    swatch.style.setProperty('--preview-color', color);
    swatch.classList.add('has-color');
    hex.textContent = color.toUpperCase();
    preview.classList.remove('empty');
  } else {
    swatch.style.removeProperty('--preview-color');
    swatch.classList.remove('has-color');
    hex.textContent = 'None';
    preview.classList.add('empty');
  }
}

// Setup harmony buttons
function setupHarmonyButtons() {
  const buttons = document.querySelectorAll('.harmony-buttons button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      generateColorHarmony(type);

      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Generate color harmony
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
      selectColor(color, false);
      // Highlight this harmony color
      container.querySelectorAll('.harmony-color').forEach(el => {
        el.style.borderColor = 'transparent';
      });
      colorDiv.style.borderColor = '#333';
    });

    container.appendChild(colorDiv);
  });
}

// Setup color picker inputs
function setupColorPicker() {
  const colorPicker = document.getElementById('colorPicker');
  const colorValue = document.getElementById('colorValue');

  colorPicker.addEventListener('input', (e) => {
    const normalizedColor = normalizeHex(e.target.value);
    colorValue.value = normalizedColor;
    selectColor(normalizedColor, false);
  });

  colorValue.addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{3,6}$/i.test(color)) {
      const normalizedColor = normalizeHex(color);
      colorPicker.value = normalizedColor;
      selectColor(normalizedColor, false);
    }
  });
}

// Setup palette generator
function setupPaletteGenerator() {
  const btn = document.getElementById('generatePaletteBtn');
  const container = document.getElementById('generatedPalette');

  btn.addEventListener('click', () => {
    const baseColor = selectedColor || '#6699cc';
    const palette = ColorUtils.generatePalette(baseColor, 16);

    container.innerHTML = '';

    palette.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'palette-color';
      colorDiv.style.backgroundColor = color;
      colorDiv.title = color;

      colorDiv.addEventListener('click', () => {
        selectColor(color, false);
        container.querySelectorAll('.palette-color').forEach(el => {
          el.style.borderColor = 'transparent';
        });
        colorDiv.style.borderColor = '#333';
      });

      container.appendChild(colorDiv);
    });

    // Visual feedback
    btn.textContent = 'Generated!';
    setTimeout(() => {
      btn.textContent = 'Generate from Selected';
    }, 800);
  });
}

// Setup apply and reset buttons
function setupActionButtons() {
  const applyBtn = document.getElementById('applyBtn');
  const resetBtn = document.getElementById('resetBtn');

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
      applyBtn.textContent = 'Applied!';
      setTimeout(() => {
        applyBtn.textContent = 'Apply Color';
      }, 800);
    }
  });

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
    document.querySelectorAll('.color-option, .harmony-color, .palette-color').forEach(el => {
      el.classList.remove('selected');
      el.style.borderColor = 'transparent';
    });
    updatePreview(null);

    // Visual feedback
    resetBtn.textContent = 'Reset!';
    setTimeout(() => {
      resetBtn.textContent = 'Reset to Auto';
    }, 800);
  });
}

// Setup "Open in tab" link
function setupOpenFullLink() {
  const link = document.getElementById('openFullBtn');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    browser.tabs.create({
      url: browser.runtime.getURL('color-picker.html'),
      windowId: currentWindowId
    });
    window.close();
  });
}

// Accordion state persistence
function restoreAccordionState() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];
  const savedState = localStorage.getItem('accordionState');

  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      accordionIds.forEach(id => {
        const details = document.getElementById(id);
        if (details && state[id]) {
          details.open = true;
        }
      });
    } catch (e) {
      // Ignore parse errors
    }
  }
}

function setupAccordionPersistence() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];

  accordionIds.forEach(id => {
    const details = document.getElementById(id);
    if (details) {
      details.addEventListener('toggle', () => {
        saveAccordionState();
      });
    }
  });
}

function saveAccordionState() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];
  const state = {};

  accordionIds.forEach(id => {
    const details = document.getElementById(id);
    if (details) {
      state[id] = details.open;
    }
  });

  localStorage.setItem('accordionState', JSON.stringify(state));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
