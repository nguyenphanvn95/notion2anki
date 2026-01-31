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

    // Payload chuẩn cho Notion internal API
    const payload = {
      task: {
        eventName: "exportPage",
        request: {
          pageId: pageId,
          exportOptions: {
            exportType: "html",           // html là ổn nhất để parse
            timeZone: "Asia/Ho_Chi_Minh",
            locale: "en"
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
          "Cookie": `token_v2=${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await notionRes.json();

    // Debug nhẹ nếu cần
    if (!data || !data.taskId) {
      return res.status(500).json({
        error: "Notion did not return taskId",
        raw: data
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("enqueueTask error:", err);
    return res.status(500).json({
      error: "Internal server error",
      detail: err.message
    });
  }
}
