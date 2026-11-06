// =========================================================
// TEMAS DE CORES
// =========================================================

const THEME_STORAGE_KEY = 'elemento-frio-theme';

const VALID_THEMES = new Set([
  'dark',
  'ice',
  'fire',
  'earth',
  'energy',
  'water',
  'air',
  'void'
]);


/**
 * Retorna o tema atual.
 * Caso exista um tema antigo/inválido salvo,
 * volta automaticamente para o tema Escuro.
 */
function getCurrentTheme() {
  const theme =
    document.documentElement.dataset.theme || 'dark';

  return VALID_THEMES.has(theme)
    ? theme
    : 'dark';
}


/**
 * Atualiza a interface do seletor de temas
 * e também a cor do navegador/mobile.
 */
function updateThemeUI() {
  const current = getCurrentTheme();

  document
    .querySelectorAll('[data-theme-option]')
    .forEach((option) => {
      option.classList.toggle(
        'active',
        option.dataset.themeOption === current
      );
    });


  const themeColors = {
    dark: '#121212',
    ice: '#E5F3F5',
    fire: '#C9362B',
    earth: '#4F6F45',
    energy: '#667985',
    water: '#123F52',
    air: '#E8F2EF',
    void: '#0D0B12'
  };


  const meta =
    document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.setAttribute(
      'content',
      themeColors[current] || themeColors.dark
    );
  }
}


/**
 * Altera o tema e salva no navegador.
 */
window.setTheme = function(theme) {

  if (!VALID_THEMES.has(theme)) {
    theme = 'dark';
  }

  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );
  } catch (_) {}

  updateThemeUI();

  window.closeThemeMenu();
};


/**
 * Abre/fecha o seletor de temas.
 */
window.toggleThemeMenu = function(event) {

  if (event) {
    event.stopPropagation();
  }

  const menu =
    document.getElementById('theme-menu');

  const button =
    document.getElementById('theme-toggle-btn');

  if (!menu) {
    return;
  }

  const willOpen =
    menu.classList.contains('hidden');

  menu.classList.toggle(
    'hidden',
    !willOpen
  );

  if (button) {
    button.setAttribute(
      'aria-expanded',
      String(willOpen)
    );
  }

  if (willOpen) {
    updateThemeUI();
  }
};


/**
 * Fecha o seletor de temas.
 */
window.closeThemeMenu = function() {

  const menu =
    document.getElementById('theme-menu');

  const button =
    document.getElementById('theme-toggle-btn');

  if (menu) {
    menu.classList.add('hidden');
  }

  if (button) {
    button.setAttribute(
      'aria-expanded',
      'false'
    );
  }
};


/**
 * Fecha o menu ao clicar fora.
 */
document.addEventListener(
  'click',
  (event) => {

    const picker =
      event.target.closest &&
      event.target.closest('.theme-picker-wrap');

    if (!picker) {
      window.closeThemeMenu();
    }
  }
);


/**
 * Fecha o menu com ESC.
 */
document.addEventListener(
  'keydown',
  (event) => {

    if (event.key === 'Escape') {
      window.closeThemeMenu();
    }
  }
);


/**
 * Corrige temas antigos salvos.
 *
 * Se alguém tinha "arcane" salvo antes,
 * o sistema converte automaticamente
 * para "void".
 */
function migrateOldTheme() {

  try {

    const saved =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (saved === 'arcane') {

      localStorage.setItem(
        THEME_STORAGE_KEY,
        'void'
      );

      document.documentElement.dataset.theme =
        'void';

      return;
    }


    if (
      !saved ||
      !VALID_THEMES.has(saved)
    ) {

      localStorage.setItem(
        THEME_STORAGE_KEY,
        'dark'
      );

      document.documentElement.dataset.theme =
        'dark';
    }

  } catch (_) {}
}


migrateOldTheme();

document.addEventListener(
  'DOMContentLoaded',
  updateThemeUI
);
