(() => {
  const REFRESH_MS = 90000;
  const STORAGE_KEY = 'axiom_market_pulse_v5';

  const ASSETS = [
    {
      key: 'EURUSD',
      label: 'EUR/USD',
      name: 'Euro / US Dollar',
      type: 'fx',
      icon: '€',
      decimals: 4
    },
    {
      key: 'USDJPY',
      label: 'USD/JPY',
      name: 'US Dollar / Japanese Yen',
      type: 'fx',
      icon: '¥',
      decimals: 2
    },
    {
      key: 'GBPUSD',
      label: 'GBP/USD',
      name: 'British Pound / US Dollar',
      type: 'fx',
      icon: '£',
      decimals: 4
    },
    {
      key: 'XAUUSD',
      label: 'XAU/USD',
      name: 'Gold Spot',
      type: 'gold',
      icon: 'Au',
      decimals: 2
    },
    {
      key: 'BTCUSD',
      label: 'Crypto/BTC',
      name: 'Bitcoin',
      type: 'crypto',
      icon: '₿',
      decimals: 2
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);

  function formatNumber(value, decimals = 2) {
    if (value == null || Number.isNaN(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function getAsset(key) {
    return ASSETS.find(item => item.key === key);
  }

  function getMountTarget() {
    return (
      document.querySelector('.content') ||
      document.querySelector('main .content') ||
      document.querySelector('main.page') ||
      document.querySelector('main')
    );
  }


function ensureSection() {
  let section = document.getElementById(
    "axiom-market-pulse"
  );

  if (section) return section;

  const dashboard = document.querySelector(
    ".axv4-command"
  );

  if (!dashboard) {
    console.error(
      "AXIOM Market: Không tìm thấy Command Dashboard."
    );
    return null;
  }

  section = document.createElement("section");
  section.id = "axiom-market-pulse";
  section.className = "axv4-market";

  dashboard.insertAdjacentElement(
    "afterend",
    section
  );

  return section;
}


  function buildMarkup(section) {
    section.innerHTML = `
      <div class="axv4-market-head" style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        <div>
          <div class="axv4-kicker">✦ AXIOM / GLOBAL MARKET WATCH</div>
          <h2 class="axv4-market-title" style="margin:4px 0 0 0;">Market Pulse / Pro</h2>
        </div>
        <div id="marketPulseStatus" class="axv4-market-change neutral">Đang tải...</div>
      </div>

      <div class="axv4-market-grid">
        ${ASSETS.map(asset => `
          <article class="axv4-market-card" data-asset="${asset.key}">
            <div class="axv4-market-symbol" style="display:flex;align-items:center;">
              <div class="axv4-market-icon">${asset.icon}</div>
              <div style="display:flex;flex-direction:column;">
                <strong>${asset.label}</strong>
                <span>${asset.name}</span>
              </div>
            </div>

            <div class="axv4-market-price" id="marketPrice_${asset.key}">--</div>
            <div class="axv4-market-change neutral" id="marketChange_${asset.key}">LIVE</div>
          </article>
        `).join('')}
      </div>

      <div class="axv4-market-foot" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;border-top:1px solid rgba(68,242,181,.10);">
        <small id="marketPulseSource" class="muted">Nguồn dữ liệu đang kết nối...</small>
        <button id="marketPulseRefresh" type="button" class="secondary">↻ Làm mới giá</button>
      </div>
    `;
  }

  function setStatus(text, tone = 'neutral') {
    const el = document.getElementById('marketPulseStatus');
    if (!el) return;
    el.className = `axv4-market-change ${tone}`;
    el.textContent = text;
  }

  function setPrice(key, value, toneText, tone = 'neutral') {
    const asset = getAsset(key);
    const priceEl = document.getElementById(`marketPrice_${key}`);
    const chipEl = document.getElementById(`marketChange_${key}`);

    if (!priceEl || !chipEl || !asset) return;

    if (value == null || Number.isNaN(value)) {
      priceEl.textContent = 'N/A';
    } else {
      if (key === 'BTCUSD' || key === 'XAUUSD') {
        priceEl.textContent = '$' + formatNumber(value, asset.decimals);
      } else {
        priceEl.textContent = formatNumber(value, asset.decimals);
      }
    }

    chipEl.className = `axv4-market-change ${tone}`;
    chipEl.textContent = toneText;
  }

  function saveSnapshot(snapshot) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  function restoreSnapshot() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function applySnapshot(snapshot) {
    if (!snapshot) return;

    setPrice('EURUSD', snapshot.EURUSD, 'FOREX LIVE', 'neutral');
    setPrice('USDJPY', snapshot.USDJPY, 'FOREX LIVE', 'neutral');
    setPrice('GBPUSD', snapshot.GBPUSD, 'FOREX LIVE', 'neutral');
    setPrice('XAUUSD', snapshot.XAUUSD, snapshot.XAUUSD ? 'GOLD SPOT' : 'N/A', snapshot.XAUUSD ? 'neutral' : 'negative');
    setPrice('BTCUSD', snapshot.BTCUSD, snapshot.BTC_CHANGE_TEXT || 'CRYPTO LIVE', snapshot.BTC_TONE || 'neutral');

    const source = document.getElementById('marketPulseSource');
    if (source && snapshot.updatedAtText) {
      source.textContent = `FX: open.er-api • Gold: Gold feed • BTC: Binance • Cập nhật lúc ${snapshot.updatedAtText}`;
    }
  }

  async function fetchForex() {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!res.ok) throw new Error('Không lấy được dữ liệu forex');

    const data = await res.json();
    const rates = data.rates || {};

    return {
      EURUSD: rates.EUR ? 1 / rates.EUR : null,
      USDJPY: rates.JPY ?? null,
      GBPUSD: rates.GBP ? 1 / rates.GBP : null
    };
  }

  async function fetchGold() {
    const sources = [
      async () => {
        const res = await fetch('https://api.gold-api.com/price/XAU', { cache: 'no-store' });
        if (!res.ok) throw new Error('Gold source 1 failed');
        const data = await res.json();
        return Number(data.price);
      },
      async () => {
        const res = await fetch('https://api.metals.live/v1/spot/gold', { cache: 'no-store' });
        if (!res.ok) throw new Error('Gold source 2 failed');
        const data = await res.json();

        if (Array.isArray(data)) {
          if (typeof data[0] === 'number') return Number(data[0]);
          if (Array.isArray(data[0])) return Number(data[0][1]);
        }

        return null;
      }
    ];

    for (const source of sources) {
      try {
        const value = await source();
        if (value && !Number.isNaN(value)) return value;
      } catch (err) {}
    }

    return null;
  }

  async function fetchBTC() {
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', { cache: 'no-store' });
    if (!res.ok) throw new Error('Không lấy được BTC từ Binance');

    const data = await res.json();

    return {
      price: Number(data.lastPrice),
      change: Number(data.priceChangePercent)
    };
  }

  async function refreshMarketPulse() {
    setStatus('Đang cập nhật...', 'neutral');

    try {
      const [fx, gold, btc] = await Promise.all([
        fetchForex(),
        fetchGold(),
        fetchBTC()
      ]);

      const updatedAt = new Date();
      const timeText = updatedAt.toLocaleTimeString('vi-VN');

      setPrice('EURUSD', fx.EURUSD, 'FOREX LIVE', 'neutral');
      setPrice('USDJPY', fx.USDJPY, 'FOREX LIVE', 'neutral');
      setPrice('GBPUSD', fx.GBPUSD, 'FOREX LIVE', 'neutral');

      if (gold != null) {
        setPrice('XAUUSD', gold, 'GOLD SPOT', 'neutral');
      } else {
        setPrice('XAUUSD', null, 'N/A', 'negative');
      }

      const btcTone = btc.change > 0 ? 'positive' : btc.change < 0 ? 'negative' : 'neutral';
      const btcText =
        (btc.change > 0 ? '+' : '') +
        btc.change.toFixed(2) +
        '% / 24h';

      setPrice('BTCUSD', btc.price, btcText, btcTone);

      const source = document.getElementById('marketPulseSource');
      if (source) {
        source.textContent = `FX: open.er-api • Gold: Gold feed • BTC: Binance • Cập nhật lúc ${timeText}`;
      }

      saveSnapshot({
        EURUSD: fx.EURUSD,
        USDJPY: fx.USDJPY,
        GBPUSD: fx.GBPUSD,
        XAUUSD: gold,
        BTCUSD: btc.price,
        BTC_CHANGE_TEXT: btcText,
        BTC_TONE: btcTone,
        updatedAtText: timeText
      });

      setStatus('● Đã cập nhật', 'positive');
    } catch (err) {
      console.error(err);
      setStatus('⚠ Lỗi tải dữ liệu', 'negative');

      const source = document.getElementById('marketPulseSource');
      if (source) {
        source.textContent = 'Không tải được dữ liệu mới. Đang dùng snapshot gần nhất nếu có.';
      }

      const snapshot = restoreSnapshot();
      if (snapshot) applySnapshot(snapshot);
    }
  }

  function init() {
    const section = ensureSection();
    if (!section) return;

    buildMarkup(section);

    const snapshot = restoreSnapshot();
    if (snapshot) applySnapshot(snapshot);

    const refreshBtn = document.getElementById('marketPulseRefresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refreshMarketPulse);
    }

    refreshMarketPulse();
    setInterval(refreshMarketPulse, REFRESH_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
