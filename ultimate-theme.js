
(() => {
  'use strict';

  const KEY = 'axiom_ultimate_theme_v1';

  const palettes = {
    emerald: {
      name: 'Emerald',
      accent: '#44f2b5',
      hover: '#8affd5',
      bg: '#080d14',
      nav: '#0a141e',
      panel: '#12232d',
      hero: '#173b31',
      border: '#346e59',
      glow: '#12644a55',
      active: '#133e30'
    },
    cyber: {
      name: 'Cyber Blue',
      accent: '#58c9ff',
      hover: '#94ddff',
      bg: '#080f20',
      nav: '#0a1427',
      panel: '#112537',
      hero: '#17394e',
      border: '#376c94',
      glow: '#135d9255',
      active: '#12374c'
    },
    purple: {
      name: 'Royal Purple',
      accent: '#bca0ff',
      hover: '#d9caff',
      bg: '#100b20',
      nav: '#161024',
      panel: '#241d38',
      hero: '#382851',
      border: '#7255a6',
      glow: '#6f3ea855',
      active: '#322349'
    },
    gold: {
      name: 'Gold Black',
      accent: '#ffd277',
      hover: '#ffe6ad',
      bg: '#100e0c',
      nav: '#19150f',
      panel: '#272119',
      hero: '#42341f',
      border: '#91713b',
      glow: '#94672744',
      active: '#3c301c'
    }
  };

  const root = document.documentElement;

  function readSaved() {
    try {
      const value = localStorage.getItem(KEY);
      return Object.hasOwn(palettes, value)
        ? value
        : 'emerald';
    } catch {
      return 'emerald';
    }
  }

  const style = document.createElement('style');
  style.id = 'axiom-ultimate-theme-css';

  style.textContent = `
    html[data-axiom-theme] body {
      background:
        radial-gradient(ellipse at 80% 0%,
          var(--axiom-glow), transparent 45%),
        var(--axiom-bg) !important;
    }

    html[data-axiom-theme] nav.container-fluid,
    html[data-axiom-theme] nav.topnav {
      background: var(--axiom-nav) !important;
      border-bottom-color: var(--axiom-border) !important;
    }

    html[data-axiom-theme] .hero {
      background:
        linear-gradient(115deg,
          var(--axiom-hero),
          var(--axiom-panel) 83%) !important;
      border-color: var(--axiom-border) !important;
    }

    html[data-axiom-theme] .panel,
    html[data-axiom-theme] .stat,
    html[data-axiom-theme] .metric,
    html[data-axiom-theme] .side-note,
    html[data-axiom-theme] .toolbar,
    html[data-axiom-theme] .subscribe article {
      background: var(--axiom-panel) !important;
      border-color: var(--axiom-border) !important;
    }

    html[data-axiom-theme] .sidebar {
      background: var(--axiom-bg) !important;
      border-color: var(--axiom-border) !important;
    }

    html[data-axiom-theme] .eyebrow,
    html[data-axiom-theme] .brand span,
    html[data-axiom-theme] .hero h2 em,
    html[data-axiom-theme] .side-label {
      color: var(--axiom-accent) !important;
    }

    html[data-axiom-theme] .side.active,
    html[data-axiom-theme] .side:hover {
      background: var(--axiom-active) !important;
      color: var(--axiom-accent) !important;
    }

    html[data-axiom-theme] button.primary,
    html[data-axiom-theme] button.mint,
    html[data-axiom-theme] a.mint,
    html[data-axiom-theme] nav a[role="button"] {
      background: var(--axiom-accent) !important;
      border-color: var(--axiom-accent) !important;
      color: #08211d !important;
    }

    html[data-axiom-theme] button.primary:hover,
    html[data-axiom-theme] button.mint:hover,
    html[data-axiom-theme] a.mint:hover {
      filter: brightness(1.08);
    }

    html[data-axiom-theme] .fill:not(.loss),
    html[data-axiom-theme] .meter > div {
      background: var(--axiom-accent) !important;
    }

    #axiom-theme-dock {
      position: fixed;
      right: 17px;
      bottom: 17px;
      z-index: 10000;
      font-family: Inter, system-ui, sans-serif;
      color: #ecf8f5;
    }

    #axiom-theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      min-height: 45px;
      background: var(--axiom-panel);
      border: 1px solid var(--axiom-border);
      border-radius: 999px;
      color: #f2fcf9;
      font-size: 13px;
      font-weight: 800;
      box-shadow: 0 10px 35px #0008;
      cursor: pointer;
      width: auto;
      margin: 0;
    }

    #axiom-theme-toggle:hover {
      border-color: var(--axiom-accent);
    }

    #axiom-theme-menu {
      position: absolute;
      bottom: 55px;
      right: 0;
      width: 235px;
      max-width: calc(100vw - 25px);
      background: var(--axiom-panel);
      border: 1px solid var(--axiom-border);
      border-radius: 16px;
      box-shadow: 0 20px 55px #000a;
      padding: 13px;
    }

    #axiom-theme-menu[hidden] {
      display: none !important;
    }

    #axiom-theme-menu strong {
      display: block;
      color: #f3fbfa;
      font-size: 13px;
      margin-bottom: 10px;
    }

    #axiom-theme-menu button {
      display: flex;
      align-items: center;
      gap: 10px;
      text-align: left;
      width: 100%;
      margin: 4px 0;
      padding: 11px;
      border: 1px solid transparent;
      border-radius: 9px;
      background: transparent;
      color: #eaf7f5;
      font: 600 12px Inter, system-ui, sans-serif;
      cursor: pointer;
    }

    #axiom-theme-menu button:hover,
    #axiom-theme-menu button[aria-pressed="true"] {
      background: var(--axiom-active);
      border-color: var(--axiom-border);
    }

    .axiom-theme-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
      background: var(--swatch);
    }

    #axiom-theme-toggle:focus-visible,
    #axiom-theme-menu button:focus-visible {
      outline: 2px solid var(--axiom-accent);
      outline-offset: 3px;
    }

    @media (max-width: 550px) {
      #axiom-theme-dock {
        right: 10px;
        bottom: 10px;
      }

      #axiom-theme-toggle {
        padding: 10px 13px;
      }
    }
  `;

  document.head.appendChild(style);

  let current = readSaved();

  function applyTheme(key) {
    if (!Object.hasOwn(palettes, key)) return;

    const p = palettes[key];
    current = key;
    root.dataset.axiomTheme = key;

    const vars = {
      '--axiom-accent': p.accent,
      '--axiom-bg': p.bg,
      '--axiom-nav': p.nav,
      '--axiom-panel': p.panel,
      '--axiom-hero': p.hero,
      '--axiom-border': p.border,
      '--axiom-glow': p.glow,
      '--axiom-active': p.active,
      '--primary': p.accent,
      '--primary-hover': p.hover
    };

    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value);
    }

    try {
      localStorage.setItem(KEY, key);
    } catch {
      // Theme still works when browser storage is unavailable.
    }

    document.querySelectorAll(
      '#axiom-theme-menu button[data-theme]'
    ).forEach(button => {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.theme === key)
      );
    });
  }

  // Apply the saved palette before adding the controls.
  applyTheme(current);

  function initControls() {
    const main = document.querySelector('main.container');
    if (!main || document.getElementById('axiom-theme-dock')) {
      return;
    }

    const dock = document.createElement('div');
    dock.id = 'axiom-theme-dock';

    const toggle = document.createElement('button');
    toggle.id = 'axiom-theme-toggle';
    toggle.type = 'button';
    toggle.textContent = '🎨 Themes';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'axiom-theme-menu');

    const menu = document.createElement('div');
    menu.id = 'axiom-theme-menu';
    menu.hidden = true;

    const heading = document.createElement('strong');
    heading.textContent = 'AXIOM Appearance';
    menu.appendChild(heading);

    for (const [key, palette] of Object.entries(palettes)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.theme = key;

      const dot = document.createElement('span');
      dot.className = 'axiom-theme-dot';
      dot.style.setProperty('--swatch', palette.accent);

      const label = document.createElement('span');
      label.textContent = palette.name;

      button.append(dot, label);
      button.addEventListener('click', () => {
        applyTheme(key);
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      });

      menu.appendChild(button);
    }

    toggle.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      toggle.setAttribute(
        'aria-expanded',
        String(!menu.hidden)
      );
    });

    document.addEventListener('pointerdown', event => {
      if (!dock.contains(event.target)) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    dock.append(menu, toggle);
    main.appendChild(dock);
    applyTheme(current);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initControls);
  } else {
    initControls();
  }
})();
