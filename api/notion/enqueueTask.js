// Vercel Serverless Function
// Proxies Notion internal API to bypass browser CORS.
//
// Security note:
// - token_v2 is sensitive. This function expects the client to send it in the body.
// - Do NOT log the token.
// - This is an *unofficial* API; use at your own risk.

const NOTION_ENQUEUE_TASK_ENDPOINT = 'https://www.notion.so/api/v3/enqueueTask';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  try {
    const { token, payload } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!token || typeof token !== 'string') {
      res.statusCode = 400;
      return res.json({ error: 'Missing token (token_v2).' });
    }
    if (!payload || typeof payload !== 'object') {
      res.statusCode = 400;
      return res.json({ error: 'Missing payload.' });
    }

    const upstream = await fetch(NOTION_ENQUEUE_TASK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'notion2anki-vercel-proxy/1.0',
        // Notion auth cookie
        'Cookie': `token_v2=${token}`,
        // Some deployments benefit from these, harmless if ignored
        'Origin': 'https://www.notion.so',
        'Referer': 'https://www.notion.so',
      },
      body: JSON.stringify(payload),
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
      // Notion sometimes returns HTML on edge failures
      res.statusCode = 502;
      return res.json({ error: 'Upstream non-JSON response', raw: text.slice(0, 500) });
    }

    if (!upstream.ok) {
      res.statusCode = upstream.status;
      return res.json({ error: 'Upstream error', details: data });
    }

    // Successful response contains taskId
    res.statusCode = 200;
    return res.json({ taskId: data.taskId });
  } catch (e) {
    res.statusCode = 500;
    return res.json({ error: 'Proxy failed', message: e?.message || String(e) });
  }
};
