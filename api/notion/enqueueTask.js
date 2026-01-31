// /api/notion/enqueueTask.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, pageId, recursive = true, timeZone = "Asia/Ho_Chi_Minh", locale = "en" } = req.body || {};

    if (!token || !pageId) {
      return res.status(400).json({ error: "Missing token or pageId" });
    }

    const toDashedId = (id) => {
      if (!id) return id;
      const raw = String(id).trim().replace(/-/g, '');
      if (/^[a-f0-9]{32}$/i.test(raw)) {
        return raw.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/i, '$1-$2-$3-$4-$5');
      }
      return String(id).trim();
    };

    const blockId = toDashedId(pageId);

    // ✅ Payload theo đúng addon notion2ankipro
    const payload = {
      task: {
        eventName: "exportBlock",
        request: {
          block: { id: blockId },
          recursive: !!recursive,
          exportOptions: {
            exportType: "html",
            timeZone,
            locale,
          },
        },
      },
    };

    const notionRes = await fetch("https://www.notion.so/api/v3/enqueueTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token_v2=${token}`,

        // ✅ một số header giúp giống browser hơn (không hại, đôi khi giúp)
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://www.notion.so",
        "Referer": "https://www.notion.so/",
      },
      body: JSON.stringify(payload),
    });

    const status = notionRes.status;
    const text = await notionRes.text(); // 🔥 đọc raw text trước
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    // ✅ taskId chuẩn theo Notion internal API
    const taskId = data?.taskId || (Array.isArray(data?.taskIds) ? data.taskIds[0] : null);

    // Trả nguyên status + raw để debug triệt để
    if (!taskId) {
      return res.status(500).json({
        error: "Notion did not return taskId",
        notion_status: status,
        notion_text: text?.slice(0, 2000) || "", // giới hạn log
        payload_sent: payload,
      });
    }

    return res.status(200).json({
      taskId,
      raw: data,
    });
  } catch (err) {
    console.error("enqueueTask error:", err);
    return res.status(500).json({
      error: "Internal server error",
      detail: err?.message || String(err),
    });
  }
}
