
(() => {
  'use strict';

  const KEY = 'axiom_ultimate_theme_v1';

 
const palettes = {
  emerald: {
    name: 'Emerald',
    accent: '#44f2b5', hover: '#8affd5',
    bg: '#080d14', nav: '#0a141e',
    panel: '#12232d', hero: '#173b31',
    border: '#346e59', glow: '#12644a55',
    active: '#133e30'
  },
  cyber: {
    name: 'Cyber Blue',
    accent: '#58c9ff', hover: '#94ddff',
    bg: '#080f20', nav: '#0a1427',
    panel: '#112537', hero: '#17394e',
    border: '#376c94', glow: '#135d9255',
    active: '#12374c'
  },
  purple: {
    name: 'Royal Purple',
    accent: '#bca0ff', hover: '#d9caff',
    bg: '#100b20', nav: '#161024',
    panel: '#241d38', hero: '#382851',
    border: '#7255a6', glow: '#6f3ea855',
    active: '#322349'
  },
  gold: {
    name: 'Gold Black',
    accent: '#ffd277', hover: '#ffe6ad',
    bg: '#100e0c', nav: '#19150f',
    panel: '#272119', hero: '#42341f',
    border: '#91713b', glow: '#94672744',
    active: '#3c301c'
  },
  lime: {
    name: 'Neon Lime',
    accent: '#b6ff58', hover: '#d5ff99',
    bg: '#0b100b', nav: '#111b12',
    panel: '#1b2b20', hero: '#23351d',
    border: '#577b35', glow: '#6dba2950',
    active: '#293e20'
  },
  cyan: {
    name: 'Electric Cyan',
    accent: '#39f4ec', hover: '#9afff9',
    bg: '#07151a', nav: '#0a1a20',
    panel: '#102a33', hero: '#123b45',
    border: '#28777e', glow: '#159f9f50',
    active: '#114149'
  },
  ocean: {
    name: 'Deep Ocean',
    accent: '#70baff', hover: '#b2dcff',
    bg: '#06111e', nav: '#0b1b2b',
    panel: '#112638', hero: '#17334a',
    border: '#37628c', glow: '#215d9655',
    active: '#173850'
  },
  nebula: {
    name: 'Nebula',
    accent: '#d0a2ff', hover: '#e6cbff',
    bg: '#100b1b', nav: '#191126',
    panel: '#251b39', hero: '#302350',
    border: '#7752a9', glow: '#7542ad50',
    active: '#37244d'
  },
  rose: {
    name: 'Rose Quartz',
    accent: '#ff9ccd', hover: '#ffd0e7',
    bg: '#180e19', nav: '#201220',
    panel: '#302032', hero: '#41283e',
    border: '#9c547d', glow: '#a43f8450',
    active: '#4d2a44'
  },
  sakura: {
    name: 'Sakura',
    accent: '#ffb4cc', hover: '#ffe2ec',
    bg: '#170e17', nav: '#241620',
    panel: '#33202e', hero: '#442537',
    border: '#9e637a', glow: '#a74d7250',
    active: '#4b2b3e'
  },
  orange: {
    name: 'Solar Orange',
    accent: '#ffad66', hover: '#ffce9e',
    bg: '#150f0a', nav: '#211810',
    panel: '#30231a', hero: '#46301d',
    border: '#956036', glow: '#b66b2e44',
    active: '#51341c'
  },
  arctic: {
    name: 'Arctic Ice',
    accent: '#a8eaff', hover: '#def7ff',
    bg: '#0b131b', nav: '#101d27',
    panel: '#182b36', hero: '#233b48',
    border: '#54889d', glow: '#468ca555',
    active: '#25414f'
  },
  chrome: {
    name: 'Chrome Silver',
    accent: '#e0e9f1', hover: '#ffffff',
    bg: '#101317', nav: '#171c21',
    panel: '#222a30', hero: '#2b333b',
    border: '#657784', glow: '#78909c33',
    active: '#323d45'
  },
  blood: {
    name: 'Blood Moon',
    accent: '#ff718d', hover: '#ffafbf',
    bg: '#170a10', nav: '#210d16',
    panel: '#321822', hero: '#49202c',
    border: '#9e455b', glow: '#b32c4c55',
    active: '#512334'
  },
  coral: {
    name: 'Sunset Coral',
    accent: '#ff9b8c', hover: '#ffc6bd',
    bg: '#190f14', nav: '#25171d',
    panel: '#35242b', hero: '#482b31',
    border: '#a35d61', glow: '#ba565755',
    active: '#543033'
  },
  holo: {
    name: 'Holographic',
    accent: '#8fffe0', hover: '#c4fff0',
    bg: '#0b1020', nav: '#111b2b',
    panel: '#1b2942', hero: '#263455',
    border: '#5276a9', glow: '#7350cf55',
    active: '#253d54'
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
  width: 330px;
  max-width: calc(100vw - 25px);
  max-height: min(65vh, 520px);
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
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
