const RESEND_KEY     = process.env.RESEND_API_KEY
const FROM           = process.env.RESEND_FROM || 'oi@pertim.online'
const ZAPI_INSTANCE  = process.env.ZAPI_INSTANCE_ID
const ZAPI_TOKEN     = process.env.ZAPI_TOKEN

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) return { ok: false, error: 'RESEND_API_KEY ausente' }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Pertim <${FROM}>`, to, subject, html }),
  }).catch(() => null)
  if (!res) return { ok: false, error: 'network error' }
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

async function sendWhatsApp(phone, message) {
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN) return { ok: false, error: 'Z-API não configurado' }
  const res = await fetch(`https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone.replace(/\D/g, ''), message }),
  }).catch(() => null)
  if (!res) return { ok: false, error: 'network error' }
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, data }
}

const TEMPLATES = {
  boasVindas: (nome, nomeLoja) => ({
    subject: '🎉 Bem-vindo ao Pertim! Sua loja foi cadastrada',
    html: `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#10B981;padding:32px 40px;text-align:center">
          <div style="font-size:2rem;font-weight:900;color:#fff">Pertim<span style="color:rgba(255,255,255,.6)">.</span></div>
        </div>
        <div style="padding:40px">
          <h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 12px">Bem-vindo, ${nome}! 🎉</h1>
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
      </div></body></html>`,
    whatsapp: `Olá ${nome}! 👋\n\nSua loja *${nomeLoja}* foi cadastrada no *Pertim* com sucesso!\n\nEm até 24h nossa equipe irá aprovar e você aparecerá para os moradores do bairro. 🏘️\n\nAcesse seu painel: https://pertim.online/lojista`,
  }),

  aprovacao: (nome, nomeLoja) => ({
    subject: '✅ Sua loja foi aprovada no Pertim!',
    html: `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#10B981;padding:32px 40px;text-align:center">
          <div style="font-size:2rem;font-weight:900;color:#fff">Pertim<span style="color:rgba(255,255,255,.6)">.</span></div>
        </div>
        <div style="padding:40px">
          <h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 12px">🎊 Parabéns, ${nome}!</h1>
          <p style="color:#475569;line-height:1.6;margin:0 0 20px">
            Sua loja <strong>${nomeLoja}</strong> foi <strong style="color:#10B981">aprovada</strong> e já está visível para os moradores do bairro!
          </p>
          <div style="background:#f1fdf7;border:1px solid #a7f3d0;border-radius:12px;padding:16px;margin-bottom:24px;font-size:.88rem;color:#047857">
            ✅ Loja aprovada e ativa<br>
            📍 Aparecendo no mapa e na busca<br>
            📱 Gerencie pelo painel: pertim.online/lojista
          </div>
          <a href="https://pertim.online/lojista" style="display:block;background:#10B981;color:#fff;text-align:center;padding:16px;border-radius:10px;font-weight:700;text-decoration:none">
            Acessar meu painel →
          </a>
        </div>
      </div></body></html>`,
    whatsapp: `🎊 Parabéns, ${nome}!\n\nSua loja *${nomeLoja}* foi *aprovada* no Pertim!\n\nVocê já está aparecendo no mapa e na busca dos moradores do bairro. 🗺️\n\nAcesse seu painel agora: https://pertim.online/lojista`,
  }),

  lembrete: (nome, nomeLoja) => ({
    subject: '📱 Seu painel Pertim está esperando por você',
    html: `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,sans-serif">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#0f172a;padding:32px 40px;text-align:center">
          <div style="font-size:2rem;font-weight:900;color:#fff">Pertim<span style="color:#10B981">.</span></div>
        </div>
        <div style="padding:40px">
          <h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 12px">Oi, ${nome}! 👋</h1>
          <p style="color:#475569;line-height:1.6;margin:0 0 20px">
            Sua loja <strong>${nomeLoja}</strong> está no Pertim, mas notamos que você ainda não adicionou produtos.<br><br>
            Adicionar produtos é simples — é como postar uma foto no Instagram. Leva menos de 2 minutos!
          </p>
          <a href="https://pertim.online/lojista/produtos" style="display:block;background:#10B981;color:#fff;text-align:center;padding:16px;border-radius:10px;font-weight:700;text-decoration:none">
            Adicionar meus primeiros produtos →
          </a>
        </div>
      </div></body></html>`,
    whatsapp: `Oi ${nome}! 👋\n\nSua loja *${nomeLoja}* está no Pertim, mas ainda sem produtos cadastrados.\n\nAdicione agora — é simples como postar uma foto! 📸\n\nhttps://pertim.online/lojista/produtos`,
  }),
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  let body
  try { body = JSON.parse(event.body) }
  catch { return { statusCode: 400, body: 'Invalid JSON' } }

  const { tipo, email, whatsapp, nome, nomeLoja, canal = 'ambos' } = body

  if (!tipo || !nome || !nomeLoja) {
    return { statusCode: 400, body: JSON.stringify({ error: 'tipo, nome e nomeLoja são obrigatórios' }) }
  }

  const template = TEMPLATES[tipo]?.(nome, nomeLoja)
  if (!template) {
    return { statusCode: 400, body: JSON.stringify({ error: `Tipo inválido: ${tipo}` }) }
  }

  const resultados = {}

  if ((canal === 'email' || canal === 'ambos') && email) {
    resultados.email = await sendEmail(email, template.subject, template.html)
  }

  if ((canal === 'whatsapp' || canal === 'ambos') && whatsapp) {
    resultados.whatsapp = await sendWhatsApp(whatsapp, template.whatsapp)
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, resultados }),
  }
}
