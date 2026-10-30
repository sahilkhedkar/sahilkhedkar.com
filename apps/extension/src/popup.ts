import {
  DEFAULT_CONFIG,
  type ExtensionConfig,
  type TrackInfo,
} from "./types";

const apiUrlInput = document.getElementById("api-url") as HTMLInputElement;
const tokenInput = document.getElementById("token") as HTMLInputElement;
const syncToggle = document.getElementById("sync-toggle") as HTMLInputElement;
const toggleTokenBtn = document.getElementById("toggle-token") as HTMLButtonElement;
const configForm = document.getElementById("config-form") as HTMLFormElement;
const testBtn = document.getElementById("test-btn") as HTMLButtonElement;
const alertBox = document.getElementById("alert-box") as HTMLDivElement;

const statusCard = document.getElementById("status-card") as HTMLDivElement;
const statusText = document.getElementById("status-text") as HTMLSpanElement;
const lastSyncTime = document.getElementById("last-sync-time") as HTMLSpanElement;

const presetProd = document.getElementById("preset-prod") as HTMLButtonElement | null;
const presetLocal = document.getElementById("preset-local") as HTMLButtonElement | null;

const PROD_URL = "https://sahilkhedkar.com/api/now-playing";
const LOCAL_URL = "http://localhost:1234/api/now-playing";

function updatePresetHighlight() {
  const currentVal = apiUrlInput.value.trim();
  if (presetProd) presetProd.classList.toggle("active", currentVal === PROD_URL);
  if (presetLocal) presetLocal.classList.toggle("active", currentVal === LOCAL_URL);
}

presetProd?.addEventListener("click", () => {
  apiUrlInput.value = PROD_URL;
  updatePresetHighlight();
});

presetLocal?.addEventListener("click", () => {
  apiUrlInput.value = LOCAL_URL;
  updatePresetHighlight();
});

apiUrlInput.addEventListener("input", updatePresetHighlight);

const trackPreview = document.getElementById("track-preview") as HTMLDivElement;
const previewArt = document.getElementById("preview-art") as HTMLImageElement;
const previewTitle = document.getElementById("preview-title") as HTMLDivElement;
const previewArtist = document.getElementById("preview-artist") as HTMLDivElement;
const previewBadge = document.getElementById("preview-badge") as HTMLDivElement;

function showAlert(message: string, type: "success" | "error") {
  alertBox.textContent = message;
  alertBox.className = `alert-box ${type}`;
  alertBox.classList.remove("hidden");
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 4000);
}

function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return "Never";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function updateTrackPreview(track?: TrackInfo | null) {
  if (!track || !track.title) {
    trackPreview.classList.add("hidden");
    return;
  }

  trackPreview.classList.remove("hidden");
  previewTitle.textContent = track.title;
  previewArtist.textContent = track.artist || "Unknown Artist";
  if (track.artwork) {
    previewArt.src = track.artwork;
    previewArt.style.display = "block";
  } else {
    previewArt.style.display = "none";
  }

  if (track.isPlaying) {
    previewBadge.textContent = "LIVE";
    previewBadge.style.color = "var(--accent-green)";
  } else {
    previewBadge.textContent = "PAUSED";
    previewBadge.style.color = "var(--muted)";
  }
}

function updateStatusUI(cfg: ExtensionConfig) {
  if (!cfg.enabled) {
    statusCard.className = "status-card idle";
    statusText.textContent = "Sync Disabled";
    lastSyncTime.textContent = "";
    return;
  }

  if (cfg.lastError) {
    statusCard.className = "status-card error";
    statusText.textContent = "Error Syncing";
    lastSyncTime.textContent = cfg.lastError;
    return;
  }

  if (cfg.lastTrack?.isPlaying) {
    statusCard.className = "status-card playing";
    statusText.textContent = "Active • Syncing";
  } else if (cfg.lastTrack) {
    statusCard.className = "status-card idle";
    statusText.textContent = "Paused";
  } else {
    statusCard.className = "status-card idle";
    statusText.textContent = "Ready • Awaiting YouTube Music";
  }

  lastSyncTime.textContent = formatRelativeTime(cfg.lastSyncedAt);
}

async function loadSettings() {
  chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
    const cfg = items as ExtensionConfig;
    apiUrlInput.value = cfg.apiUrl || DEFAULT_CONFIG.apiUrl;
    tokenInput.value = cfg.token || DEFAULT_CONFIG.token;
    syncToggle.checked = cfg.enabled !== false;

    updateStatusUI(cfg);
    updateTrackPreview(cfg.lastTrack);
    updatePresetHighlight();
  });
}

// Toggle password visibility
toggleTokenBtn.addEventListener("click", () => {
  if (tokenInput.type === "password") {
    tokenInput.type = "text";
    toggleTokenBtn.textContent = "🙈";
  } else {
    tokenInput.type = "password";
    toggleTokenBtn.textContent = "👁️";
  }
});

// Toggle sync switch
syncToggle.addEventListener("change", () => {
  const enabled = syncToggle.checked;
  chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
    const updated = { ...(items as ExtensionConfig), enabled };
    chrome.storage.sync.set(updated, () => {
      chrome.runtime.sendMessage({ type: "CONFIG_UPDATED", payload: updated });
      updateStatusUI(updated);
    });
  });
});

// Save settings form
configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiUrl = apiUrlInput.value.trim() || DEFAULT_CONFIG.apiUrl;
  const token = tokenInput.value.trim() || DEFAULT_CONFIG.token;

  if (!apiUrl) {
    showAlert("Please enter an API URL.", "error");
    return;
  }

  chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
    const updated: ExtensionConfig = {
      ...(items as ExtensionConfig),
      apiUrl,
      token,
      lastError: null,
    };

    chrome.storage.sync.set(updated, () => {
      chrome.runtime.sendMessage({ type: "CONFIG_UPDATED", payload: updated });
      showAlert("Settings saved successfully!", "success");
      updateStatusUI(updated);
    });
  });
});

// Test connection
testBtn.addEventListener("click", async () => {
  const apiUrl = apiUrlInput.value.trim();
  const token = tokenInput.value.trim();

  if (!apiUrl || !token) {
    showAlert("Enter API URL and token first.", "error");
    return;
  }

  testBtn.disabled = true;
  testBtn.textContent = "Testing...";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: "heartbeat",
        isPlaying: false,
      }),
    });

    if (res.ok) {
      showAlert("Connection successful! Server verified token.", "success");
      chrome.storage.sync.get(DEFAULT_CONFIG, (items) => {
        const updated = {
          ...(items as ExtensionConfig),
          lastSyncedAt: Date.now(),
          lastError: null,
        };
        chrome.storage.sync.set(updated);
        updateStatusUI(updated);
      });
    } else {
      const err = await res.json().catch(() => null);
      showAlert(`Server error: ${err?.error || res.statusText}`, "error");
    }
  } catch (err) {
    showAlert(`Connection failed: ${err instanceof Error ? err.message : "Network error"}`, "error");
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = "Test Connection";
  }
});

// Initialize popup
loadSettings();
