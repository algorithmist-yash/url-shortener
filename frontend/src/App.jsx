import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  /* ================= STATE ================= */
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [expiry, setExpiry] = useState(30); // minutes
  const [countdown, setCountdown] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  /* ================= RESPONSIVE ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!analytics?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(analytics.expiresAt) - new Date();

      if (diff <= 0) {
        setCountdown("Expired");
        clearInterval(interval);
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [analytics]);

  /* ================= API ================= */
  const shortenUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");
    setAnalytics(null);

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url,
          expiresInMinutes: expiry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Server error");
        return;
      }

      setShortUrl(data.shortUrl);
      fetchAnalytics(data.shortUrl.split("/").pop());
    } catch {
      setError("Backend unreachable");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (code) => {
    const res = await fetch(`${API_BASE}/analytics/${code}`);
    if (res.ok) setAnalytics(await res.json());
  };

  const expireNow = async () => {
    const code = shortUrl.split("/").pop();
    await fetch(`${API_BASE}/expire/${code}`, { method: "PATCH" });
    fetchAnalytics(code);
  };

  /* ================= UTIL ================= */
  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    alert("Copied!");
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "short-url-qr.png";
    a.click();
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const StatusBadge = ({ active }) => (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: active
          ? "rgba(34,197,94,0.15)"
          : "rgba(239,68,68,0.15)",
        color: active ? "#22c55e" : "#ef4444",
      }}
    >
      {active ? "Active" : "Expired"}
    </span>
  );

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* LEFT CARD */}
        <div style={styles.card}>
          <h1>URL Shortener</h1>

          <input
            style={styles.input}
            placeholder="Paste a long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <select
            style={styles.select}
            value={expiry}
            onChange={(e) => setExpiry(Number(e.target.value))}
          >
            <option value={5}>5 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={1440}>1 day</option>
          </select>

          <button style={styles.button} onClick={shortenUrl} disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          {shortUrl && (
            <div style={styles.resultCard}>
              <div style={styles.resultRow}>
                <a href={shortUrl} target="_blank" rel="noreferrer" style={styles.link}>
                  {shortUrl}
                </a>
                <button onClick={copy} style={styles.copy}>Copy</button>
              </div>

              <div style={styles.qrWrapper}>
                <QRCodeCanvas id="qr-code" value={shortUrl} size={140} />
                <button onClick={downloadQR} style={styles.downloadBtn}>
                  Download QR
                </button>
              </div>
            </div>
          )}

          {analytics && (
            <div style={styles.analytics}>
              <div style={styles.analyticsHeader}>
                <h3>Analytics</h3>
                <StatusBadge active={analytics.isActive} />
              </div>

              <p><b>Original:</b> {analytics.originalUrl}</p>
              <p><b>Clicks:</b> {analytics.clicks}</p>
              <p><b>Created:</b> {formatDate(analytics.createdAt)}</p>
              <p><b>⏳ Expires in:</b> {countdown}</p>

              {analytics.isActive && (
                <button
                  style={styles.expireBtn}
                  onClick={() => confirm("Expire permanently?") && expireNow()}
                >
                  Expire Now
                </button>
              )}
            </div>
          )}
        </div>

        {!isMobile && (
          <div style={styles.side}>
            <h2>Simple. Fast. Reliable.</h2>
            <ul>
              <li>⚡ Instant URLs</li>
              <li>📊 Analytics</li>
              <li>⏳ Auto-expiry</li>
              <li>📱 QR Codes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: { display: "flex", gap: 60 },
  card: { background: "#0f172a", padding: 30, borderRadius: 16, width: 420 },
  input: { width: "100%", padding: 12, marginBottom: 12 },
  select: { width: "100%", padding: 12, marginBottom: 12 },
  button: { width: "100%", padding: 12, borderRadius: 10, background: "#38bdf8", border: "none" },
  error: { color: "#ef4444" },
  resultCard: { marginTop: 20, padding: 16, background: "rgba(0,0,0,0.35)", borderRadius: 14 },
  resultRow: { display: "flex", justifyContent: "space-between" },
  link: { color: "#38bdf8" },
  copy: { background: "#1e293b", color: "#fff", border: "none", padding: "6px 12px" },
  qrWrapper: { marginTop: 16, alignItems: "center" },
  downloadBtn: { marginTop: 8 },
  analytics: { marginTop: 20 },
  analyticsHeader: { display: "flex", justifyContent: "space-between" },
  expireBtn: { marginTop: 14, padding: 10, background: "#ef4444", border: "none", color: "#fff" },
  side: { maxWidth: 300 },
};
