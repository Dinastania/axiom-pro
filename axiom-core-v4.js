
/*
 AXIOM CORE V4 — SYSTEM HUB
 Founder Edition

 No trading data is modified.
 No external API calls.
*/

(() => {
  "use strict";

  function init() {
    const button = document.getElementById(
      "axv4-core-button"
    );

    const panel = document.getElementById(
      "axv4-system-panel"
    );

    const closeButton = document.getElementById(
      "axv4-system-close"
    );

    const timeElement = document.getElementById(
      "axv4-system-time"
    );

    const networkElement = document.getElementById(
      "axv4-system-network"
    );

    // Leave existing page untouched if markup is absent.
    if (
      !button ||
      !panel ||
      !closeButton ||
      !timeElement ||
      !networkElement
    ) {
      return;
    }

    function updateTime() {
      timeElement.textContent = new Date()
        .toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
    }

    function updateNetwork() {
      const isOnline = navigator.onLine;

      networkElement.textContent =
        isOnline ? "ONLINE" : "OFFLINE";

      networkElement.style.color =
        isOnline ? "#70f8cb" : "#ff899d";
    }

    function openPanel() {
      panel.hidden = false;

      button.setAttribute(
        "aria-expanded",
        "true"
      );

      updateTime();
      updateNetwork();

      closeButton.focus();
    }

    function closePanel() {
      panel.hidden = true;

      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.focus();
    }

    button.addEventListener("click", () => {
      if (panel.hidden) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeButton.addEventListener(
      "click",
      closePanel
    );

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) {
        closePanel();
      }
    });

    window.addEventListener(
      "online",
      updateNetwork
    );

    window.addEventListener(
      "offline",
      updateNetwork
    );

    updateTime();
    updateNetwork();

    // Update the display clock every second.
    setInterval(updateTime, 1000);

    console.info(
      "AXIOM Core V4 System Hub ready."
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
