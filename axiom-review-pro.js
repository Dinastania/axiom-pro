
/*
 AXIOM PRO ULTIMATE — WEEKLY & MONTHLY REVIEW
 DINATRAN FOUNDER EDITION

 Read-only analytics from axiom_trades_v1.
 Never modifies trades or other Journal data.
*/

(() => {
  "use strict";

  const STORAGE_KEY = "axiom_trades_v1";

  function init() {
    const calendar = document.getElementById(
      "calendar-panel"
    );

    if (!calendar ||
        document.getElementById("axiom-reviews")) {
      return;
    }

    // Insert above the existing PNL Calendar row.
    const anchor = calendar.parentElement;

    const section = document.createElement("section");
    section.id = "axiom-reviews";

    section.setAttribute(
      "aria-label",
      "Weekly and Monthly Trading Review"
    );

    section.innerHTML = `
      <div class="axr-head">
        <div>
          <span class="axr-kicker">
            ✦ AXIOM / PERFORMANCE INTELLIGENCE
          </span>
          <h2>Trading Review <em>/ Pro</em></h2>
        </div>

        <div class="axr-tabs"
             aria-label="Loại báo cáo">
          <button type="button"
                  data-mode="week"
                  aria-pressed="true">
            Weekly
          </button>
          <button type="button"
                  data-mode="month"
                  aria-pressed="false">
            Monthly
          </button>
        </div>
      </div>

      <div class="axr-toolbar">
        <button type="button"
                data-action="prev"
                aria-label="Kỳ trước">‹</button>

        <strong id="axr-period">—</strong>

        <button type="button"
                data-action="next"
                aria-label="Kỳ sau">›</button>

        <button type="button"
                data-action="today">
          Hiện tại
        </button>
      </div>

      <div class="axr-metrics">
        <div class="axr-metric">
          <span>NET REALIZED PNL</span>
          <strong id="axr-net">—</strong>
        </div>

        <div class="axr-metric">
          <span>WIN RATE</span>
          <strong id="axr-winrate">—</strong>
        </div>

        <div class="axr-metric">
          <span>TOTAL TRADES</span>
          <strong id="axr-count">—</strong>
        </div>

        <div class="axr-metric">
          <span>PROFIT FACTOR</span>
          <strong id="axr-pf">—</strong>
        </div>
      </div>

      <div class="axr-insights">
        <div>
          <span>BEST DAY</span>
          <strong id="axr-best">—</strong>
        </div>

        <div>
          <span>WORST DAY</span>
          <strong id="axr-worst">—</strong>
        </div>

        <div>
          <span>TOP STRATEGY · NET PNL</span>
          <strong id="axr-strategy">—</strong>
        </div>
      </div>

      <p id="axr-note" class="axr-note"
         role="status">
        Chỉ đọc giao dịch thật trong Journal.
      </p>
    `;

    anchor.insertAdjacentElement(
      "beforebegin",
      section
    );

    const $ = id => document.getElementById(id);

    const money = value =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);

    const pad = n => String(n).padStart(2, "0");

    function dateKey(date) {
      return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
      ].join("-");
    }

    function prettyDate(date) {
      return date.toLocaleDateString("vi-VN");
    }

    let mode = "week";
    let offset = 0;

    function periodRange() {
      const now = new Date();
      now.setHours(12, 0, 0, 0);

      if (mode === "week") {
        const mondayOffset =
          (now.getDay() + 6) % 7;

        const start = new Date(now);
        start.setDate(
          start.getDate() - mondayOffset + offset * 7
        );

        const end = new Date(start);
        end.setDate(end.getDate() + 6);

        return { start, end };
      }

      const start = new Date(
        now.getFullYear(),
        now.getMonth() + offset,
        1,
        12
      );

      const end = new Date(
        start.getFullYear(),
        start.getMonth() + 1,
        0,
        12
      );

      return { start, end };
    }

    function readTrades() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw === null) {
          return { trades: [], error: null };
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
          throw new Error("Journal format is not an array");
        }

        const trades = parsed
          .filter(item =>
            item &&
            typeof item.date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
            item.pnl !== null &&
            item.pnl !== "" &&
            Number.isFinite(Number(item.pnl))
          )
          .map(item => ({
            date: item.date,
            pnl: Number(item.pnl),
            strategy:
              String(item.strategy || item.setup || "")
                .trim()
          }));

        return { trades, error: null };

      } catch (error) {
        console.warn("AXIOM Review:", error);

        return {
          trades: [],
          error: "Không đọc được dữ liệu Journal."
        };
      }
    }

    function summarize(trades) {
      const wins = trades.filter(t => t.pnl > 0);
      const losses = trades.filter(t => t.pnl < 0);

      const grossWin = wins.reduce(
        (sum, t) => sum + t.pnl, 0
      );

      const grossLoss = -losses.reduce(
        (sum, t) => sum + t.pnl, 0
      );

      const net = grossWin - grossLoss;

      const winRate = trades.length
        ? wins.length / trades.length * 100
        : 0;

      const pf = grossLoss > 0
        ? (grossWin / grossLoss).toFixed(2)
        : grossWin > 0 ? "∞" : "—";

      // Aggregate daily realized PNL.
      const days = new Map();

      // Aggregate strategy realized PNL.
      const strategies = new Map();

      trades.forEach(trade => {
        days.set(
          trade.date,
          (days.get(trade.date) || 0) + trade.pnl
        );

        if (trade.strategy) {
          strategies.set(
            trade.strategy,
            (strategies.get(trade.strategy) || 0) +
              trade.pnl
          );
        }
      });

      const sortedDays = [...days.entries()].sort(
        (a, b) => a[1] - b[1]
      );

      const sortedStrategies =
        [...strategies.entries()].sort(
          (a, b) => b[1] - a[1]
        );

      return {
        net,
        winRate,
        count: trades.length,
        pf,
        best: sortedDays.at(-1) || null,
        worst: sortedDays[0] || null,
        strategy: sortedStrategies[0] || null
      };
    }

    function setValue(id, text, tone = "") {
      const element = $(id);
      element.textContent = text;
      element.dataset.tone = tone;
    }

    function render() {
      const { start, end } = periodRange();

      const from = dateKey(start);
      const to = dateKey(end);

      $("axr-period").textContent =
        mode === "week"
          ? prettyDate(start) + " — " + prettyDate(end)
          : "Tháng " +
            pad(start.getMonth() + 1) +
            "/" + start.getFullYear();

      const result = readTrades();

      if (result.error) {
        [
          "axr-net", "axr-winrate",
          "axr-count", "axr-pf",
          "axr-best", "axr-worst",
          "axr-strategy"
        ].forEach(id => setValue(id, "—"));

        $("axr-note").textContent = result.error;
        return;
      }

      const selected = result.trades.filter(
        t => t.date >= from && t.date <= to
      );

      const data = summarize(selected);

      setValue(
        "axr-net",
        money(data.net),
        data.net > 0 ? "positive" :
        data.net < 0 ? "negative" : ""
      );

      setValue(
        "axr-winrate",
        data.winRate.toFixed(1) + "%"
      );

      setValue("axr-count", String(data.count));
      setValue("axr-pf", data.pf);

      setValue(
        "axr-best",
        data.best
          ? data.best[0] + " · " +
            money(data.best[1])
          : "—"
      );

      setValue(
        "axr-worst",
        data.worst
          ? data.worst[0] + " · " +
            money(data.worst[1])
          : "—"
      );

      setValue(
        "axr-strategy",
        data.strategy
          ? data.strategy[0] + " · " +
            money(data.strategy[1])
          : "—"
      );

      const demoBanner = $("demoBanner");
      const demoActive =
        demoBanner && !demoBanner.hidden;

      $("axr-note").textContent = !selected.length
        ? "Chưa có giao dịch thật trong kỳ này."
        : demoActive
          ? "Báo cáo này luôn dùng Journal thật; " +
            "Dashboard phía trên đang ở chế độ demo."
          : "Dữ liệu Journal thật · Ngày đóng lệnh · " +
            "Không ghi thay đổi vào bộ nhớ.";

      section.querySelectorAll(
        ".axr-tabs button"
      ).forEach(button => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.mode === mode)
        );
      });
    }

    // Period tabs and navigation.
    section.addEventListener("click", event => {
      const button = event.target.closest("button");

      if (!button) return;

      if (button.dataset.mode) {
        mode = button.dataset.mode;
        offset = 0;
      } else if (button.dataset.action === "prev") {
        offset--;
      } else if (button.dataset.action === "next") {
        offset++;
      } else if (button.dataset.action === "today") {
        offset = 0;
      } else {
        return;
      }

      render();
    });

    // Journal render updates #tradeCount after saving,
    // deleting, or importing trades.
    const tradeCount = $("tradeCount");

    if (tradeCount) {
      const observer = new MutationObserver(render);

      observer.observe(tradeCount, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }

    // Refresh when returning to the tab.
    window.addEventListener("focus", render);

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY ||
          event.key === null) {
        render();
      }
    });

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) render();
      }
    );

    render();

    console.info("AXIOM Weekly / Monthly Review ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded", init, { once: true }
    );
  } else {
    init();
  }
})();
