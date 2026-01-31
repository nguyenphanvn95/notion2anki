// /api/notion/downloadExport.js
// Downloads the signed export URL (usually S3) and returns it as a ZIP.
// This avoids CORS issues when downloading the export from the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { exportURL, filename = "notion_export.zip" } = req.body || {};
    if (!exportURL) {
      return res.status(400).json({ error: "Missing exportURL" });
    }

    const r = await fetch(exportURL);
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return res.status(502).json({
        error: "Failed to download export",
        status: r.status,
        text: (t || "").slice(0, 1000),
      });
    }

    const arrayBuffer = await r.arrayBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("downloadExport error:", err);
    return res.status(500).json({ error: "Internal server error", detail: err?.message || String(err) });
  }
}
