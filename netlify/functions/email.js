const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM || 'oi@pertim.online'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { to, subject, html } = body
  if (!to || !subject || !html) {
    return { statusCode: 400, body: 'to, subject e html são obrigatórios' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: `Pertim <${FROM}>`, to, subject, html }),
    })

    const data = await res.json().catch(() => ({}))
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
