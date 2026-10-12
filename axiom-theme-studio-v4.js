
/*
 * AXIOM THEME STUDIO PRO
 * Enhances the EXISTING ultimate-theme.js UI.
 *
 * Uses its original theme buttons and storage.
 * Does not create another theme engine.
 */

(() => {
  "use strict";

  const GLOW_KEY = "axiom_theme_studio_glow_v1";
  const DEFAULT_GLOW = 50;

  const favorites = [
    "emerald",
    "cyber",
    "purple",
    "gold"
  ];

  function savedGlow() {
    try {
      const value = Number(
        localStorage.getItem(GLOW_KEY)
      );

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 100
      ) {
        return DEFAULT_GLOW;
      }

      return value;
    } catch {
      return DEFAULT_GLOW;
    }
  }

  function init() {
    const root = document.documentElement;

    const menu = document.getElementById(
      "axiom-theme-menu"
    );

    const toggle = document.getElementById(
      "axiom-theme-toggle"
    );

    if (
      !menu ||
      !toggle ||
      menu.dataset.studioReady === "1"
    ) {
      return;
    }

    menu.dataset.studioReady = "1";

    // Keep all 16 original buttons and click handlers.
    const originalButtons = [
      ...menu.querySelectorAll(
        "button[data-theme]"
      )
    ];

    if (!originalButtons.length) return;

    const buttonMap = new Map(
      originalButtons.map(button => [
        button.dataset.theme,
        button
      ])
    );

    const heading = menu.querySelector(
      ":scope > strong"
    );

    if (heading) {
      heading.textContent =
        "✦ AXIOM THEME STUDIO PRO";
    }

    const label = document.createElement("span");
    label.className = "axts-label";
    label.textContent = "FAVORITE PALETTES";

    const favoriteGrid = document.createElement("div");
    favoriteGrid.className = "axts-favorites";

    favorites.forEach(key => {
      const button = buttonMap.get(key);

      if (button) {
        favoriteGrid.appendChild(button);
      }
    });

    const more = document.createElement("details");
    more.className = "axts-more";

    const summary = document.createElement("summary");
    summary.textContent =
      "Xem các bảng màu còn lại";

    const extra = document.createElement("div");
    extra.className = "axts-extra";

    originalButtons.forEach(button => {
      if (!favorites.includes(button.dataset.theme)) {
        extra.appendChild(button);
      }
    });

    more.append(summary, extra);

    // Glow controller
    const controls = document.createElement("div");
    controls.className = "axts-controls";

    const sliderHead = document.createElement("div");
    sliderHead.className = "axts-slider-head";

    const sliderLabel = document.createElement("label");
    sliderLabel.textContent = "Neon glow";
    sliderLabel.htmlFor = "axts-glow";

    const glowValue = document.createElement("span");
    glowValue.className = "axts-glow-value";

    const slider = document.createElement("input");
    slider.id = "axts-glow";
    slider.className = "axts-slider";
    slider.type = "range";
    slider.min = "0";
    slider.max = "100";
    slider.step = "5";
    slider.value = String(savedGlow());

    sliderHead.append(sliderLabel, glowValue);
    controls.append(sliderHead, slider);

    // Live preview
    const preview = document.createElement("div");
    preview.className = "axts-preview";

    const previewText = document.createElement("div");

    const previewName = document.createElement("strong");
    previewName.textContent = "AXIOM";

    const previewCaption = document.createElement("small");
    previewCaption.textContent =
      "DINATRAN FOUNDER EDITION";

    previewText.append(
      previewName,
      previewCaption
    );

    const previewDot = document.createElement("div");
    previewDot.className = "axts-preview-dot";
    previewDot.setAttribute("aria-hidden", "true");

    preview.append(previewText, previewDot);

    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "axts-reset";
    reset.textContent = "↺ Reset về AXIOM Emerald";

    // Rebuild only the existing menu layout.
    // Original palette buttons are MOVED,
    // not recreated, so handlers remain intact.
    menu.replaceChildren(
      ...(heading ? [heading] : []),
      label,
      favoriteGrid,
      more,
      controls,
      preview,
      reset
    );

    function getAccent() {
      const accent = getComputedStyle(root)
        .getPropertyValue("--axiom-accent")
        .trim();

      return /^#[0-9a-f]{6}$/i.test(accent)
        ? accent
        : "#44f2b5";
    }

    function colorWithAlpha(color, alpha) {
      const hex = Math.round(
        Math.max(0, Math.min(255, alpha))
      ).toString(16).padStart(2, "0");

      return color + hex;
    }

    let level = savedGlow();

    function applyGlow(nextLevel, persist = true) {
      level = Math.max(
        0,
        Math.min(100, Number(nextLevel))
      );

      const accent = getAccent();

      // Existing theme system already uses
      // --axiom-glow for the page background.
      root.style.setProperty(
        "--axiom-glow",
        colorWithAlpha(accent, level * 1.7)
      );

      // Additional subtle glow for AXIOM Core.
      root.style.setProperty(
        "--axts-glow-color",
        colorWithAlpha(accent, level * 1.1)
      );

      glowValue.textContent = level + "%";
      slider.value = String(level);

      if (persist) {
        try {
          localStorage.setItem(
            GLOW_KEY,
            String(level)
          );
        } catch {
          // Visual setting still works.
        }
      }
    }

    function updatePreview() {
      const selected = menu.querySelector(
        'button[data-theme][aria-pressed="true"]'
      );

      previewName.textContent = selected
        ? selected.textContent.trim()
        : "AXIOM";
    }

    slider.addEventListener("input", () => {
      applyGlow(slider.value);
    });

    // Original button handler runs first:
    // it applies the theme and saves the
    // existing axiom_ultimate_theme_v1 key.
    // This listener then reapplies glow level.
    menu.addEventListener("click", event => {
      const themeButton = event.target.closest(
        "button[data-theme]"
      );

      if (themeButton) {
        applyGlow(level, false);
        updatePreview();
      }
    });

    reset.addEventListener("click", () => {
      const emerald = buttonMap.get("emerald");

      if (emerald) {
        emerald.click();
      }

      applyGlow(DEFAULT_GLOW);
      updatePreview();

      // Keep menu open after reset.
      menu.hidden = false;
      toggle.setAttribute(
        "aria-expanded",
        "true"
      );
    });

    // Refresh preview when opening Themes.
    toggle.addEventListener("click", () => {
      if (!menu.hidden) {
        updatePreview();
      }
    });

    toggle.textContent = "🎨 Theme Studio";

    applyGlow(level, false);
    updatePreview();

    console.info(
      "AXIOM Theme Studio PRO initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
