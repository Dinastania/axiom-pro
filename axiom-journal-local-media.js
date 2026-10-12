
/*
 * AXIOM PERSONAL JOURNAL — LOCAL MEDIA / PRO
 * DINATRAN FOUNDER EDITION
 *
 * File blobs: IndexedDB.
 * Note metadata: existing localStorage journal.
 * Portable backups: ZIP + JSON manifest.
 * No changes to Trading Journal or PNL.
 */
(() => {
  "use strict";

  const bridge = window.AXJBridge;
  if (!bridge) {
    console.error("AXIOM Local Media: Journal bridge missing.");
    return;
  }

  const DB_NAME = "axiom_personal_journal_media_v1";
  const STORE = "files";
  const APP = "AXIOM_PERSONAL_JOURNAL";
  const MAX_FILE = 150 * 1024 * 1024;
  const MAX_BACKUP = 350 * 1024 * 1024;
  const MAX_FILES_PER_NOTE = 100;

  const $ = id => document.getElementById(id);
  const previewUrls = new Set();

  function tell(message, error = false) {
    bridge.status(message, error);
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("Trình duyệt không hỗ trợ IndexedDB."));
        return;
      }

      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () =>
        reject(new Error("Hãy đóng tab AXIOM khác rồi thử lại."));
    });
  }

  let dbPromise = null;

  function database() {
    if (!dbPromise) {
      dbPromise = openDB().catch(error => {
        dbPromise = null;
        throw error;
      });
    }
    return dbPromise;
  }

  async function getRecord(id) {
    const db = await database();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function putRecords(records) {
    if (!records.length) return;

    const db = await database();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);

      records.forEach(record => store.put(record));

      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error || new Error("Lỗi ghi IndexedDB."));
      tx.onabort = () =>
        reject(tx.error || new Error("IndexedDB bị hủy ghi."));
    });
  }

  async function removeRecord(id) {
    const db = await database();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  function releasePreviews() {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    previewUrls.clear();
  }

  async function loadPreview(media, element) {
    try {
      const record = await getRecord(media.id);

      if (!element.isConnected) return;

      if (!record || !(record.blob instanceof Blob)) {
        element.replaceWith(
          document.createTextNode(
            "⚠ Không tìm thấy tệp trên thiết bị này."
          )
        );
        return;
      }

      const url = URL.createObjectURL(record.blob);
      previewUrls.add(url);

      element.src = url;
    } catch (error) {
      console.error("AXIOM Media Preview:", error);

      if (element.isConnected) {
        element.replaceWith(
          document.createTextNode("Không thể mở tệp media.")
        );
      }
    }
  }

  function supportedType(file) {
    const type = (file.type || "").toLowerCase();
    const name = file.name.toLowerCase();

    const image = type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|avif|heic)$/i.test(name);

    const video = type.startsWith("video/") ||
      /\.(mp4|webm|mov|m4v|ogg)$/i.test(name);

    return video ? "video" : image ? "image" : null;
  }

  let uploading = false;

  async function addFiles(fileList) {
    if (uploading) return;

    const files = [...fileList];
    const current = bridge.getCurrent();

    if (!current || !files.length) return;
    if (!bridge.save()) return;

    uploading = true;
    let added = 0;
    let failed = 0;

    try {
      for (const file of files) {
        if (bridge.getCurrent() !== current) {
          tell("Đã đổi ghi chú. Dừng thêm media.", true);
          break;
        }

        if (current.media.length >= MAX_FILES_PER_NOTE) {
          tell("Tối đa 100 media trong một ghi chú.", true);
          break;
        }

        const type = supportedType(file);

        if (!type || file.size > MAX_FILE) {
          failed++;
          continue;
        }

        const id = bridge.uid();

        try {
          await putRecords([{
            id,
            blob: file,
            name: file.name,
            mime: file.type ||
              (type === "video" ? "video/mp4" : "image/jpeg"),
            size: file.size
          }]);

          if (bridge.getCurrent() !== current) {
            await removeRecord(id);
            break;
          }

          current.media.push({
            id,
            url: "",
            local: true,
            name: file.name,
            type
          });

          bridge.scheduleSave();

          if (!bridge.save()) {
            current.media = current.media.filter(
              item => item.id !== id
            );
            await removeRecord(id);
            failed++;
            break;
          }

          bridge.renderMedia();
          added++;
        } catch (error) {
          failed++;
          console.error("AXIOM Media Upload:", error);
        }
      }

      tell(
        "Đã lưu " + added + " tệp từ máy" +
        (failed ? " · " + failed + " tệp lỗi/bị bỏ qua." : "."),
        failed > 0
      );

    } finally {
      uploading = false;
    }
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  let transferring = false;

  async function exportZip() {
    if (transferring || uploading) return;

    if (!bridge.save()) {
      alert("Không thể lưu bản nháp. Chưa xuất backup.");
      return;
    }

    if (!window.JSZip) {
      alert("Không tải được JSZip. Cần Internet để xuất ZIP.");
      return;
    }

    transferring = true;
    tell("Đang chuẩn bị ZIP chứa ghi chú và media...");

    try {
      const entries = bridge.getEntries();
      const zip = new JSZip();
      const files = [];
      const seen = new Set();
      let totalSize = 0;

      for (const entry of entries) {
        for (const media of entry.media || []) {
          if (!media.local || seen.has(media.id)) continue;
          seen.add(media.id);

          const record = await getRecord(media.id);

          if (!record || !(record.blob instanceof Blob)) {
            throw new Error(
              "Thiếu media: " + (media.name || media.id) +
              ". Không xuất bản backup thiếu dữ liệu."
            );
          }

          totalSize += record.blob.size;

          if (totalSize > MAX_BACKUP) {
            throw new Error(
              "Media vượt 350 MB. Hãy sao lưu video lớn " +
              "riêng trước khi xuất ZIP."
            );
          }

          const path =
            "media/" + String(files.length + 1)
              .padStart(6, "0") + ".bin";

          files.push({
            id: media.id,
            path,
            name: record.name || media.name || "media",
            mime: record.mime ||
              record.blob.type || "application/octet-stream",
            size: record.blob.size
          });

          zip.file(path, record.blob);
        }
      }

      zip.file("journal.json", JSON.stringify({
        app: APP,
        version: 2,
        exportedAt: new Date().toISOString(),
        entries,
        files
      }, null, 2));

      if (totalSize > 150 * 1024 * 1024) {
        const proceed = confirm(
          "ZIP chứa trên 150 MB media.\n" +
          "Trình duyệt có thể dùng nhiều RAM khi xuất.\n" +
          "Tiếp tục?"
        );

        if (!proceed) return;
      }

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "STORE",
        streamFiles: true
      });

      download(
        blob,
        "AXIOM-PERSONAL-JOURNAL-FULL-" +
          bridge.localDate() + ".zip"
      );

      tell(
        "✓ Đã chuẩn bị ZIP: " +
        entries.length + " ghi chú, " +
        files.length + " tệp media."
      );

    } catch (error) {
      console.error("AXIOM ZIP Backup:", error);
      alert("Không xuất được backup: " + error.message);
      tell("Backup thất bại, dữ liệu gốc không bị xóa.", true);

    } finally {
      transferring = false;
    }
  }

  async function importZip(file) {
    if (!file || transferring || uploading) return;

    if (!bridge.save()) return;

    if (!window.JSZip) {
      alert("Không tải được JSZip. Hãy kiểm tra Internet.");
      return;
    }

    if (file.size > MAX_BACKUP) {
      alert("ZIP vượt giới hạn 350 MB.");
      return;
    }

    transferring = true;
    tell("Đang kiểm tra ZIP...");

    try {
      const zip = await JSZip.loadAsync(file);
      const manifestFile = zip.file("journal.json");

      if (!manifestFile) {
        throw new Error("ZIP không chứa journal.json.");
      }

      const manifest = JSON.parse(
        await manifestFile.async("string")
      );

      if (manifest.app !== APP ||
          manifest.version !== 2 ||
          !Array.isArray(manifest.entries) ||
          !Array.isArray(manifest.files) ||
          manifest.entries.length > 10000) {
        throw new Error("Sai định dạng AXIOM Journal ZIP.");
      }

      const incoming = manifest.entries.map(
        bridge.normalizeEntry
      );

      if (incoming.some(entry => !entry)) {
        throw new Error("Có ghi chú không hợp lệ trong ZIP.");
      }

      const fileMap = new Map();

      for (const meta of manifest.files) {
        if (!meta ||
            typeof meta.id !== "string" ||
            typeof meta.path !== "string" ||
            !/^media\/[0-9]{6}\.bin$/.test(meta.path) ||
            !Number.isFinite(meta.size) ||
            meta.size < 0 ||
            meta.size > MAX_FILE ||
            fileMap.has(meta.id)) {
          throw new Error("Metadata media không hợp lệ.");
        }

        fileMap.set(meta.id, meta);
      }

      const existing = bridge.getEntries();
      const knownIds = new Set(
        existing.map(entry => entry.id)
      );

      const knownDays = new Set(
        existing
          .filter(entry => entry.kind === "daily")
          .map(entry => entry.date)
      );

      const additions = [];

      for (const entry of incoming) {
        if (knownIds.has(entry.id)) continue;

        if (entry.kind === "daily" &&
            knownDays.has(entry.date)) {
          continue;
        }

        knownIds.add(entry.id);

        if (entry.kind === "daily") {
          knownDays.add(entry.date);
        }

        additions.push({
          ...entry,
          media: entry.media.map(m => ({ ...m }))
        });
      }

      if (!confirm(
        "ZIP có " + incoming.length + " ghi chú.\n" +
        "Sẽ thêm " + additions.length + " ghi chú mới.\n" +
        "Media của những ghi chú được thêm sẽ được khôi phục.\n" +
        "Không ghi đè dữ liệu hiện có.\n\n" +
        "Tiếp tục?"
      )) return;

      const records = [];
      let totalSize = 0;

      for (const entry of additions) {
        for (const media of entry.media) {
          if (!media.local) continue;

          const meta = fileMap.get(media.id);

          if (!meta) {
            throw new Error("Thiếu metadata cho media.");
          }

          const archived = zip.file(meta.path);

          if (!archived) {
            throw new Error("Thiếu tệp " + meta.path);
          }

          const rawBlob = await archived.async("blob");

          if (rawBlob.size !== meta.size) {
            throw new Error("Kích thước media không khớp.");
          }

          totalSize += rawBlob.size;

          if (totalSize > MAX_BACKUP) {
            throw new Error("Tổng media quá giới hạn 350 MB.");
          }

          const newId = bridge.uid();
          const mime =
            typeof meta.mime === "string" &&
            /^(image|video)\//.test(meta.mime)
              ? meta.mime
              : media.type === "video"
                ? "video/mp4" : "image/jpeg";

          const blob = new Blob([rawBlob], {
            type: mime
          });

          records.push({
            id: newId,
            blob,
            name: String(meta.name || "media").slice(0, 200),
            mime,
            size: blob.size
          });

          media.id = newId;
          media.name = String(meta.name || "media")
            .slice(0, 200);
        }
      }

      // Files first. Notes are committed only after
      // the IndexedDB transaction has succeeded.
      await putRecords(records);

      if (!bridge.commit([...existing, ...additions])) {
        throw new Error(
          "Không lưu được ghi chú sau Restore."
        );
      }

      alert(
        "Restore thành công!\n" +
        additions.length + " ghi chú mới\n" +
        records.length + " tệp media.\n\n" +
        "Trang sẽ tải lại để đồng bộ danh sách."
      );

      location.reload();

    } catch (error) {
      console.error("AXIOM ZIP Restore:", error);
      alert("Restore thất bại: " + error.message);
      tell(
        "Restore chưa hoàn tất. Ghi chú cũ vẫn được giữ.",
        true
      );

    } finally {
      transferring = false;
    }
  }

  // -------- LOCAL FILE PICKER --------

  const picker = document.createElement("div");
  picker.className = "aj-local-picker";

  picker.innerHTML = `
    <input id="aj-local-input" type="file"
      accept="image/*,video/*" multiple hidden>

    <button id="aj-local-button" type="button"
      class="aj-btn aj-btn-primary">
      📁 Chọn ảnh / video từ máy
    </button>

    <span class="aj-local-hint">
      Chọn nhiều file hoặc kéo thả tại đây
    </span>
  `;

  const mediaList = $("aj-media-list");

  if (!mediaList) {
    console.error("AXIOM Local Media: Media list missing.");
    return;
  }

  mediaList.insertAdjacentElement(
    "beforebegin",
    picker
  );

  const css = document.createElement("style");
  css.id = "axiom-journal-local-media-styles";

  css.textContent = `
    .aj-local-picker {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin: 12px 0;
      padding: 13px;
      border: 1px dashed #367c73;
      border-radius: 12px;
      background: rgba(17, 65, 59, .25);
    }

    .aj-local-picker.is-dragging {
      border-color: #71ffd1;
      background: rgba(50, 190, 146, .15);
    }

    .aj-local-hint {
      color: #a9c6d2;
      font-size: 11px;
      line-height: 1.5;
    }

    .aj-media-card a:not([href]) {
      cursor: default;
      text-decoration: none;
    }

    @media (max-width: 560px) {
      .aj-local-picker {
        align-items: stretch;
        flex-direction: column;
      }

      .aj-local-picker .aj-btn {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(css);

  $("aj-local-button").addEventListener(
    "click",
    () => $("aj-local-input").click()
  );

  $("aj-local-input").addEventListener(
    "change",
    async event => {
      await addFiles(event.target.files);
      event.target.value = "";
    }
  );

  picker.addEventListener("dragover", event => {
    event.preventDefault();
    picker.classList.add("is-dragging");
  });

  picker.addEventListener("dragleave", () => {
    picker.classList.remove("is-dragging");
  });

  picker.addEventListener("drop", async event => {
    event.preventDefault();
    picker.classList.remove("is-dragging");

    if (event.dataTransfer?.files?.length) {
      await addFiles(event.dataTransfer.files);
    }
  });

  const importInput = $("aj-import");
  importInput.accept = ".zip,.json,application/zip,application/json";

  $("aj-export").textContent = "↓ Backup ZIP đầy đủ";
  $("aj-import-btn").textContent = "↑ Restore ZIP / JSON";

  const backupDesc = document.querySelector(
    ".aj-backup p"
  );

  if (backupDesc) {
    backupDesc.textContent =
      "Backup ZIP chứa ghi chú và file ảnh/video " +
      "đính kèm từ máy. Restore chỉ thêm ghi chú chưa có. " +
      "Vẫn hỗ trợ backup JSON cũ.";
  }

  window.AXJMedia = {
    loadPreview,
    releasePreviews,
    exportZip,
    importZip
  };

  // The original journal initializes before this add-on.
  // Refresh previews after IndexedDB functions are ready.
  bridge.renderMedia();

  console.info("AXIOM Local Media / ZIP Backup ready.");
})();
