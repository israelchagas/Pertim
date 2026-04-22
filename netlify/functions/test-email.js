const RESEND_KEY = process.env.RESEND_API_KEY
const FROM       = process.env.RESEND_FROM || 'oi@pertim.online'

export async function handler(event) {
  const to = event.queryStringParameters?.to || 'israel.chagas@gmail.com'

  if (!RESEND_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'RESEND_API_KEY não definida nas variáveis de ambiente do Netlify' }),
    }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Pertim <${FROM}>`,
      to,
      subject: '✅ Teste de e-mail — Pertim',
      html: '<p>Se você recebeu este e-mail, o Resend está configurado corretamente. 🎉</p>',
    }),
  })

  const data = await res.json().catch(() => ({}))

  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resend_status: res.status,
      resend_ok: res.ok,
      resend_response: data,
      env_key_presente: !!RESEND_KEY,
      env_key_prefixo: RESEND_KEY?.slice(0, 8) + '...',
      from: FROM,
      to,
    }),
  }
}
