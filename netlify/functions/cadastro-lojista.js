const SUPABASE_URL     = process.env.VITE_SUPABASE_URL
const SERVICE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_KEY       = process.env.RESEND_API_KEY
const FROM             = process.env.RESEND_FROM || 'oi@pertim.online'
const ZAPI_INSTANCE    = process.env.ZAPI_INSTANCE_ID
const ZAPI_TOKEN       = process.env.ZAPI_TOKEN
const ADMIN_WHATSAPP   = process.env.ADMIN_WHATSAPP || '61999999999'

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

async function supabaseAuth(email, password, nome) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome },
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || data.msg || `Auth error ${res.status}`)
  return data
}

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) {
    console.warn('[Resend] RESEND_API_KEY não definida — e-mail ignorado')
    return { ok: false, error: 'chave ausente' }
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Pertim <${FROM}>`, to, subject, html }),
  }).catch(err => { console.error('[Resend] fetch error:', err.message); return null })
  if (!res) return { ok: false, error: 'network error' }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) console.error('[Resend] erro:', res.status, JSON.stringify(data))
  else console.log('[Resend] enviado para', to, '— id:', data.id)
  return { ok: res.ok, status: res.status, data }
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

  const { nome, email, senha, nomeLoja, categoria, whatsapp, endereco, bairro } = body

  if (!nome || !email || !senha || !nomeLoja || !whatsapp) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Campos obrigatórios faltando' }) }
  }

  try {
    // 1. Criar usuário (email já confirmado via admin API)
    const user = await supabaseAuth(email, senha, nome)

    // 2. Buscar categoria_id
    const catRes = await supabaseAdmin(`categorias?slug=eq.${encodeURIComponent(categoria)}&select=id`, 'GET')
    const categoriaId = catRes.data?.[0]?.id || null

    // 3. Inserir loja (service role bypassa RLS)
    const lojaRes = await supabaseAdmin('lojas', 'POST', {
      user_id: user.id,
      nome: nomeLoja,
      categoria_id: categoriaId,
      whatsapp: whatsapp.replace(/\D/g, ''),
      endereco: endereco || '',
      bairro: bairro || 'Riacho Fundo 1',
      status: 'pendente',
      aberta: false,
    })
    if (!lojaRes.ok) throw new Error(lojaRes.data?.message || 'Erro ao criar loja')

    const primeiroNome = nome.split(' ')[0]

    // 4. E-mail boas-vindas ao lojista
    await sendEmail(email, '🎉 Bem-vindo ao Pertim! Sua loja foi cadastrada', `
      <!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#10B981;padding:32px 40px;text-align:center">
          <div style="font-size:2rem;font-weight:900;color:#fff">Pertim<span style="color:rgba(255,255,255,.6)">.</span></div>
        </div>
        <div style="padding:40px">
          <h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 12px">Bem-vindo, ${primeiroNome}! 🎉</h1>
          <p style="color:#475569;line-height:1.6;margin:0 0 20px">
            Sua loja <strong>${nomeLoja}</strong> foi cadastrada e está em análise.<br>
            Em até <strong>24 horas</strong> você aparecerá para os moradores do bairro.
          </p>
          <div style="background:#f1fdf7;border:1px solid #a7f3d0;border-radius:12px;padding:16px;margin-bottom:24px;font-size:.88rem;color:#047857">
            ✅ Conta criada e e-mail confirmado<br>
            ⏳ Loja aguardando aprovação do admin<br>
            📱 Acesse seu painel em pertim.online/lojista
          </div>
          <a href="https://pertim.online/lojista" style="display:block;background:#10B981;color:#fff;text-align:center;padding:16px;border-radius:10px;font-weight:700;text-decoration:none">
            Acessar meu painel →
          </a>
        </div>
      </div></body></html>
    `)

    // 5. E-mail de notificação ao admin
    await sendEmail('oi@pertim.online', `🏪 Nova loja cadastrada: ${nomeLoja}`, `
      <!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#0f172a;padding:24px 40px;text-align:center">
          <div style="font-size:1.6rem;font-weight:900;color:#fff">Pertim<span style="color:#10B981">.</span></div>
        </div>
        <div style="padding:32px 40px">
          <h1 style="font-size:1.2rem;font-weight:800;color:#0f172a;margin:0 0 16px">🔔 Nova loja aguardando aprovação</h1>
          <table style="width:100%;border-collapse:collapse;font-size:.88rem;color:#475569">
            <tr><td style="padding:8px 0;font-weight:700;color:#0f172a;width:120px">Loja</td><td>${nomeLoja}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#0f172a">Proprietário</td><td>${nome}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#0f172a">E-mail</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#0f172a">WhatsApp</td><td>${whatsapp}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;color:#0f172a">Bairro</td><td>${bairro || 'Riacho Fundo 1'}</td></tr>
          </table>
          <a href="https://pertim.online/admin/lojas" style="display:block;background:#10B981;color:#fff;text-align:center;padding:14px;border-radius:10px;font-weight:700;text-decoration:none;margin-top:24px">
            Aprovar no painel admin →
          </a>
        </div>
      </div></body></html>
    `)

    // 6. WhatsApp ao lojista
    await sendWhatsApp(whatsapp, `Olá ${primeiroNome}! 👋\n\nSua loja *${nomeLoja}* foi cadastrada no *Pertim* com sucesso!\n\nEm até 24h nossa equipe irá aprovar e você já aparecerá para os moradores do bairro. 🏘️\n\nAcesse seu painel: https://pertim.online/lojista`)

    // 7. WhatsApp ao admin
    await sendWhatsApp(ADMIN_WHATSAPP, `🏪 *Nova loja cadastrada no Pertim!*\n\n*${nomeLoja}*\nProprietário: ${nome}\nWhatsApp: ${whatsapp}\nBairro: ${bairro || 'Riacho Fundo 1'}\n\nAprovar em: https://pertim.online/admin/lojas`)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, userId: user.id }),
    }
  } catch (err) {
    const alreadyExists = err.message?.toLowerCase().includes('already registered')
      || err.message?.toLowerCase().includes('already exists')
      || err.message?.toLowerCase().includes('duplicate')
    return {
      statusCode: alreadyExists ? 409 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    }
  }
}
