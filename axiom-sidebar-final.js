
/*
 * AXIOM PRO ULTIMATE
 * FINAL SIDEBAR — DINATRAN FOUNDER EDITION
 *
 * Standalone visual enhancement.
 * Preserves existing sidebar links and journal data.
 */
(() => {
  "use strict";

  function initSidebar() {
    const sidebar = document.querySelector("aside.sidebar");

    if (!sidebar || sidebar.dataset.axiomFinal === "1") {
      return;
    }

    sidebar.dataset.axiomFinal = "1";
    sidebar.classList.add("axiom-sb");

    // =====================================
    // 1. PREMIUM STYLES
    // =====================================

    const styles = document.createElement("style");
    styles.id = "axiom-final-sidebar-styles";

    styles.textContent = `
      .sidebar.axiom-sb {
        --ax-green: #5af2c3;
        --ax-cyan: #50cfff;
        --ax-purple: #a98bff;
        --ax-muted: #91b2c6;
        --ax-line: rgba(106, 186, 203, .17);

        width: 100%;
        min-width: 0;
        padding: 16px 12px 28px !important;

        background: linear-gradient(
          180deg,
          #0a1825 0%,
          #081320 48%,
          #090e1b 100%
        ) !important;

        border-right: 1px solid var(--ax-line) !important;

        position: sticky;
        top: 76px;
        height: calc(100dvh - 76px);
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #2d5d66 transparent;
        overscroll-behavior: contain;
      }

      .sidebar.axiom-sb *,
      .sidebar.axiom-sb *::before,
      .sidebar.axiom-sb *::after {
        box-sizing: border-box;
      }

      .sidebar.axiom-sb::-webkit-scrollbar {
        width: 5px;
      }

      .sidebar.axiom-sb::-webkit-scrollbar-thumb {
        border-radius: 20px;
        background: #315d69;
      }

      .sidebar.axiom-sb [hidden] {
        display: none !important;
      }

      /* FOUNDER CARD */

      .sidebar.axiom-sb .axiom-founder {
        position: relative;
        isolation: isolate;
        overflow: hidden;

        margin: 0 0 12px;
        padding: 19px 15px 16px;

        border-radius: 17px;
        border: 1px solid rgba(89, 241, 200, .35);

        background:
          radial-gradient(
            ellipse at 100% 0%,
            rgba(63, 224, 205, .17),
            transparent 62%
          ),
          linear-gradient(135deg, #12393c, #131d36);

        box-shadow:
          0 12px 32px rgba(0, 0, 0, .2),
          inset 0 1px rgba(255, 255, 255, .07);
      }

      .sidebar.axiom-sb .axiom-founder::before {
        content: "";
        position: absolute;
        left: -30%;
        bottom: -110%;
        width: 160%;
        height: 115%;
        border-radius: 50%;
        background: rgba(38, 236, 195, .1);
        filter: blur(30px);
        pointer-events: none;
        z-index: -1;
      }

      .sidebar.axiom-sb .axiom-founder-kicker {
        font-size: 9px;
        font-weight: 850;
        letter-spacing: 1.8px;
        color: #80ffdc;
        margin-bottom: 8px;
      }

      .sidebar.axiom-sb .axiom-founder-name {
        display: block;
        margin: 0 0 5px;
        font-size: clamp(16px, 1.45vw, 21px);
        font-weight: 950;
        letter-spacing: 1.1px;
        line-height: 1.2;
        color: #71ffdc;
        text-shadow: 0 0 20px rgba(65, 241, 198, .26);
        overflow-wrap: anywhere;
      }

      .sidebar.axiom-sb .axiom-founder-role {
        margin: 0;
        color: #bbcfdf;
        font-size: 9px;
        font-weight: 750;
        letter-spacing: .65px;
      }

      .sidebar.axiom-sb .axiom-founder-line {
        height: 1px;
        margin: 15px 0 12px;
        background: linear-gradient(
          90deg,
          rgba(98, 255, 212, .45),
          transparent
        );
      }

      .sidebar.axiom-sb .axiom-founder-stats {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 7px;
      }

      .sidebar.axiom-sb .axiom-founder-stats span {
        font-size: 9px;
        letter-spacing: .5px;
        color: #9ebccd;
      }

      .sidebar.axiom-sb .axiom-founder-stats strong {
        font-size: 12px;
        color: #69ffd0;
        font-variant-numeric: tabular-nums;
      }

      /* SIDEBAR SEARCH */

      .sidebar.axiom-sb .axiom-sidebar-search {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 10px 11px;
        margin: 0 0 13px;

        border: 1px solid #335466;
        border-radius: 11px;
        background: #0c2030;

        transition:
          border-color .2s,
          box-shadow .2s;
      }

      .sidebar.axiom-sb .axiom-sidebar-search:focus-within {
        border-color: #62f0c5;
        box-shadow: 0 0 0 3px rgba(79, 237, 191, .11);
      }

      .sidebar.axiom-sb .axiom-sidebar-search svg {
        flex-shrink: 0;
        color: #8aafc2;
      }

      .sidebar.axiom-sb .axiom-sidebar-search input {
        min-width: 0;
        width: 100%;
        height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
        color: #e7f8ff !important;
        font-size: 11px !important;
      }

      .sidebar.axiom-sb .axiom-sidebar-search input::placeholder {
        color: #809daf;
      }

      .sidebar.axiom-sb .axiom-key {
        flex-shrink: 0;
        font-size: 9px;
        padding: 3px 4px;
        border-radius: 5px;
        color: #a6c0d0;
        border: 1px solid #335467;
      }

      /* COLLAPSIBLE HEADINGS */

      .sidebar.axiom-sb .side-label {
        padding: 0 !important;
        margin: 19px 2px 7px !important;
        background: none !important;
        border: 0 !important;
      }

      .sidebar.axiom-sb .side-label::before,
      .sidebar.axiom-sb .side-label::after {
        display: none !important;
      }

      .sidebar.axiom-sb .axiom-section-toggle {
        display: flex !important;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 7px;
        min-height: 29px;
        padding: 3px 5px !important;
        margin: 0 !important;

        border: 0 !important;
        border-radius: 7px;
        background: transparent !important;
        box-shadow: none !important;

        text-align: left;
        cursor: pointer;
        color: #78f6cd !important;
      }

      .sidebar.axiom-sb .axiom-section-name {
        min-width: 0;
        font-size: 10px;
        font-weight: 900;
        line-height: 1.35;
        letter-spacing: 1.3px;
        text-transform: uppercase;
      }

      .sidebar.axiom-sb .axiom-section-count {
        margin-left: auto;
        padding: 2px 5px;
        border-radius: 5px;
        background: #1a3541;
        color: #9ac1cc;
        font-size: 9px;
        font-weight: 800;
      }

      .sidebar.axiom-sb .axiom-chevron {
        width: 14px;
        height: 14px;
        transition: transform .2s ease;
        color: #8ab9c6;
      }

      .sidebar.axiom-sb
      .axiom-section-toggle[aria-expanded="false"]
      .axiom-chevron {
        transform: rotate(-90deg);
      }

      .sidebar.axiom-sb
      .axiom-section-toggle:hover {
        background: rgba(75, 240, 193, .05) !important;
      }

      /* MENU LINKS */

      .sidebar.axiom-sb a.side {
        display: flex !important;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 42px;

        padding: 10px 11px !important;
        margin: 4px 0 !important;
        border: 1px solid transparent !important;
        border-radius: 11px !important;

        background: transparent !important;
        box-shadow: none;
        color: #bad5e3 !important;

        font-family: inherit;
        font-size: 11px !important;
        font-weight: 650;
        line-height: 1.4;

        text-decoration: none !important;

        transition:
          background .18s ease,
          border-color .18s ease,
          color .18s ease,
          transform .18s ease,
          box-shadow .18s ease;
      }

      .sidebar.axiom-sb a.side .axiom-side-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 17px;
        width: 17px;
        height: 17px;
        color: #92b6cc;
      }

      .sidebar.axiom-sb a.side .axiom-side-text {
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
      }

      .sidebar.axiom-sb a.side:hover {
        transform: translateX(3px);
        background: rgba(76, 238, 197, .08) !important;
        border-color: rgba(75, 239, 196, .21) !important;
        color: #ffffff !important;
        box-shadow: 0 5px 21px rgba(0, 0, 0, .14);
      }

      .sidebar.axiom-sb a.side:hover
      .axiom-side-icon {
        color: #77f9d1;
      }

      .sidebar.axiom-sb a.side.active {
        position: relative;

        color: #85ffdc !important;

        background: linear-gradient(
          105deg,
          rgba(54, 232, 174, .22),
          rgba(44, 149, 167, .09)
        ) !important;

        border-color: rgba(89, 255, 208, .3) !important;

        box-shadow:
          inset 0 1px rgba(156, 255, 224, .07),
          0 5px 24px rgba(42, 222, 164, .09);
      }

      .sidebar.axiom-sb a.side.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 8px;
        bottom: 8px;
        width: 3px;
        border-radius: 8px;
        background: linear-gradient(
          180deg,
          #70ffce,
          #41a9ff
        );
        box-shadow: 0 0 11px #55efc48a;
      }

      .sidebar.axiom-sb a.side.active
      .axiom-side-icon {
        color: #80ffdc;
      }

      .sidebar.axiom-sb a.side:focus-visible,
      .sidebar.axiom-sb button:focus-visible {
        outline: 2px solid #69f5ca !important;
        outline-offset: 2px;
      }

      /* MENU LABELS */

      .sidebar.axiom-sb .axiom-side-badge {
        flex-shrink: 0;
        padding: 3px 5px;
        border-radius: 5px;
        background: rgba(76, 240, 191, .12);
        color: #6cf4c5;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: .5px;
      }

      /* YOUR EDGE CARD */

      .sidebar.axiom-sb .side-note {
        margin: 16px 0 12px !important;
        padding: 16px !important;
        border-radius: 14px !important;
        border: 1px solid rgba(95, 233, 199, .23) !important;

        background: linear-gradient(
          145deg,
          rgba(18, 66, 54, .63),
          rgba(16, 34, 57, .92)
        ) !important;
      }

      .sidebar.axiom-sb .side-note .eyebrow {
        display: block;
        color: #77ffd5 !important;
        letter-spacing: 1.5px;
        font-size: 9px !important;
      }

      .sidebar.axiom-sb .side-note strong {
        display: block;
        margin: 8px 0;
        font-size: 12px !important;
        color: #fff !important;
      }

      .sidebar.axiom-sb .side-note p {
        margin: 0;
        font-size: 10px !important;
        line-height: 1.65;
        color: #a6c4d3 !important;
      }

      /* FLOATING MOBILE MENU */

      .axiom-sidebar-fab,
      .axiom-sidebar-close,
      .axiom-sidebar-backdrop {
        display: none;
      }

      @media (max-width: 980px) {
        .app-grid {
          grid-template-columns: minmax(0, 1fr) !important;
        }

        .app-grid > .content {
          min-width: 0;
        }

        .sidebar.axiom-sb {
          position: fixed !important;
          z-index: 1001 !important;

          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;

          width: min(315px, 88vw) !important;
          max-width: 88vw;
          height: 100dvh !important;

          padding: 18px 14px 28px !important;
          box-shadow: 28px 0 90px #0008;

          transform: translateX(-105%);
          visibility: hidden;

          transition:
            transform .25s ease,
            visibility .25s ease;
        }

        body.axiom-sidebar-open
        .sidebar.axiom-sb {
          transform: translateX(0);
          visibility: visible;
        }

        .axiom-sidebar-fab {
          position: fixed;
          z-index: 1000;
          bottom: 22px;
          left: 17px;

          display: inline-flex;
          align-items: center;
          gap: 9px;

          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid #65ecc7;

          background: #10372e;
          color: #80ffda;

          font: 850 12px system-ui, sans-serif;
          box-shadow: 0 12px 35px #0007;
          cursor: pointer;
        }

        .axiom-sidebar-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;

          display: block;
          background: #020812bf;
          opacity: 0;
          visibility: hidden;

          transition:
            opacity .2s ease,
            visibility .2s ease;
        }

        body.axiom-sidebar-open
        .axiom-sidebar-backdrop {
          opacity: 1;
          visibility: visible;
        }

        .axiom-sidebar-close {
          display: flex !important;
          width: 100%;
          justify-content: flex-end;
          margin: 0 0 12px;
          padding: 8px !important;

          background: transparent !important;
          border: 0 !important;
          color: #a9c7d9 !important;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        body.axiom-sidebar-open {
          overflow: hidden;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .sidebar.axiom-sb *,
        .axiom-sidebar-fab,
        .axiom-sidebar-backdrop {
          transition-duration: .01ms !important;
          animation-duration: .01ms !important;
        }
      }
    `;

    document.head.appendChild(styles);

    // =====================================
    // 2. SVG ICON SYSTEM
    // =====================================

    const icons = {
      dashboard:
        '<rect x="3" y="3" width="7" height="7" rx="1"/>' +
        '<rect x="14" y="3" width="7" height="7" rx="1"/>' +
        '<rect x="3" y="14" width="7" height="7" rx="1"/>' +
        '<rect x="14" y="14" width="7" height="7" rx="1"/>',

      chart:
        '<path d="M3 3v18h18"/>' +
        '<path d="m7 16 4-5 4 3 5-7"/>',

      calendar:
        '<rect x="3" y="5" width="18" height="16" rx="2"/>' +
        '<path d="M16 3v4M8 3v4M3 10h18"/>',

      history:
        '<path d="M3 12a9 9 0 1 0 3-6.7"/>' +
        '<path d="M3 3v6h6"/>' +
        '<path d="M12 7v5l3 2"/>',

      plus:
        '<circle cx="12" cy="12" r="9"/>' +
        '<path d="M12 7v10M7 12h10"/>',

      target:
        '<circle cx="12" cy="12" r="9"/>' +
        '<circle cx="12" cy="12" r="5"/>' +
        '<circle cx="12" cy="12" r="1"/>',

      book:
        '<path d="M12 7v14"/>' +
        '<path d="M3 5a6 6 0 0 1 9 2 6 6 0 0 1 9-2v14a6 6 0 0 0-9 2 6 6 0 0 0-9-2z"/>',

      activity:
        '<path d="M3 12h4l3-7 4 14 3-7h4"/>',

      shield:
        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>' +
        '<path d="m9 12 2 2 4-4"/>',

      checklist:
        '<rect x="4" y="4" width="16" height="16" rx="2"/>' +
        '<path d="m8 12 3 3 5-6"/>',

      sparkles:
        '<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/>' +
        '<path d="M19 18v4M17 20h4"/>',

      trending:
        '<path d="m3 17 6-6 4 4 8-8"/>' +
        '<path d="M15 7h6v6"/>',

      upload:
        '<path d="M12 16V3"/>' +
        '<path d="m7 8 5-5 5 5"/>' +
        '<path d="M4 16v5h16v-5"/>',

      monitor:
        '<rect x="2" y="3" width="20" height="15" rx="2"/>' +
        '<path d="M8 22h8M12 18v4"/>',

      lock:
        '<rect x="4" y="11" width="16" height="10" rx="2"/>' +
        '<path d="M8 11V7a4 4 0 0 1 8 0v4"/>',

      trophy:
        '<path d="M8 21h8M12 17v4"/>' +
        '<path d="M7 3h10v6a5 5 0 0 1-10 0z"/>' +
        '<path d="M7 5H4v3a4 4 0 0 0 4 4"/>' +
        '<path d="M17 5h3v3a4 4 0 0 1-4 4"/>',

      wallet:
        '<rect x="3" y="5" width="18" height="16" rx="2"/>' +
        '<path d="M3 9h18M16 15h2"/>',

      timer:
        '<circle cx="12" cy="13" r="8"/>' +
        '<path d="M12 9v4l3 2M9 2h6"/>',

      music:
        '<path d="M9 18V5l12-2v13"/>' +
        '<circle cx="6" cy="18" r="3"/>' +
        '<circle cx="18" cy="16" r="3"/>',

      circle:
        '<circle cx="12" cy="12" r="9"/>' +
        '<circle cx="12" cy="12" r="2"/>'
    };

    function svg(name, size = 18) {
      const shapes = icons[name] || icons.circle;

      return (
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
        'width="' + size + '" height="' + size + '" ' +
        'viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round" ' +
        'aria-hidden="true">' +
        shapes +
        '</svg>'
      );
    }

    function normalize(text) {
      return String(text || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    function pickIcon(text) {
      const name = normalize(text);

      if (name.includes("tong quan")) return "dashboard";
      if (name.includes("phan tich")) return "chart";
      if (name.includes("lich pnl")) return "calendar";
      if (name.includes("lich su")) return "history";

      if (name.includes("nhap giao dich")) return "plus";
      if (name.includes("muc tieu")) return "target";
      if (name.includes("playbook")) return "book";

      if (name.includes("real market")) return "activity";
      if (name.includes("risk lab")) return "shield";
      if (name.includes("checklist")) return "checklist";
      if (name.includes("grading")) return "sparkles";

      if (name.includes("growth")) return "trending";
      if (name.includes("csv")) return "upload";
      if (name.includes("terminal")) return "monitor";
      if (name.includes("vault")) return "lock";
      if (name.includes("achievement")) return "trophy";
      if (name.includes("paper trading")) return "wallet";

      if (name.includes("timer")) return "timer";
      if (name.includes("music")) return "music";
      if (name.includes("encyclopedia")) return "book";

      return "circle";
    }

    function badgeFor(text) {
      const name = normalize(text);

      if (name.includes("real market")) return "LAB";
      if (name.includes("paper trading")) return "DEMO";
      if (name.includes("private backup")) return "SAFE";

      return "";
    }

    // Upgrade existing links without changing their hrefs.
    const links = [
      ...sidebar.querySelectorAll("a.side")
    ];

    links.forEach(link => {
      const raw = link.textContent
        .replace(/\s+/g, " ")
        .trim();

      // Remove leading decorative Unicode icon only.
      const match = raw.match(/[\p{L}\p{N}].*$/u);
      const title = match ? match[0].trim() : raw;

      link.dataset.axiomTitle = normalize(title);
      link.replaceChildren();

      const icon = document.createElement("span");
      icon.className = "axiom-side-icon";
      icon.innerHTML = svg(pickIcon(title));

      const label = document.createElement("span");
      label.className = "axiom-side-text";
      label.textContent = title;

      link.append(icon, label);

      const badgeText = badgeFor(title);

      if (badgeText) {
        const badge = document.createElement("span");
        badge.className = "axiom-side-badge";
        badge.textContent = badgeText;
        link.appendChild(badge);
      }

      link.setAttribute("title", title);
    });

    // =====================================
    // 3. FOUNDER EDITION PROFILE
    // =====================================

    const founder = document.createElement("div");
    founder.className = "axiom-founder";

    founder.innerHTML = `
      <div class="axiom-founder-kicker">
        ✦ FOUNDER EDITION
      </div>

      <strong class="axiom-founder-name">
        DINATRAN
      </strong>

      <p class="axiom-founder-role">
        CREATOR OF AXIOM ULTIMATE
      </p>

      <div class="axiom-founder-line"></div>

      <div class="axiom-founder-stats">
        <span>STUDY TODAY</span>
        <strong id="axiom-founder-study">—</strong>
      </div>
    `;

    sidebar.prepend(founder);

    function updateFounderStudy() {
      const target = document.getElementById(
        "axiom-founder-study"
      );

      if (!target) return;

      const now = new Date();

      const dateKey = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");

      try {
        const data = JSON.parse(
          localStorage.getItem(
            "axiom_learning_time_v1"
          ) || "{}"
        );

        const seconds = Number(data[dateKey] || 0);

        target.textContent =
          Number.isFinite(seconds) && seconds >= 0
            ? Math.floor(seconds / 60) + "m"
            : "—";

      } catch {
        target.textContent = "—";
      }
    }

    updateFounderStudy();
    setInterval(updateFounderStudy, 30000);

    // =====================================
    // 4. SEARCH BAR
    // =====================================

    const searchBox = document.createElement("div");
    searchBox.className = "axiom-sidebar-search";

    searchBox.innerHTML =
      svg("circle", 14) +
      '<input type="search" ' +
      'placeholder="Tìm công cụ..." ' +
      'aria-label="Tìm trong sidebar AXIOM">' +
      '<span class="axiom-key">⌘K</span>';

    founder.insertAdjacentElement(
      "afterend",
      searchBox
    );

    const searchInput = searchBox.querySelector("input");

    // Replace generic search icon with a magnifier.
    const iconNode = searchBox.querySelector("svg");

    if (iconNode) {
      iconNode.innerHTML =
        '<circle cx="11" cy="11" r="7"/>' +
        '<path d="m20 20-4-4"/>';
    }

    // =====================================
    // 5. COLLAPSIBLE MENU GROUPS
    // =====================================

    const STORAGE = "axiom_sidebar_groups_v1";

    let collapsed = {};

    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE) || "{}"
      );

      if (
        saved &&
        typeof saved === "object" &&
        !Array.isArray(saved)
      ) {
        collapsed = saved;
      }
    } catch {
      collapsed = {};
    }

    const groups = [];
    const headings = [
      ...sidebar.querySelectorAll(".side-label")
    ];

    headings.forEach((heading, index) => {
      const name = heading.textContent.trim();
      const key = normalize(name) || "section-" + index;

      const nodes = [];

      let node = heading.nextElementSibling;

      while (node && !node.classList.contains("side-label")) {
        nodes.push(node);
        node = node.nextElementSibling;
      }

      const groupLinks = nodes.flatMap(node => {
        if (node.matches("a.side")) return [node];

        return [
          ...node.querySelectorAll("a.side")
        ];
      });

      const button = document.createElement("button");

      button.type = "button";
      button.className = "axiom-section-toggle";
      button.setAttribute("aria-expanded", "true");

      const title = document.createElement("span");
      title.className = "axiom-section-name";
      title.textContent = name;

      const count = document.createElement("span");
      count.className = "axiom-section-count";
      count.textContent = String(groupLinks.length);

      const chevron = document.createElement("span");
      chevron.className = "axiom-chevron";

      chevron.innerHTML =
        '<svg width="14" height="14" ' +
        'viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" ' +
        'stroke-linejoin="round">' +
        '<path d="m6 9 6 6 6-6"/>' +
        '</svg>';

      button.append(title, count, chevron);
      heading.replaceChildren(button);

      const group = {
        key,
        heading,
        button,
        nodes,
        links: groupLinks
      };

      groups.push(group);

      button.addEventListener("click", () => {
        if (searchInput.value.trim()) {
          searchInput.value = "";
        }

        collapsed[key] = !collapsed[key];

        try {
          localStorage.setItem(
            STORAGE,
            JSON.stringify(collapsed)
          );
        } catch {
          // Menu still works without persistent storage.
        }

        updateGroups();
      });
    });

    function updateGroups() {
      const query = normalize(searchInput.value);

      // Restore all link visibility first.
      links.forEach(link => {
        link.hidden = false;
      });

      groups.forEach(group => {
        if (query) {
          let count = 0;

          group.nodes.forEach(node => {
            const children = node.matches("a.side")
              ? [node]
              : [...node.querySelectorAll("a.side")];

            if (!children.length) {
              node.hidden = true;
              return;
            }

            let visible = 0;

            children.forEach(link => {
              const matches =
                link.dataset.axiomTitle.includes(query);

              link.hidden = !matches;

              if (matches) visible++;
            });

            node.hidden = visible === 0;
            count += visible;
          });

          group.heading.hidden = count === 0;

          group.button.setAttribute(
            "aria-expanded",
            "true"
          );

        } else {
          const isCollapsed = collapsed[group.key] === true;

          group.heading.hidden = false;

          group.nodes.forEach(node => {
            node.hidden = isCollapsed;
          });

          group.button.setAttribute(
            "aria-expanded",
            String(!isCollapsed)
          );
        }
      });
    }

    searchInput.addEventListener("input", updateGroups);

    // =====================================
    // 6. AUTO ACTIVE PAGE
    // =====================================

    function normalizedPath(path) {
      const clean = path.replace(/\/+$/, "");

      return clean.endsWith(".html")
        ? clean
        : clean + "/index.html";
    }

    function highlightActive() {
      const currentPath = normalizedPath(
        window.location.pathname
      );

      const currentHash = window.location.hash;

      let activeLink = null;

      links.forEach(link => {
        link.classList.remove("active");
        link.removeAttribute("aria-current");

        const href = link.getAttribute("href");

        if (!href) return;

        let url;

        try {
          url = new URL(href, window.location.href);
        } catch {
          return;
        }

        if (url.origin !== window.location.origin) {
          return;
        }

        const samePage =
          normalizedPath(url.pathname) === currentPath;

        if (!samePage) return;

        const isMatch = url.hash
          ? (
              url.hash === currentHash ||
              (
                !currentHash &&
                url.hash === "#dashboard"
              )
            )
          : !currentHash;

        if (isMatch) {
          activeLink = link;
        }
      });

      if (activeLink) {
        activeLink.classList.add("active");

        activeLink.setAttribute(
          "aria-current",
          activeLink.getAttribute("href").startsWith("#")
            ? "location"
            : "page"
        );

        // Keep the active menu group expanded.
        const group = groups.find(item =>
          item.links.includes(activeLink)
        );

        if (group && collapsed[group.key]) {
          collapsed[group.key] = false;
          updateGroups();
        }
      }
    }

    // =====================================
    // 7. RESPONSIVE DRAWER
    // =====================================

    const mobileToggle = document.createElement("button");

    mobileToggle.type = "button";
    mobileToggle.className = "axiom-sidebar-fab";

    mobileToggle.innerHTML =
      svg("dashboard", 17) + "<span>AXIOM MENU</span>";

    mobileToggle.setAttribute(
      "aria-label",
      "Mở menu AXIOM"
    );

    mobileToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    const backdrop = document.createElement("div");

    backdrop.className = "axiom-sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    const mobileClose = document.createElement("button");

    mobileClose.type = "button";
    mobileClose.className = "axiom-sidebar-close";
    mobileClose.textContent = "✕ Đóng menu";

    sidebar.prepend(mobileClose);
    document.body.append(mobileToggle, backdrop);

    function setMobileMenu(open) {
      document.body.classList.toggle(
        "axiom-sidebar-open",
        open
      );

      mobileToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

      if (open) {
        mobileClose.focus();
      } else {
        mobileToggle.focus();
      }
    }

    mobileToggle.addEventListener("click", () => {
      setMobileMenu(
        !document.body.classList.contains(
          "axiom-sidebar-open"
        )
      );
    });

    mobileClose.addEventListener("click", () => {
      setMobileMenu(false);
    });

    backdrop.addEventListener("click", () => {
      setMobileMenu(false);
    });

    sidebar.addEventListener("click", event => {
      const link = event.target.closest("a.side");

      if (!link) return;

      // Do not interfere with regular link navigation.
      document.body.classList.remove(
        "axiom-sidebar-open"
      );

      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      setTimeout(highlightActive, 0);
    });

    window.addEventListener(
      "hashchange",
      highlightActive
    );

    // Ctrl + K: focus quick search.
    document.addEventListener("keydown", event => {
      const commandK =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (commandK) {
        event.preventDefault();

        if (window.innerWidth <= 980) {
          document.body.classList.add(
            "axiom-sidebar-open"
          );

          mobileToggle.setAttribute(
            "aria-expanded",
            "true"
          );
        }

        searchInput.focus();
        searchInput.select();
      }

      if (event.key === "Escape") {
        if (document.body.classList.contains(
          "axiom-sidebar-open"
        )) {
          setMobileMenu(false);
        } else if (document.activeElement === searchInput) {
          searchInput.value = "";
          updateGroups();
          searchInput.blur();
        }
      }
    });

    // =====================================
    // 8. INITIALIZE
    // =====================================

    highlightActive();
    updateGroups();

    console.info(
      "AXIOM Founder Edition Sidebar initialized."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initSidebar,
      { once: true }
    );
  } else {
    initSidebar();
  }
})();
