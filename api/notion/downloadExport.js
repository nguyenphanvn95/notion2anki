// /api/notion/downloadExport.js
// Download Notion export zip via backend (avoid browser CORS).
// Fix 403 by warming up a session and forwarding Set-Cookie cookies.

function parseSetCookieToCookieHeader(setCookieArr = []) {
  // Convert ["a=b; Path=/; ...", "c=d; Path=/; ..."] -> "a=b; c=d"
  return setCookieArr
    .map((sc) => (sc || "").split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { exportURL, filename = "notion_export.zip", token } = req.body || {};
    if (!exportURL) return res.status(400).json({ error: "Missing exportURL" });
    if (!token) return res.status(400).json({ error: "Missing token" });

    // 1) Warm-up: hit Notion with token_v2 to receive extra cookies (notion_user_id, device_id, ...)
    const warmHeaders = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Origin": "https://www.notion.so",
      "Referer": "https://www.notion.so/",
      "Cookie": `token_v2=${token}`,
    };

    const warmResp = await fetch("https://www.notion.so/api/v3/getUserSettings", {
      method: "POST",
      headers: warmHeaders,
      body: JSON.stringify({}),
      redirect: "follow",
    });

    // Grab Set-Cookie(s) if runtime supports it (Node/Undici)
    let setCookies = [];
    if (typeof warmResp.headers.getSetCookie === "function") {
      setCookies = warmResp.headers.getSetCookie() || [];
    } else {
      // fallback: may only get one (still better than nothing)
      const one = warmResp.headers.get("set-cookie");
      if (one) setCookies = [one];
    }

    const extraCookieHeader = parseSetCookieToCookieHeader(setCookies);

    // 2) Download exportURL using combined cookies
    const dlHeaders = {
      "User-Agent": "Mozilla/5.0",
      "Origin": "https://www.notion.so",
      "Referer": "https://www.notion.so/",
      // combine token_v2 + extra cookies
      "Cookie": extraCookieHeader
        ? `token_v2=${token}; ${extraCookieHeader}`
        : `token_v2=${token}`,
    };

    const r = await fetch(exportURL, { headers: dlHeaders, redirect: "follow" });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return res.status(502).json({
        error: "Failed to download export",
        status: r.status,
        // show first part for debug
        text: (t || "").slice(0, 1200),
      });
    }

    const arrayBuffer = await r.arrayBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("downloadExport error:", err);
    return res.status(500).json({
      error: "Internal server error",
      detail: err?.message || String(err),
    });
  }
}
