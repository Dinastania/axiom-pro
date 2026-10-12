
/*
 AXIOM VISUAL 4.0 — MARKET PULSE
 Binance Spot public market data.

 - No API keys
 - No journal/localStorage modifications
 - Refresh interval: 90 seconds
 - Shows unavailable status if API fails
*/

(() => {
  "use strict";

  const API =
    "https://data-api.binance.vision/api/v3/ticker/24hr";

  const REFRESH_MS = 90000;

  const COINS = [
    {
      symbol: "BTCUSDT",
      code: "BTC",
      name: "Bitcoin",
      icon: "₿"
    },
    {
      symbol: "ETHUSDT",
      code: "ETH",
      name: "Ethereum",
      icon: "Ξ"
    },
    {
      symbol: "SOLUSDT",
      code: "SOL",
      name: "Solana",
      icon: "◎"
    }
  ];

  function init() {
    // Insert into the new dashboard only.
    const dashboard = document.querySelector(
      ".axv4-command"
    );

    if (!dashboard) return;

    if (document.querySelector(".axv4-market")) {
      return;
    }

    const market = document.createElement("section");

    market.className = "axv4-market";
    market.setAttribute(
      "aria-label",
      "AXIOM Market Pulse"
    );

    market.innerHTML = `
      <div class="axv4-market-head">
        <div>
          <span class="axv4-market-eyebrow">
            ✦ AXIOM / SPOT MARKET DATA
          </span>

          <h2 class="axv4-market-title">
            Market Pulse <span>/ Pro</span>
          </h2>
        </div>

        <span class="axv4-market-status"
              data-state="loading">
          ĐANG KẾT NỐI
        </span>
      </div>

      <div class="axv4-market-grid">
        ${COINS.map(coin => `
          <article class="axv4-market-card"
                   data-pair="${coin.symbol}">

            <div class="axv4-market-symbol">
              <span class="axv4-market-icon"
                    aria-hidden="true">
                ${coin.icon}
              </span>

              <div class="axv4-market-name">
                <strong>${coin.code}/USDT</strong>
                <small>${coin.name}</small>
              </div>
            </div>

            <strong class="axv4-market-price">
              —
            </strong>

            <span class="axv4-market-change">
              Đang tải...
            </span>
          </article>
        `).join("")}
      </div>

      <div class="axv4-market-foot">
        <p class="axv4-market-updated"
           role="status">
          Đang lấy dữ liệu từ Binance Spot...
        </p>

        <button type="button"
                class="axv4-market-refresh">
          ↻ Làm mới giá
        </button>
      </div>
    `;

    // Place immediately after Command Dashboard.
    dashboard.insertAdjacentElement(
      "afterend",
      market
    );

    const status = market.querySelector(
      ".axv4-market-status"
    );

    const updated = market.querySelector(
      ".axv4-market-updated"
    );

    const refresh = market.querySelector(
      ".axv4-market-refresh"
    );

    let loading = false;

    const formatPrice = value => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(value);
    };

    const formatChange = value => {
      const prefix = value > 0 ? "+" : "";

      return prefix + value.toFixed(2) + "% / 24h";
    };

    async function fetchCoin(coin) {
      const controller = new AbortController();

      const timeout = setTimeout(
        () => controller.abort(),
        10000
      );

      try {
        const url =
          API + "?symbol=" +
          encodeURIComponent(coin.symbol);

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(
            "HTTP " + response.status
          );
        }

        const data = await response.json();

        const price = Number(data.lastPrice);

        const change = Number(
          data.priceChangePercent
        );

        if (
          !Number.isFinite(price) ||
          price <= 0 ||
          !Number.isFinite(change)
        ) {
          throw new Error(
            "Invalid market response"
          );
        }

        return {
          symbol: coin.symbol,
          price,
          change
        };

      } finally {
        clearTimeout(timeout);
      }
    }

    function renderCoin(coin, result) {
      const card = market.querySelector(
        `[data-pair="${coin.symbol}"]`
      );

      if (!card) return;

      const price = card.querySelector(
        ".axv4-market-price"
      );

      const change = card.querySelector(
        ".axv4-market-change"
      );

      change.classList.remove("up", "down");

      if (!result) {
        price.textContent = "—";
        change.textContent = "Không có dữ liệu";
        return;
      }

      price.textContent =
        formatPrice(result.price);

      change.textContent =
        formatChange(result.change);

      if (result.change > 0) {
        change.classList.add("up");
      } else if (result.change < 0) {
        change.classList.add("down");
      }
    }

    async function loadPrices() {
      if (loading) return;

      loading = true;
      refresh.disabled = true;

      status.dataset.state = "loading";
      status.textContent = "ĐANG CẬP NHẬT";

      updated.textContent =
        "Đang kiểm tra dữ liệu thị trường...";

      try {
        const results = await Promise.allSettled(
          COINS.map(fetchCoin)
        );

        let success = 0;

        results.forEach((entry, index) => {
          const coin = COINS[index];

          if (entry.status === "fulfilled") {
            success++;
            renderCoin(coin, entry.value);
          } else {
            renderCoin(coin, null);
            console.warn(
              "AXIOM Market: " +
              coin.symbol +
              " unavailable"
            );
          }
        });

        if (success === COINS.length) {
          status.dataset.state = "ok";
          status.textContent = "ĐÃ CẬP NHẬT";

        } else if (success > 0) {
          status.dataset.state = "partial";
          status.textContent = "DỮ LIỆU MỘT PHẦN";

        } else {
          status.dataset.state = "error";
          status.textContent = "KHÔNG CÓ DỮ LIỆU";
        }

        if (success > 0) {
          const time = new Date()
            .toLocaleTimeString("vi-VN");

          updated.textContent =
            "Binance Spot · Cập nhật lúc " +
            time +
            " · Chu kỳ 90 giây";
        } else {
          updated.textContent =
            "Không lấy được giá. Kiểm tra kết nối " +
            "hoặc thử làm mới sau.";
        }

      } catch (error) {
        status.dataset.state = "error";
        status.textContent = "LỖI KẾT NỐI";

        updated.textContent =
          "Không thể cập nhật dữ liệu thị trường.";

        COINS.forEach(coin => {
          renderCoin(coin, null);
        });

        console.warn(
          "AXIOM Market Pulse:",
          error
        );

      } finally {
        loading = false;
        refresh.disabled = false;
      }
    }

    refresh.addEventListener(
      "click",
      loadPrices
    );

    // Refresh automatically while page is visible.
    setInterval(() => {
      if (!document.hidden) {
        loadPrices();
      }
    }, REFRESH_MS);

    // Refresh when returning to the page.
    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          loadPrices();
        }
      }
    );

    loadPrices();

    console.info(
      "AXIOM Market Pulse initialized."
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
