// popup.js - Color picker popup UI

// Quick Pick: 12 vibrant, distinct colors for always-visible selection
const QUICK_COLORS = [
  '#ec5f67', '#f99157', '#fac863', '#99c794',  // red, orange, yellow, green
  '#5fb3b3', '#6699cc', '#c594c5',             // cyan, blue, purple
  '#9b59b6', '#3498db', '#27ae60', '#f1c40f', '#e74c3c'  // purple, blue, green, yellow, red (reverse)
];

// Full 60 preset colors (sorted by hue)
const PRESET_COLORS = [
  // Row 1: Pinks → Reds
  '#ff9ff3', '#f368e0', '#e056fd', '#ff6b9d', '#fd79a8', '#c44569',
  '#ff3838', '#ff4757', '#fb4934', '#ec5f67', '#e55039', '#ff7675',

  // Row 2: Oranges → Yellows
  '#ff6348', '#ff7f50', '#ffa502', '#ff9500', '#f99157', '#ffc048',
  '#fabd2f', '#feca57', '#fac863', '#f1c40f', '#ffdd59', '#b8bb26',

  // Row 3: Greens → Cyans
  '#20bf6b', '#27ae60', '#2ed573', '#26de81', '#32ff7e', '#7bed9f',
  '#99c794', '#689d6a', '#83a598', '#5fb3b3', '#00d2d3', '#0abde3',

  // Row 4: Blues → Purples
  '#18dcff', '#74b9ff', '#70a1ff', '#3498db', '#6699cc', '#006ba6',
  '#3742fa', '#5352ed', '#6c5ce7', '#4834d4', '#5f27cd', '#a55eea',

  // Row 5: Lavenders → Mauves → Neutrals
  '#9c88ff', '#8c7ae6', '#c594c5', '#9b59b6', '#be2edd', '#b16286',
  '#d3869b', '#6c5b7b', '#a4b0be', '#747d8c', '#555555', '#2d3436',
];

let currentWindowId = null;
let selectedColor = null;
let currentHarmonyType = null;
let currentWindowColor = null;

// Normalize hex color format
function normalizeHex(hex) {
  return ColorUtils.normalizeHex(hex);
}

// Initialize popup
async function initialize() {
  // Set title with version from manifest
  const manifest = browser.runtime.getManifest();
  document.getElementById('popupTitle').textContent = `Tint (v${manifest.version})`;

  const windows = await browser.windows.getCurrent();
  currentWindowId = windows.id;

  // Fetch current window color from background
  const currentColorResult = await browser.runtime.sendMessage({
    action: 'getWindowColor',
    windowId: currentWindowId
  });
  currentWindowColor = currentColorResult?.color;
  updateCurrentPreview(currentWindowColor);

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
  await restoreAccordionState();
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

// Update the current color preview swatch
function updateCurrentPreview(color) {
  const swatch = document.getElementById('currentSwatch');
  const hex = document.getElementById('currentHex');

  if (color) {
    swatch.style.setProperty('--preview-color', color);
    swatch.classList.add('has-color');
    hex.textContent = color.toUpperCase();
  } else {
    swatch.style.removeProperty('--preview-color');
    swatch.classList.remove('has-color');
    hex.textContent = '-';
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

      // Save state with new harmony type
      savePopupState();
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
        el.classList.remove('selected');
      });
      colorDiv.classList.add('selected');
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
          el.classList.remove('selected');
        });
        colorDiv.classList.add('selected');
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

// Setup action buttons
function setupActionButtons() {
  const applyBtn = document.getElementById('applyBtn');
  const currentBtn = document.getElementById('currentBtn');
  const randomBtn = document.getElementById('randomBtn');

  // Apply: apply selected color to window
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

      // Update current preview
      updateCurrentPreview(normalizedColor);

      // Visual feedback
      applyBtn.textContent = 'Done!';
      setTimeout(() => {
        applyBtn.textContent = 'Apply';
      }, 800);
    }
  });

  // Current: copy current window color to selected
  const currentBtnSvg = currentBtn.querySelector('svg');
  currentBtn.addEventListener('click', async () => {
    const currentColor = await browser.runtime.sendMessage({
      action: 'getWindowColor',
      windowId: currentWindowId
    });
    if (currentColor?.color) {
      selectColor(currentColor.color, false);

      // Visual feedback - remove SVG and show "Done!"
      if (currentBtnSvg) {
        currentBtnSvg.remove();
        currentBtn.textContent = 'Done!';
        setTimeout(() => {
          currentBtn.textContent = '';
          currentBtn.appendChild(currentBtnSvg);
        }, 800);
      }
    }
  });

  // Auto: randomly assign a new auto color
  randomBtn.addEventListener('click', async () => {
    // Remove custom color from storage
    await browser.storage.local.remove(`window_${currentWindowId}`);

    // Send message to background script to assign auto color
    // Returns the newly assigned color
    const result = await browser.runtime.sendMessage({
      action: 'resetWindowColor',
      windowId: currentWindowId
    });

    // Update current preview with new color
    currentWindowColor = result?.color;
    updateCurrentPreview(currentWindowColor);

    // Visual feedback
    randomBtn.textContent = 'Done!';
    setTimeout(() => {
      randomBtn.textContent = 'Random';
    }, 800);
  });
}

// Setup "Open in tab" link
function setupOpenFullLink() {
  const link = document.getElementById('openFullBtn');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    browser.tabs.create({
      url: browser.runtime.getURL('popup.html'),
      windowId: currentWindowId
    });
    window.close();
  });
}

// Accordion state persistence (per-window)
async function restoreAccordionState() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];
  const isTabView = window.innerWidth >= 400;

  // In tab view, expand all sections
  if (isTabView) {
    accordionIds.forEach(id => {
      const details = document.getElementById(id);
      if (details) {
        details.open = true;
      }
    });
    if (currentWindowColor) {
      selectedColor = currentWindowColor;
      updatePreview(selectedColor);
    }
    activateHarmony('monochromatic');
    return;
  }

  const stateKey = `popupState_${currentWindowId}`;
  const saved = await browser.storage.local.get(stateKey);

  if (saved[stateKey]) {
    // Restore saved per-window state
    const state = saved[stateKey];
    accordionIds.forEach(id => {
      const details = document.getElementById(id);
      if (details) {
        details.open = !!state.accordions?.[id];
      }
    });
    // Restore harmony type if saved
    if (state.harmonyType) {
      activateHarmony(state.harmonyType);
    }
  } else {
    // First time opening in this window: apply defaults
    // Only harmony section open, monochromatic selected
    // Use current window color as base for harmony
    accordionIds.forEach(id => {
      const details = document.getElementById(id);
      if (details) {
        details.open = (id === 'harmonySection');
      }
    });
    if (currentWindowColor) {
      selectedColor = currentWindowColor;
      updatePreview(selectedColor);
    }
    activateHarmony('monochromatic');
  }
}

// Activate a harmony type (select button and generate colors)
function activateHarmony(type) {
  const btn = document.querySelector(`.harmony-buttons button[data-type="${type}"]`);
  if (btn) {
    document.querySelectorAll('.harmony-buttons button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    generateColorHarmony(type);
  }
}

function setupAccordionPersistence() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];

  accordionIds.forEach(id => {
    const details = document.getElementById(id);
    if (details) {
      details.addEventListener('toggle', () => {
        savePopupState();
      });
    }
  });
}

async function savePopupState() {
  const accordionIds = ['presetsSection', 'harmonySection', 'paletteSection', 'customSection'];
  const accordions = {};

  accordionIds.forEach(id => {
    const details = document.getElementById(id);
    if (details) {
      accordions[id] = details.open;
    }
  });

  const stateKey = `popupState_${currentWindowId}`;
  await browser.storage.local.set({
    [stateKey]: {
      accordions,
      harmonyType: currentHarmonyType
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
