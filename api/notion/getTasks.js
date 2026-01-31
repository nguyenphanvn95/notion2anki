// Vercel Serverless Function
// Proxy for Notion internal getTasks API.

const NOTION_GET_TASK_ENDPOINT = 'https://www.notion.so/api/v3/getTasks';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  try {
    const { token, taskIds } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!token || typeof token !== 'string') {
      res.statusCode = 400;
      return res.json({ error: 'Missing token (token_v2).' });
    }
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      res.statusCode = 400;
      return res.json({ error: 'Missing taskIds.' });
    }

    const upstream = await fetch(NOTION_GET_TASK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'notion2anki-vercel-proxy/1.0',
        'Cookie': `token_v2=${token}`,
        'Origin': 'https://www.notion.so',
        'Referer': 'https://www.notion.so',
      },
      body: JSON.stringify({ taskIds }),
    });

    if (upstream.status === 401) {
      res.statusCode = 401;
      return res.json({ error: 'Invalid token_v2.' });
    }

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      res.statusCode = 502;
      return res.json({ error: 'Upstream non-JSON response', raw: text.slice(0, 500) });
    }

    res.statusCode = upstream.ok ? 200 : upstream.status;
    return res.json(data);
  } catch (e) {
    res.statusCode = 500;
    return res.json({ error: 'Proxy failed', message: e?.message || String(e) });
  }
};
