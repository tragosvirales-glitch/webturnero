exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { telefono, apiKey, mensaje } = JSON.parse(event.body);

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${telefono}&text=${encodeURIComponent(mensaje)}&apikey=${apiKey}`;
    const res = await fetch(url);
    const text = await res.text();
    return { statusCode: 200, headers: {"Access-Control-Allow-Origin":"*"}, body: JSON.stringify({ ok: true, response: text }) };
  } catch(e) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin":"*"}, body: JSON.stringify({ ok: false, error: e.message }) };
  }
};
