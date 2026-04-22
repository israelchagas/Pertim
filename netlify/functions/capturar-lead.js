const SUPABASE_URL   = process.env.VITE_SUPABASE_URL
const SERVICE_KEY    = process.env.SUPABASE_SERVICE_ROLE_KEY
const ZAPI_INSTANCE  = process.env.ZAPI_INSTANCE_ID
const ZAPI_TOKEN     = process.env.ZAPI_TOKEN
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || '61999999999'

async function insertLead(body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Erro ao salvar lead')
  return data[0]
}

async function sendWhatsApp(phone, message) {
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN) return
  await fetch(`https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone.replace(/\D/g, ''), message }),
  }).catch(() => {})
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  let body
  try { body = JSON.parse(event.body) }
  catch { return { statusCode: 400, body: 'Invalid JSON' } }

  const { nome, loja, whatsapp, tipo, bairro, origem = 'landing' } = body

  if (!nome || !whatsapp) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome e WhatsApp são obrigatórios' }) }
  }

  try {
    const lead = await insertLead({
      nome,
      loja: loja || '',
      whatsapp: whatsapp.replace(/\D/g, ''),
      tipo: tipo || '',
      bairro: bairro || 'Riacho Fundo 1',
      status: 'novo',
      origem,
    })

    const primeiroNome = nome.split(' ')[0]

    await sendWhatsApp(
      ADMIN_WHATSAPP,
      `🔔 *Novo lead na Landing Page!*\n\n*${loja || nome}*\nContato: ${nome}\nWhatsApp: ${whatsapp}\nTipo: ${tipo || '—'}\nBairro: ${bairro || 'Riacho Fundo 1'}\n\nVer em: https://pertim.online/admin/leads`
    )

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, id: lead?.id }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
