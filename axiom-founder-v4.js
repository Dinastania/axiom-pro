
/*
 AXIOM V4 — FOUNDER DAILY DISCIPLINE
 Stores only the 3 manually checked missions.
 Does not read or change trading journal data.
*/

(() => {
  "use strict";

  function initFounder() {
    const profile = document.querySelector(
      ".axv4-founder-profile"
    );

    if (!profile) return;

    const inputs = [
      ...profile.querySelectorAll(
        "input[data-axv4-mission]"
      )
    ];

    const count = document.getElementById(
      "axv4-mission-count"
    );

    const percent = document.getElementById(
      "axv4-mission-percent"
    );

    const fill = document.getElementById(
      "axv4-mission-progress-fill"
    );

    const bar = document.getElementById(
      "axv4-mission-progress"
    );

    const dateLabel = document.getElementById(
      "axv4-mission-date"
    );

    if (
      !inputs.length ||
      !count ||
      !percent ||
      !fill ||
      !bar ||
      !dateLabel
    ) return;

    function localDateKey() {
      const now = new Date();

      return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
    }

    function storageKey() {
      return "axiom_v4_founder_missions_" +
        localDateKey();
    }

    function load() {
      let saved = {};

      try {
        const value = JSON.parse(
          localStorage.getItem(storageKey()) || "{}"
        );

        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) saved = value;
      } catch {
        saved = {};
      }

      inputs.forEach(input => {
        input.checked =
          saved[input.dataset.axv4Mission] === true;
      });

      dateLabel.textContent =
        new Date().toLocaleDateString("vi-VN");

      render();
    }

    function render() {
      const completed = inputs.filter(
        input => input.checked
      ).length;

      const progress =
        Math.round(completed / inputs.length * 100);

      count.textContent =
        completed + " / " + inputs.length;

      percent.textContent = progress + "%";
      fill.style.width = progress + "%";

      bar.setAttribute(
        "aria-valuemax",
        String(inputs.length)
      );

      bar.setAttribute(
        "aria-valuenow",
        String(completed)
      );
    }

    function save() {
      const data = {};

      inputs.forEach(input => {
        data[input.dataset.axv4Mission] =
          input.checked;
      });

      try {
        localStorage.setItem(
          storageKey(),
          JSON.stringify(data)
        );
      } catch {
        console.warn(
          "AXIOM Founder: Could not save missions."
        );
      }

      render();
    }

    inputs.forEach(input => {
      input.addEventListener("change", () => {
        // Handle an open tab crossing into a new day.
        if (dateLabel.dataset.day !== localDateKey()) {
          load();
          dateLabel.dataset.day = localDateKey();
          return;
        }

        save();
      });
    });

    function refreshDay() {
      const today = localDateKey();

      if (dateLabel.dataset.day !== today) {
        dateLabel.dataset.day = today;
        load();
      }
    }

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) refreshDay();
      }
    );

    window.addEventListener(
      "focus",
      refreshDay
    );

    refreshDay();

    console.info(
      "AXIOM Founder Profile V4 ready."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initFounder,
      { once: true }
    );
  } else {
    initFounder();
  }
})();
