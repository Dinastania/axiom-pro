
(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #axiom-live {
      --live-accent: var(--axiom-accent, #44f2b5);
      --live-panel: var(--axiom-panel, #12232d);
      --live-border: var(--axiom-border, #31515b);

      background: linear-gradient(
        115deg,
        var(--live-panel),
        rgba(10, 20, 34, .96)
      );
      border: 1px solid var(--live-border);
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
      color: #eaf7f5;
    }

    #axiom-live * {
      box-sizing: border-box;
    }

    #axiom-live .live-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }

    #axiom-live .live-title {
      color: var(--live-accent);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 2px;
    }

    #axiom-live .live-badge {
      color: #a3c1c9;
      font-size: 10px;
      letter-spacing: 1px;
    }

    #axiom-live .live-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    #axiom-live .live-card {
      min-width: 0;
      border: 1px solid var(--live-border);
      background: rgba(6, 19, 30, .55);
      border-radius: 12px;
      padding: 17px;
    }

    #axiom-live .live-label {
      color: #91b0bd;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    #axiom-live .live-value {
      display: block;
      color: #eaf7f5;
      font-size: clamp(16px, 2vw, 24px);
      font-weight: 850;
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
    }

    #axiom-live #live-clock {
      color: var(--live-accent);
      font-size: clamp(24px, 3vw, 35px);
      letter-spacing: 1px;
    }

    #axiom-live .live-detail {
      display: block;
      color: #9dbbc5;
      font-size: 11px;
      margin-top: 8px;
      overflow-wrap: anywhere;
    }

    #axiom-live .live-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 13px;
    }

    #axiom-live button {
      width: auto;
      margin: 0;
      padding: 9px 13px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      background: var(--live-accent);
      border: 1px solid var(--live-accent);
      color: #091b1f;
    }

    #axiom-live button.live-secondary {
      background: transparent;
      color: #d4e5ec;
      border-color: var(--live-border);
    }

    #axiom-live button:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    #axiom-live .live-link {
      display: inline-block;
      color: var(--live-accent);
      font-size: 11px;
      margin-top: 9px;
      text-decoration: none;
    }

    #axiom-live .live-note {
      color: #8daeba;
      font-size: 11px;
      margin: 12px 0 0;
      line-height: 1.6;
    }

    @media (max-width: 800px) {
      #axiom-live .live-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'axiom-live';
  panel.setAttribute('aria-label', 'Live Time and Location');

  panel.innerHTML = `
    <div class="live-heading">
      <strong class="live-title">◷ AXIOM LIVE SYSTEM</strong>
      <span class="live-badge">● LOCAL TIME & LOCATION</span>
    </div>

    <div class="live-grid">
      <div class="live-card">
        <div class="live-label">CURRENT TIME</div>
        <strong id="live-clock" class="live-value">--:--:--</strong>
        <span class="live-detail">Real-time Clock</span>
      </div>

      <div class="live-card">
        <div class="live-label">DATE / MONTH / YEAR</div>
        <strong id="live-date" class="live-value">--/--/----</strong>
        <span id="live-weekday" class="live-detail">Loading...</span>
      </div>

      <div class="live-card">
        <div class="live-label">CURRENT LOCATION</div>
        <strong id="live-location" class="live-value">
          Chưa cấp quyền vị trí
        </strong>
        <span id="live-timezone" class="live-detail">
          Detecting timezone...
        </span>
        <a id="live-map"
           class="live-link"
           target="_blank"
           rel="noopener noreferrer"
           hidden>
          ↗ Xem vị trí trên OpenStreetMap
        </a>
      </div>
    </div>

    <div class="live-actions">
      <button type="button" id="live-start">
        📍 Bắt đầu theo dõi vị trí
      </button>

      <button type="button" id="live-stop"
              class="live-secondary" disabled>
        Dừng theo dõi
      </button>

      <button type="button" id="live-place"
              class="live-secondary" disabled>
        Tra tên khu vực
      </button>
    </div>

    <p id="live-status" class="live-note">
      AXIOM không tự lấy vị trí.
      Nhấn nút để yêu cầu quyền GPS.
    </p>

    <p class="live-note">
      Vị trí chỉ được theo dõi khi trang đang mở và em bật.
      Tra tên khu vực sẽ gửi tọa độ tới dịch vụ
      OpenStreetMap Nominatim sau khi em chủ động bấm nút đó.
    </p>
  `;

  const content = document.querySelector('main .content');
  const heading = content?.querySelector('.heading');

  if (heading) {
    heading.insertAdjacentElement('afterend', panel);
  } else if (content) {
    content.prepend(panel);
  } else {
    const main = document.querySelector('main');
    if (!main) return;
    main.prepend(panel);
  }

  const $ = id => panel.querySelector('#' + id);

  const clockFormatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const weekdayFormatter = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long'
  });

  function updateClock() {
    const now = new Date();

    $('live-clock').textContent = clockFormatter.format(now);
    $('live-date').textContent = dateFormatter.format(now);
    $('live-weekday').textContent = weekdayFormatter.format(now);

    const zone = Intl.DateTimeFormat()
      .resolvedOptions().timeZone || 'Không xác định';

    $('live-timezone').textContent = 'Timezone: ' + zone;
  }

  updateClock();
  setInterval(updateClock, 1000);

  let watchId = null;
  let coordinates = null;

  function setStatus(message) {
    $('live-status').textContent = message;
  }

  function stopTracking() {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }

    watchId = null;
    $('live-start').disabled = false;
    $('live-stop').disabled = true;

    setStatus('Đã dừng GPS. Vị trí cuối cùng vẫn hiển thị.');
  }

  function startTracking() {
    if (!navigator.geolocation) {
      setStatus('Trình duyệt không hỗ trợ Geolocation API.');
      return;
    }

    if (!window.isSecureContext) {
      setStatus(
        'Cần mở trang qua HTTPS để sử dụng GPS.'
      );
      return;
    }

    if (watchId !== null) return;

    
$('live-location').textContent = 'Đang xác định vị trí...';

setStatus(
  '📡 Đang kết nối dịch vụ định vị của thiết bị. ' +
  'Vui lòng chờ tối đa 30 giây...'
);


    try {
      watchId = navigator.geolocation.watchPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          coordinates = {latitude, longitude};

          $('live-location').textContent =
            latitude.toFixed(5) + ', ' +
            longitude.toFixed(5);

          $('live-map').href =
            'https://www.openstreetmap.org/' +
            '?mlat=' + encodeURIComponent(latitude) +
            '&mlon=' + encodeURIComponent(longitude) +
            '#map=16/' + latitude + '/' + longitude;

          $('live-map').hidden = false;
          $('live-place').disabled = false;

          setStatus(
            '✓ GPS đang hoạt động · Độ chính xác ước tính: ' +
            Math.round(accuracy) + ' mét.'
          );
        },
        
error => {
  const messages = {
    1: 'PERMISSION_DENIED: Trình duyệt hoặc Windows từ chối quyền vị trí.',
    2: 'POSITION_UNAVAILABLE: Thiết bị chưa xác định được vị trí.',
    3: 'TIMEOUT: Yêu cầu định vị mất quá nhiều thời gian.'
  };

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = null;

$('live-location').textContent =
  error.code === 1
    ? '⛔ Quyền truy cập vị trí bị từ chối'
    : error.code === 2
      ? '⚠ Không thể xác định vị trí'
      : error.code === 3
        ? '⌛ Hết thời gian chờ GPS'
        : '⚠ Lỗi định vị không xác định';

$('live-start').disabled = false;
$('live-stop').disabled = true;


  setStatus(
    '⚠ GPS ERROR ' + error.code + ': ' +
    (messages[error.code] || error.message)
  );
},

        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 60000
        }
      );

      $('live-start').disabled = true;
      $('live-stop').disabled = false;
    } catch (error) {
      setStatus('Không thể bật GPS: ' + error.message);
      watchId = null;
    }
  }

  async function lookupPlace() {
    if (!coordinates) return;

    const {latitude, longitude} = coordinates;

    $('live-place').disabled = true;
    setStatus('Đang tra tên khu vực từ OpenStreetMap...');

    try {
      const url = new URL(
        'https://nominatim.openstreetmap.org/reverse'
      );

      url.searchParams.set('format', 'jsonv2');
      url.searchParams.set('lat', String(latitude));
      url.searchParams.set('lon', String(longitude));
      url.searchParams.set('zoom', '12');
      url.searchParams.set('addressdetails', '1');

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Dịch vụ tra cứu không phản hồi.');
      }

      const data = await response.json();
      const address = data.address || {};

      const locality =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        address.state ||
        'Không xác định';

      const country = address.country || '';

      $('live-location').textContent =
        locality + (country ? ', ' + country : '');

      setStatus(
        '✓ Đã tìm tên khu vực gần vị trí GPS. ' +
        'Dữ liệu © OpenStreetMap contributors. ' +
        'Tên địa điểm có thể không chính xác tuyệt đối.'
      );
    } catch (error) {
      setStatus(
        'Không tra được tên khu vực: ' + error.message +
        '. Tọa độ GPS và liên kết bản đồ vẫn còn.'
      );
    } finally {
      $('live-place').disabled = false;
    }
  }

  $('live-start').addEventListener('click', startTracking);
  $('live-stop').addEventListener('click', stopTracking);
  $('live-place').addEventListener('click', lookupPlace);

  window.addEventListener('pagehide', () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
  });
})();
