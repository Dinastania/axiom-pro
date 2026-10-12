
/*
 AXIOM V4 — SMART NOTIFICATION CENTER

 Reads existing Founder mission checkboxes.
 Does NOT change Journal, PNL or Vault.
*/

(() => {
  "use strict";

  const BACKUP_KEY =
    "axiom_v4_backup_remind_after";

  const SEVEN_DAYS =
    7 * 24 * 60 * 60 * 1000;

  function init() {
    const nav =
      document.querySelector("nav.container-fluid") ||
      document.querySelector("body > nav") ||
      document.querySelector("nav");

    if (!nav || document.getElementById("axn-bell")) {
      return;
    }

    // Find the navigation action list.
    const lists = nav.querySelectorAll(":scope > ul");
    const actionList = lists[lists.length - 1];

    const item = document.createElement("li");
    item.className = "axn-nav-item";

    const bell = document.createElement("button");
    bell.type = "button";
    bell.id = "axn-bell";
    bell.className = "axn-trigger";

    bell.setAttribute(
      "aria-label",
      "Mở thông báo AXIOM"
    );

    bell.setAttribute(
      "aria-expanded",
      "false"
    );

    bell.setAttribute(
      "aria-controls",
      "axn-panel"
    );

    bell.innerHTML = `
      <svg width="19" height="19"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="1.8"
           stroke-linecap="round"
           stroke-linejoin="round"
           aria-hidden="true">
        <path d="M18 8a6 6 0 0 0-12 0
                 c0 7-3 7-3 9h18
                 c0-2-3-2-3-9"/>
        <path d="M10 21h4"/>
      </svg>
      <span class="axn-count" hidden>0</span>
    `;

    item.appendChild(bell);

    if (actionList && lists.length >= 2) {
      // Place before the existing New Trade button.
      actionList.insertBefore(
        item,
        actionList.lastElementChild
      );
    } else {
      nav.appendChild(item);
    }

    // Create a compact floating panel.
    const panel = document.createElement("section");
    panel.id = "axn-panel";
    panel.className = "axn-panel";
    panel.hidden = true;

    panel.setAttribute(
      "role",
      "region"
    );

    panel.setAttribute(
      "aria-label",
      "Trung tâm thông báo AXIOM"
    );

    panel.innerHTML = `
      <div class="axn-head">
        <div>
          <div class="axn-kicker">
            ✦ DINATRAN FOUNDER EDITION
          </div>

          <h2 class="axn-title">
            Notification Center
          </h2>
        </div>

        <button type="button"
                class="axn-close"
                aria-label="Đóng thông báo">
          ✕
        </button>
      </div>

      <div class="axn-list"></div>

      <p class="axn-footer">
        AXIOM nhắc dựa trên trạng thái cục bộ
        của trình duyệt. Không gửi dữ liệu
        Journal lên máy chủ.
      </p>
    `;

    document.body.appendChild(panel);

    const countBadge =
      bell.querySelector(".axn-count");

    const list =
      panel.querySelector(".axn-list");

    const closeButton =
      panel.querySelector(".axn-close");

    function readBackupReminder() {
      try {
        return Number(
          localStorage.getItem(BACKUP_KEY) || 0
        );
      } catch {
        return 0;
      }
    }

    function snoozeBackup() {
      try {
        localStorage.setItem(
          BACKUP_KEY,
          String(Date.now() + SEVEN_DAYS)
        );
      } catch {
        console.warn(
          "AXIOM: Không lưu được nhắc sao lưu."
        );
      }

      render();
    }

    function makeNotice(
      title,
      message,
      tone = "neutral",
      actionLabel = "",
      action = null
    ) {
      const card = document.createElement("article");
      card.className = "axn-item";
      card.dataset.tone = tone;

      const heading = document.createElement("h3");
      heading.className = "axn-item-title";
      heading.textContent = title;

      const description = document.createElement("p");
      description.className = "axn-item-message";
      description.textContent = message;

      card.append(heading, description);

      if (actionLabel && action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "axn-item-action";
        button.textContent = actionLabel;

        button.addEventListener("click", action);
        card.appendChild(button);
      }

      return card;
    }

    function closePanel(returnFocus = false) {
      panel.hidden = true;

      bell.setAttribute(
        "aria-expanded",
        "false"
      );

      if (returnFocus) {
        bell.focus();
      }
    }

    function render() {
      list.replaceChildren();

      let pending = 0;

      // 1. Founder mission reminder.
      const missions = [
        ...document.querySelectorAll(
          ".axv4-founder-profile " +
          "input[data-axv4-mission]"
        )
      ];

      if (missions.length) {
        const finished = missions.filter(
          input => input.checked
        ).length;

        if (finished < missions.length) {
          pending++;

          list.appendChild(makeNotice(
            "✦ Daily Discipline",
            "Đã hoàn thành " + finished +
            "/" + missions.length +
            " nhiệm vụ. Tiếp tục xây dựng kỷ luật!",
            "neutral",
            "Xem nhiệm vụ",
            () => {
              closePanel();

              document.querySelector(
                ".axv4-founder-profile"
              )?.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
            }
          ));
        } else {
          list.appendChild(makeNotice(
            "✓ Daily Discipline",
            "Em đã tích đủ các nhiệm vụ hôm nay.",
            "success"
          ));
        }
      }

      // 2. Manual backup reminder.
      if (Date.now() >= readBackupReminder()) {
        pending++;

        list.appendChild(makeNotice(
          "◈ Backup Reminder",
          "Hãy xuất bản sao lưu Journal và " +
          "Private Vault định kỳ. AXIOM không " +
          "tự xác minh lần sao lưu gần nhất.",
          "warning",
          "Nhắc lại sau 7 ngày",
          snoozeBackup
        ));
      }

      // 3. Browser network indicator.
      if (!navigator.onLine) {
        pending++;

        list.appendChild(makeNotice(
          "◉ Trình duyệt đang Offline",
          "Một số tính năng tải dữ liệu thị " +
          "trường có thể không hoạt động.",
          "warning"
        ));
      } else {
        list.appendChild(makeNotice(
          "◉ Browser Network",
          "Trình duyệt báo Online. Trạng thái " +
          "này không xác nhận các API giá " +
          "thị trường đang hoạt động.",
          "success"
        ));
      }

      countBadge.hidden = pending === 0;
      countBadge.textContent = String(pending);

      bell.setAttribute(
        "aria-label",
        "Thông báo AXIOM: " +
        pending + " lời nhắc"
      );
    }

    bell.addEventListener("click", () => {
      if (panel.hidden) {
        render();
        panel.hidden = false;

        bell.setAttribute(
          "aria-expanded",
          "true"
        );
      } else {
        closePanel();
      }
    });

    closeButton.addEventListener("click", () => {
      closePanel(true);
    });

    document.addEventListener("click", event => {
      if (
        !panel.hidden &&
        !panel.contains(event.target) &&
        !bell.contains(event.target)
      ) {
        closePanel();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) {
        closePanel(true);
      }
    });

    document.addEventListener("change", event => {
      if (
        event.target.matches(
          "input[data-axv4-mission]"
        )
      ) {
        render();
      }
    });

    window.addEventListener("online", render);
    window.addEventListener("offline", render);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) render();
      }
    );

    render();

    console.info(
      "AXIOM Notification Center initialized."
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
