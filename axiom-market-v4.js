
/*
 AXIOM PRO ULTIMATE — MARKET PULSE V4.1
 DINATRAN FOUNDER EDITION

 3 independent public data sources:
 - Forex: ExchangeRate-API reference rates
 - Gold: Gold API public quote
 - Bitcoin: Binance Spot BTC/USDT

 No API keys.
 No trading data changes.
 No stale prices presented as live.
*/

(() => {
  "use strict";

  const REFRESH_MS = 90000;

  const ASSETS = [
    {
      key: "EURUSD",
      title: "EUR/USD",
      name: "Euro / US Dollar",
      icon: "€"
    },
    {
      key: "USDJPY",
      title: "USD/JPY",
      name: "US Dollar / Yen",
      icon: "¥"
    },
    {
      key: "GBPUSD",
      title: "GBP/USD",
      name: "Pound / US Dollar",
      icon: "£"
    },
    {
      key: "XAUUSD",
      title: "XAU/USD",
      name: "Gold · USD / oz",
      icon: "Au"
    },
    {
      key: "BTCUSDT",
      title: "Crypto/BTC",
      name: "BTC / USDT · Binance",
      icon: "₿"
    }
  ];

  function money(value, digits = 2) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function validPositive(value) {
    return Number.isFinite(value) && value > 0;
  }

  async function fetchJSON(url) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 12000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  async function getForex() {
    const data = await fetchJSON(
      "https://open.er-api.com/v6/latest/USD"
    );

    if (data.result !== "success" || !data.rates) {
      throw new Error("Invalid FX response");
    }

    const EUR = Number(data.rates.EUR);
    const JPY = Number(data.rates.JPY);
    const GBP = Number(data.rates.GBP);

    if (
      !validPositive(EUR) ||
      !validPositive(JPY) ||
      !validPositive(GBP)
    ) {
      throw new Error("Missing FX rates");
    }

    return {
      EURUSD: 1 / EUR,
      USDJPY: JPY,
      GBPUSD: 1 / GBP,
      sourceTime: data.time_last_update_utc || null
    };
  }

  async function getGold() {
    const data = await fetchJSON(
      "https://api.gold-api.com/price/XAU"
    );

    const price = Number(data.price);

    if (!validPositive(price)) {
      throw new Error("Invalid gold price");
    }

    return { price };
  }

  async function getBitcoin() {
    const data = await fetchJSON(
      "https://data-api.binance.vision/api/v3/ticker/24hr" +
      "?symbol=BTCUSDT"
    );

    const price = Number(data.lastPrice);
    const change = Number(data.priceChangePercent);

    if (
      !validPositive(price) ||
      !Number.isFinite(change)
    ) {
      throw new Error("Invalid BTC response");
    }

    return { price, change };
  }

  function init() {
    if (document.getElementById("axiom-market-pulse-ready")) {
      return;
    }

    const dashboard = document.querySelector(
      ".axv4-command"
    );

    if (!dashboard) return;

    let market = document.querySelector(".axv4-market");

    if (!market) {
      market = document.createElement("section");
      market.className = "axv4-market";

      dashboard.insertAdjacentElement(
        "afterend",
        market
      );
    }

    market.id = "axiom-market-pulse-ready";

    market.setAttribute(
      "aria-label",
      "AXIOM Global Market Watch"
    );

    market.innerHTML = `
      <div class="axv4-market-head">

        <div>
          <span class="axv4-market-eyebrow">
            ✦ AXIOM / GLOBAL MARKET WATCH
          </span>

          <h2 class="axv4-market-title">
            Market Pulse <span>/ Pro</span>
          </h2>
        </div>

        <span class="axv4-market-status"
              data-state="loading">
          ĐANG TẢI
        </span>

      </div>

      <div class="axv4-market-grid">
        ${ASSETS.map(asset => `
          <article class="axv4-market-card"
                   data-asset="${asset.key}">

            <div class="axv4-market-symbol">

              <span class="axv4-market-icon"
                    aria-hidden="true">
                ${asset.icon}
              </span>

              <div class="axv4-market-name">
                <strong>${asset.title}</strong>
                <small>${asset.name}</small>
              </div>

            </div>

            <strong class="axv4-market-price">
              —
            </strong>

            <span class="axv4-market-change">
              Chờ dữ liệu
            </span>

          </article>
        `).join("")}
      </div>

      <div class="axv4-market-foot">

        <p class="axv4-market-updated"
           role="status">
          Đang kết nối các nguồn dữ liệu...
        </p>

        <button type="button"
                class="axv4-market-refresh">
          ↻ Làm mới
        </button>

      </div>
    `;

    const status = market.querySelector(
      ".axv4-market-status"
    );

    const updated = market.querySelector(
      ".axv4-market-updated"
    );

    const refresh = market.querySelector(
      ".axv4-market-refresh"
    );

    function showPrice(key, price, digits, note, change) {
      const card = market.querySelector(
        `[data-asset="${key}"]`
      );

      if (!card) return;

      const priceElement = card.querySelector(
        ".axv4-market-price"
      );

      const changeElement = card.querySelector(
        ".axv4-market-change"
      );

      changeElement.className = "axv4-market-change";

      if (!validPositive(price)) {
        priceElement.textContent = "—";
        changeElement.textContent = "Không có dữ liệu";
        return;
      }

      const formatted = money(price, digits);

      if (key === "XAUUSD") {
        priceElement.textContent = "$" + formatted;
      } else if (key === "BTCUSDT") {
        priceElement.textContent = formatted + " USDT";
      } else {
        priceElement.textContent = formatted;
      }

      if (Number.isFinite(change)) {
        const sign = change > 0 ? "+" : "";

        changeElement.textContent =
          sign + change.toFixed(2) + "% / 24h";

        if (change > 0) {
          changeElement.classList.add("up");
        } else if (change < 0) {
          changeElement.classList.add("down");
        }
      } else {
        changeElement.textContent = note;
      }
    }

    let loading = false;

    async function refreshAll() {
      if (loading) return;

      loading = true;
      refresh.disabled = true;

      status.dataset.state = "loading";
      status.textContent = "ĐANG CẬP NHẬT";

      const sources = await Promise.allSettled([
        getForex(),
        getGold(),
        getBitcoin()
      ]);

      let sourceCount = 0;
      const info = [];

      // FOREX
      const fx = sources[0];

      if (fx.status === "fulfilled") {
        sourceCount++;

        showPrice(
          "EURUSD", fx.value.EURUSD, 5,
          "Tỷ giá tham chiếu"
        );

        showPrice(
          "USDJPY", fx.value.USDJPY, 3,
          "Tỷ giá tham chiếu"
        );

        showPrice(
          "GBPUSD", fx.value.GBPUSD, 5,
          "Tỷ giá tham chiếu"
        );

        const timestamp = Date.parse(
          fx.value.sourceTime || ""
        );

        const date = Number.isFinite(timestamp)
          ? new Date(timestamp).toLocaleDateString("vi-VN")
          : "không rõ ngày";

        info.push("FX tham chiếu: " + date);

      } else {
        ["EURUSD", "USDJPY", "GBPUSD"].forEach(key => {
          showPrice(key, null);
        });

        info.push("FX: không có dữ liệu");
        console.warn("AXIOM FX:", fx.reason);
      }

      // GOLD
      const gold = sources[1];

      if (gold.status === "fulfilled") {
        sourceCount++;

        showPrice(
          "XAUUSD",
          gold.value.price,
          2,
          "Gold · báo giá công khai"
        );

        info.push("Gold: đã nhận báo giá");

      } else {
        showPrice("XAUUSD", null);

        info.push("Gold: không có dữ liệu");
        console.warn("AXIOM Gold:", gold.reason);
      }

      // BITCOIN
      const btc = sources[2];

      if (btc.status === "fulfilled") {
        sourceCount++;

        showPrice(
          "BTCUSDT",
          btc.value.price,
          2,
          "",
          btc.value.change
        );

        info.push("BTC: Binance Spot");

      } else {
        showPrice("BTCUSDT", null);

        info.push("BTC: không có dữ liệu");
        console.warn("AXIOM BTC:", btc.reason);
      }

      // OVERALL STATUS
      if (sourceCount === 3) {
        status.dataset.state = "ok";
        status.textContent = "3/3 NGUỒN";

      } else if (sourceCount > 0) {
        status.dataset.state = "partial";
        status.textContent =
          sourceCount + "/3 NGUỒN";

      } else {
        status.dataset.state = "error";
        status.textContent = "KHÔNG CÓ DỮ LIỆU";
      }

      const time = new Date()
        .toLocaleTimeString("vi-VN");

      updated.textContent =
        info.join(" · ") +
        " · Truy xuất lúc " + time;

      loading = false;
      refresh.disabled = false;
    }

    refresh.addEventListener("click", refreshAll);

    setInterval(() => {
      if (!document.hidden) {
        refreshAll();
      }
    }, REFRESH_MS);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          refreshAll();
        }
      }
    );

    refreshAll();

    console.info(
      "AXIOM Market Pulse V4.1 initialized."
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
