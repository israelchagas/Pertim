const INSTANCE_ID = process.env.ZAPI_INSTANCE_ID
const TOKEN       = process.env.ZAPI_TOKEN
const BASE_URL    = process.env.ZAPI_BASE_URL || 'https://api.z-api.io'

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

  const { phone, message } = body
  if (!phone || !message) {
    return { statusCode: 400, body: 'phone e message são obrigatórios' }
  }

  const url = `${BASE_URL}/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message }),
    })

    const data = await res.json().catch(() => ({}))

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
