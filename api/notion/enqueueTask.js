// /api/notion/enqueueTask.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, pageId } = req.body;

    if (!token || !pageId) {
      return res.status(400).json({
        error: "Missing token or pageId"
      });
    }

    // ⚠️ Payload chuẩn theo Notion schema mới
    const payload = {
      task: {
        eventName: "exportBlock",
        request: {
          blockId: pageId,
          recursive: true,
          exportOptions: {
            exportType: "html",
            locale: "en",
            timeZone: "Asia/Ho_Chi_Minh"
          }
        }
      }
    };

    const notionRes = await fetch(
      "https://www.notion.so/api/v3/enqueueTask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `token_v2=${token}`,
          "User-Agent": "Mozilla/5.0"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await notionRes.json();

    // ✅ Với schema mới, taskId nằm trong taskId hoặc taskIds[0]
    const taskId =
      data?.taskId ||
      (Array.isArray(data?.taskIds) ? data.taskIds[0] : null);

    if (!taskId) {
      return res.status(500).json({
        error: "Notion did not return taskId",
        raw: data
      });
    }

    return res.status(200).json({
      taskId,
      raw: data
    });

  } catch (err) {
    console.error("enqueueTask error:", err);
    return res.status(500).json({
      error: "Internal server error",
      detail: err.message
    });
  }
}
