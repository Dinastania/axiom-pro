
/*
 * AXIOM V4 — DAILY DISCIPLINE INSIGHTS
 * DINATRAN FOUNDER EDITION
 *
 * Reads existing Founder mission data.
 * Does not alter Journal, PNL, or Vault.
 */

(() => {
  "use strict";

  const PREFIX = "axiom_v4_founder_missions_";
  const MISSIONS = ["plan", "practice", "review"];

  function init() {
    const profile = document.querySelector(
      ".axv4-founder-profile"
    );

    if (!profile) return;

    if (document.getElementById("axmi-strip")) {
      return;
    }

    const footer = profile.querySelector(
      ".axv4-founder-bottom"
    );

    if (!footer) return;

    // -----------------------------------
    // 1. SMALL, ISOLATED CSS
    // -----------------------------------

    const style = document.createElement("style");
    style.id = "axmi-styles";

    style.textContent = `
      #axmi-strip,
      #axmi-strip * {
        box-sizing: border-box;
      }

      #axmi-strip {
        display: grid;
        grid-template-columns: minmax(130px, .65fr)
                               minmax(0, 1.35fr);
        align-items: center;
        gap: 16px;

        margin: 12px 0 0;
        padding: 13px;

        background: rgba(7, 23, 35, .4);
        border: 1px solid var(
          --axiom-border,
          #315c5c
        );

        border-radius: 12px;
      }

      #axmi-strip .axmi-label {
        color: var(
          --axiom-accent,
          #6af5c9
        );

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      #axmi-strip .axmi-streak {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-top: 6px;
      }

      #axmi-strip .axmi-streak strong {
        color: var(
          --axiom-accent,
          #70f4cd
        );

        font-size: 27px;
        font-weight: 950;
        line-height: 1;
      }

      #axmi-strip .axmi-streak span {
        color: #b3cbd8;
        font-size: 10px;
      }

      #axmi-strip .axmi-week {
        display: grid;
        grid-template-columns:
          repeat(7, minmax(0, 1fr));

        gap: 5px;
      }

      #axmi-strip .axmi-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        min-width: 0;
      }

      #axmi-strip .axmi-square {
        display: block;
        width: 100%;
        max-width: 34px;
        height: 23px;

        border-radius: 6px;
        background: rgba(114, 152, 172, .13);
        border: 1px solid rgba(
          133, 176, 191, .21
        );
      }

      #axmi-strip .axmi-day[data-level="partial"]
      .axmi-square {
        background: rgba(94, 208, 191, .28);
        border-color: rgba(95, 227, 190, .45);
      }

      #axmi-strip .axmi-day[data-level="full"]
      .axmi-square {
        background: var(
          --axiom-accent,
          #67f2c5
        );

        border-color: var(
          --axiom-accent,
          #67f2c5
        );
      }

      #axmi-strip .axmi-day small {
        color: #9bb8c9;
        font-size: 9px;
        font-weight: 750;
      }

      #axmi-strip .axmi-note {
        margin: 6px 0 0 !important;
        color: #91adbc !important;
        font-size: 9px !important;
        line-height: 1.5;
      }

      @media (max-width: 600px) {
        #axmi-strip {
          grid-template-columns: 1fr;
          gap: 12px;
        }
      }
    `;

    document.head.appendChild(style);

    // -----------------------------------
    // 2. ADD INSIDE EXISTING FOUNDER CARD
    // -----------------------------------

    const strip = document.createElement("div");
    strip.id = "axmi-strip";

    strip.innerHTML = `
      <div>
        <div class="axmi-label">
          🔥 FULL MISSION STREAK
        </div>

        <div class="axmi-streak">
          <strong id="axmi-streak-number">0</strong>
          <span>ngày liên tục</span>
        </div>

        <p class="axmi-note">
          Tính theo ngày hoàn thành đủ 3/3.
        </p>
      </div>

      <div>
        <div class="axmi-label"
             style="margin-bottom:10px">
          ACTIVITY / LAST 7 DAYS
        </div>

        <div class="axmi-week"
             id="axmi-week"
             aria-label="Tiến độ 7 ngày gần đây">
        </div>
      </div>
    `;

    footer.parentNode.insertBefore(strip, footer);

    // -----------------------------------
    // 3. READ FOUNDER DATA
    // -----------------------------------

    function dateAtOffset(offset) {
      const today = new Date();

      // Noon avoids some midnight/DST pitfalls.
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - offset,
        12
      );
    }

    function dateKey(offset) {
      const date = dateAtOffset(offset);

      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");
    }

    function completion(offset) {
      let saved;

      try {
        saved = JSON.parse(
          localStorage.getItem(
            PREFIX + dateKey(offset)
          ) || "{}"
        );
      } catch {
        return 0;
      }

      if (
        !saved ||
        typeof saved !== "object"
      ) {
        return 0;
      }

      return MISSIONS.filter(
        name => saved[name] === true
      ).length;
    }

    // -----------------------------------
    // 4. COMPUTE FULL-COMPLETION STREAK
    // -----------------------------------

    function calculateStreak() {
      let streak = 0;

      // If today's missions are incomplete,
      // yesterday can still preserve a streak.
      let offset = completion(0) === 3 ? 0 : 1;

      // Limit scanning to one year.
      for (let i = 0; i < 365; i++) {
        if (completion(offset) !== 3) {
          break;
        }

        streak++;
        offset++;
      }

      return streak;
    }

    // -----------------------------------
    // 5. RENDER SEVEN-DAY HISTORY
    // -----------------------------------

    const week = strip.querySelector("#axmi-week");
    const streakNumber = strip.querySelector(
      "#axmi-streak-number"
    );

    function render() {
      streakNumber.textContent =
        String(calculateStreak());

      const fragment = document.createDocumentFragment();

      for (let offset = 6; offset >= 0; offset--) {
        const date = dateAtOffset(offset);
        const completed = completion(offset);

        const day = document.createElement("div");
        day.className = "axmi-day";

        day.dataset.level =
          completed === 3
            ? "full"
            : completed > 0
              ? "partial"
              : "empty";

        const label = date.toLocaleDateString(
          "vi-VN",
          { weekday: "short" }
        );

        day.title =
          date.toLocaleDateString("vi-VN") +
          ": " + completed + "/3 nhiệm vụ";

        day.setAttribute(
          "aria-label",
          day.title
        );

        const square = document.createElement("span");
        square.className = "axmi-square";

        const text = document.createElement("small");
        text.textContent = label;

        day.append(square, text);
        fragment.appendChild(day);
      }

      week.replaceChildren(fragment);
    }

    // Existing Founder code saves checkbox
    // changes first. Then update our insights.
    document.addEventListener("change", event => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.matches(
          ".axv4-founder-profile " +
          "input[data-axv4-mission]"
        )
      ) {
        setTimeout(render, 0);
      }
    });

    // Sync across tabs of the same origin.
    window.addEventListener("storage", event => {
      if (
        event.key === null ||
        event.key.startsWith(PREFIX)
      ) {
        render();
      }
    });

    window.addEventListener("focus", render);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) render();
      }
    );

    // Also handles date changes while open.
    setInterval(() => {
      if (!document.hidden) render();
    }, 60000);

    render();

    console.info(
      "AXIOM Daily Discipline Insights ready."
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
