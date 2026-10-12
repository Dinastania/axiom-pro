
(() => {
  "use strict";

  const API =
    "https://data-api.binance.vision/api/v3/exchangeInfo";

  let symbols = [];
  let currentSelect = null;

  function initialize() {
    const paper = document.getElementById("paperSymbol");
    const replay = document.getElementById("replaySymbol");

    if (!paper && !replay) {
      console.warn("AXIOM: Symbol selectors not found.");
      return;
    }

    const style = document.createElement("style");

    style.textContent = `
      .axiom-symbol-trigger {
        display: block;
        width: 100%;
        margin-top: 9px;
        padding: 10px 12px;
        background: #163b3b;
        border: 1px solid #397a72;
        border-radius: 9px;
        color: #75f8cf;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      #axiom-symbol-dialog {
        width: min(760px, calc(100vw - 24px));
        max-height: 85vh;
        padding: 0;
        border: 1px solid #3a736c;
        border-radius: 18px;
        background: #0c1929;
        color: #eefaff;
        box-shadow: 0 25px 90px #000b;
        overflow: hidden;
      }

      #axiom-symbol-dialog::backdrop {
        background: #020710cc;
        backdrop-filter: blur(6px);
      }

      .axiom-symbol-head {
        padding: 22px;
        border-bottom: 1px solid #294a58;
      }

      .axiom-symbol-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .axiom-symbol-top h3 {
        margin: 0;
        font-size: 23px;
      }

      .axiom-symbol-top button {
        width: auto;
        padding: 7px 13px;
        background: #22394b;
        color: white;
        border: 1px solid #446071;
      }

      #axiom-symbol-search {
        width: 100%;
        margin: 18px 0 10px;
        padding: 14px;
        background: #071521;
        color: white;
        border: 1px solid #426579;
        border-radius: 10px;
        font-size: 15px;
      }

      #axiom-quote-filter {
        width: 100%;
        margin: 0;
        background: #071521;
        color: #a9ead8;
        border: 1px solid #385969;
        border-radius: 9px;
        padding: 10px;
      }

      #axiom-symbol-count {
        color: #9ebdca;
        font-size: 12px;
        margin: 10px 0 0;
      }

      #axiom-symbol-results {
        max-height: 48vh;
        overflow-y: auto;
        padding: 8px 12px 15px;
      }

      .axiom-symbol-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 13px 15px;
        background: transparent;
        border: 0;
        border-bottom: 1px solid #213c49;
        border-radius: 7px;
        color: #f0f9ff;
        text-align: left;
        cursor: pointer;
      }

      .axiom-symbol-option:hover,
      .axiom-symbol-option:focus-visible {
        background: #17473d;
      }

      .axiom-symbol-option strong {
        color: #69f2c7;
        font-size: 14px;
      }

      .axiom-symbol-option small {
        display: block;
        color: #a1bac8;
        font-size: 11px;
        margin-top: 3px;
      }

      .axiom-symbol-source {
        font-size: 10px;
        color: #91b8c2;
        white-space: nowrap;
      }

      .axiom-symbol-note {
        padding: 11px 20px;
        font-size: 11px;
        color: #9dbac5;
        background: #102636;
      }
    `;

    document.head.appendChild(style);

    const dialog = document.createElement("dialog");
    dialog.id = "axiom-symbol-dialog";

    dialog.innerHTML = `
      <div class="axiom-symbol-head">
        <div class="axiom-symbol-top">
          <div>
            <small style="color:#55edbd">
              AXIOM UNIVERSAL SEARCH
            </small>
            <h3>Symbol Search</h3>
          </div>
          <button type="button" id="axiom-symbol-close">
            ✕ Close
          </button>
        </div>

        <input
          id="axiom-symbol-search"
          type="search"
          placeholder="Search BTC, ETH, XRP, SOL..."
          autocomplete="off"
          aria-label="Search trading symbols"
        >

        <select id="axiom-quote-filter"
                aria-label="Filter quote currency">
          <option value="USDT">USDT pairs</option>
          <option value="USDC">USDC pairs</option>
          <option value="FDUSD">FDUSD pairs</option>
          <option value="BTC">BTC pairs</option>
          <option value="ETH">ETH pairs</option>
          <option value="ALL">All Spot pairs</option>
        </select>

        <p id="axiom-symbol-count">Loading symbols...</p>
      </div>

      <div id="axiom-symbol-results"></div>

      <div class="axiom-symbol-note">
        Data source: Binance Spot exchangeInfo.
        Only active Spot pairs are supported.
      </div>
    `;

    document.body.appendChild(dialog);

    const search = dialog.querySelector(
      "#axiom-symbol-search"
    );

    const filter = dialog.querySelector(
      "#axiom-quote-filter"
    );

    const results = dialog.querySelector(
      "#axiom-symbol-results"
    );

    const count = dialog.querySelector(
      "#axiom-symbol-count"
    );

    dialog.querySelector(
      "#axiom-symbol-close"
    ).addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
      if (event.target === dialog) dialog.close();
    });

    const favorites = [
      "BTC", "ETH", "SOL", "XRP",
      "BNB", "DOGE", "ADA", "LINK"
    ];

    function normalize(text) {
      return String(text || "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
    }

    function renderResults() {
      results.replaceChildren();

      const query = normalize(search.value);
      const quote = filter.value;

      const matches = symbols.filter(item => {
        const validQuote =
          quote === "ALL" || item.quoteAsset === quote;

        const searchable = normalize(
          item.symbol + item.baseAsset + item.quoteAsset
        );

        return validQuote && searchable.includes(query);
      });

      matches.sort((a, b) => {
        function rank(item) {
          if (item.symbol === query) return -100;
          if (item.baseAsset === query) return -90;

          const favorite = favorites.indexOf(
            item.baseAsset
          );

          if (favorite >= 0) return favorite;

          return 100;
        }

        return rank(a) - rank(b) ||
          a.symbol.localeCompare(b.symbol);
      });

      count.textContent =
        `${matches.length} matching Spot pairs · ` +
        `showing first ${Math.min(100, matches.length)}`;

      for (const item of matches.slice(0, 100)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "axiom-symbol-option";

        const left = document.createElement("span");
        const symbol = document.createElement("strong");
        const subtitle = document.createElement("small");
        const source = document.createElement("span");

        symbol.textContent =
          `${item.baseAsset} / ${item.quoteAsset}`;

        subtitle.textContent = item.symbol;

        source.className = "axiom-symbol-source";
        source.textContent = "BINANCE · SPOT";

        left.append(symbol, subtitle);
        button.append(left, source);

        button.addEventListener("click", () => {
          if (!currentSelect) return;

          currentSelect.value = item.symbol;

          currentSelect.dispatchEvent(
            new Event("change", { bubbles: true })
          );

          dialog.close();

          if (currentSelect.value !== item.symbol) {
            alert(
              "Không đổi được symbol. Nếu đang mở " +
              "lệnh ảo, hãy đóng lệnh trước."
            );
          }
        });

        results.appendChild(button);
      }

      if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.textContent =
          "Không tìm thấy cặp Spot phù hợp.";
        empty.style.padding = "20px";
        results.appendChild(empty);
      }
    }

    function addTrigger(select, title) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "axiom-symbol-trigger";
      button.textContent = "⌕ Search All Symbols";

      select.insertAdjacentElement("afterend", button);

      button.addEventListener("click", () => {
        if (!symbols.length) {
          alert(
            "Danh sách symbol chưa tải được. " +
            "Kiểm tra kết nối Binance Spot API."
          );
          return;
        }

        currentSelect = select;
        search.value = "";
        filter.value = "USDT";

        renderResults();
        dialog.showModal();
        search.focus();
      });
    }

    if (paper) addTrigger(paper, "Paper Trading");
    if (replay) addTrigger(replay, "Chart Replay");

    search.addEventListener("input", renderResults);
    filter.addEventListener("change", renderResults);

    async function loadAllSymbols() {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        15000
      );

      try {
        const response = await fetch(API, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data.symbols)) {
          throw new Error("Invalid exchangeInfo response");
        }

        symbols = data.symbols.filter(item =>
          item.status === "TRADING" &&
          item.isSpotTradingAllowed !== false &&
          item.symbol &&
          item.baseAsset &&
          item.quoteAsset
        );

        for (const select of [paper, replay]) {
          if (!select) continue;

          const previous = select.value;
          const fragment =
            document.createDocumentFragment();

          for (const item of symbols) {
            const option = document.createElement("option");

            option.value = item.symbol;
            option.textContent =
              `${item.baseAsset} / ${item.quoteAsset}`;

            fragment.appendChild(option);
          }

          select.replaceChildren(fragment);

          if (symbols.some(x => x.symbol === previous)) {
            select.value = previous;
          } else if (
            symbols.some(x => x.symbol === "BTCUSDT")
          ) {
            select.value = "BTCUSDT";
          }
        }

        count.textContent =
          `Loaded ${symbols.length} active Spot pairs`;

        renderResults();

      } catch (error) {
        console.error(
          "AXIOM Symbol Search:",
          error
        );

        count.textContent =
          "Không tải được danh sách: " + error.message;

        // Giữ nguyên 4 symbol ban đầu nếu API lỗi.
      } finally {
        clearTimeout(timeout);
      }
    }

    loadAllSymbols();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
