export async function sendEmail(to, subject, html) {
  const res = await fetch('/.netlify/functions/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  })
  if (!res.ok) throw new Error(`Email error ${res.status}`)
  return res.json()
}

export function emailBoasVindas(nomeLoja, nomeProprietario) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
    <div style="background:#10B981;padding:32px 40px;text-align:center">
      <div style="font-size:2rem;font-weight:900;color:#fff;letter-spacing:-.03em">
        Pertim<span style="color:rgba(255,255,255,.6)">.</span>
      </div>
      <div style="color:rgba(255,255,255,.8);font-size:.9rem;margin-top:6px">O bairro na palma da mão</div>
    </div>
    <div style="padding:40px">
      <h1 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 12px">
        Bem-vindo ao Pertim, ${nomeProprietario}! 🎉
      </h1>
      <p style="color:#475569;line-height:1.6;margin:0 0 24px">
        Sua loja <strong>${nomeLoja}</strong> foi cadastrada com sucesso e está em análise.
        Em até <strong>24 horas</strong> nossa equipe irá aprovar e você já aparecerá para os moradores do bairro.
      </p>
      <div style="background:#f1fdf7;border:1px solid #a7f3d0;border-radius:12px;padding:20px;margin-bottom:28px">
        <div style="font-weight:700;color:#065f46;margin-bottom:8px">📋 Próximos passos:</div>
        <ul style="margin:0;padding-left:20px;color:#047857;font-size:.9rem;line-height:1.8">
          <li>Aguarde a aprovação (até 24h)</li>
          <li>Acesse seu painel em pertim.online/lojista</li>
          <li>Adicione seus produtos e horários</li>
          <li>Marque sua loja como Aberta quando estiver pronto</li>
        </ul>
      </div>
      <a href="https://pertim.online/lojista"
         style="display:block;background:#10B981;color:#fff;text-align:center;padding:16px;border-radius:10px;font-weight:700;text-decoration:none;font-size:1rem">
        Acessar meu painel →
      </a>
    </div>
    <div style="padding:20px 40px;border-top:1px solid #f1f5f9;text-align:center">
      <p style="font-size:.75rem;color:#94a3b8;margin:0">
        Pertim · Riacho Fundo 1, DF ·
        <a href="https://pertim.online" style="color:#10B981">pertim.online</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

export function emailNovoLead(nomeLoja, whatsappLojista) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
    <div style="background:#0f172a;padding:32px 40px;text-align:center">
      <div style="font-size:2rem;font-weight:900;color:#fff">Pertim<span style="color:#10B981">.</span></div>
    </div>
    <div style="padding:40px">
      <h1 style="font-size:1.3rem;font-weight:800;color:#0f172a;margin:0 0 12px">
        🔔 Nova loja aguardando aprovação
      </h1>
      <p style="color:#475569;line-height:1.6;margin:0 0 20px">
        A loja <strong>${nomeLoja}</strong> acabou de se cadastrar no Pertim e aguarda aprovação.
      </p>
      <a href="https://pertim.online/admin/lojas"
         style="display:block;background:#10B981;color:#fff;text-align:center;padding:16px;border-radius:10px;font-weight:700;text-decoration:none">
        Ver no painel admin →
      </a>
    </div>
  </div>
</body>
</html>`
}
