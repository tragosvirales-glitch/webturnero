export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

  const { telefono, apiKey, mensaje } = req.body;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${telefono}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;
    const r = await fetch(url);
    const text = await r.text();
    res.status(200).json({ ok: true, response: text });
  } catch(e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
