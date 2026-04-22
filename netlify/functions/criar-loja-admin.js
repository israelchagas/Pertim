const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

async function supabaseAdmin(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  let body
  try { body = JSON.parse(event.body) }
  catch { return { statusCode: 400, body: 'Invalid JSON' } }

  const { nomeLoja, categoria, whatsapp, endereco, bairro, status = 'ativo' } = body

  if (!nomeLoja || !whatsapp) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Nome e WhatsApp são obrigatórios' }) }
  }

  try {
    const catRes = await supabaseAdmin(`categorias?slug=eq.${encodeURIComponent(categoria || '')}&select=id`, 'GET')
    const categoriaId = catRes.data?.[0]?.id || null

    const lojaRes = await supabaseAdmin('lojas', 'POST', {
      nome: nomeLoja,
      categoria_id: categoriaId,
      whatsapp: whatsapp.replace(/\D/g, ''),
      endereco: endereco || '',
      bairro: bairro || 'Riacho Fundo 1',
      status,
      aberta: false,
    })

    if (!lojaRes.ok) throw new Error(lojaRes.data?.message || 'Erro ao criar loja')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, loja: lojaRes.data[0] }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
