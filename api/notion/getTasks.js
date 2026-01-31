// /api/notion/getTasks.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, taskIds } = req.body || {};

    if (!token) return res.status(400).json({ error: "Missing token" });
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: "Missing taskIds" });
    }

    const notionRes = await fetch("https://www.notion.so/api/v3/getTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token_v2=${token}`,
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://www.notion.so",
        "Referer": "https://www.notion.so/",
      },
      body: JSON.stringify({ taskIds }),
    });

    const data = await notionRes.json();

    // Nếu complete -> bóc exportURL giống addon
    const first = Array.isArray(data?.results) ? data.results[0] : null;
    const exportURL =
      first?.status?.type === "complete" ? first.status.exportURL : null;

    return res.status(200).json({ ...data, exportURL });
  } catch (err) {
    console.error("getTasks error:", err);
    return res.status(500).json({ error: "Internal server error", detail: err.message });
  }
}
