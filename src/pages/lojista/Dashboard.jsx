import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, MessageCircle, Bell, ChevronRight, Package, LogIn, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const ADMIN_WA = (import.meta.env.VITE_ADMIN_WHATSAPP || '18259713697').replace(/\D/g, '')

const PLANOS = [
  {
    slug: 'vizinho', nome: 'Vizinho', preco: 'Grátis',
    cor: 'var(--slate-200)', corTexto: 'var(--slate-700)',
    items: ['Perfil básico da loja', 'Até 10 produtos', 'Link compartilhável', 'Aparece na busca do bairro'],
    acao: null,
  },
  {
    slug: 'aberto', nome: 'Aberto', preco: 'R$29/mês',
    cor: 'var(--green)', corTexto: 'white',
    destaque: true,
    items: ['Tudo do Vizinho', 'Destaque nos resultados', 'Produtos ilimitados', 'Estatísticas avançadas', 'Suporte prioritário'],
    acao: `https://wa.me/55${ADMIN_WA}?text=Quero+assinar+o+Plano+Aberto+do+Pertim`,
  },
  {
    slug: 'radar', nome: 'Radar', preco: 'R$79/mês',
    cor: 'var(--navy)', corTexto: 'white',
    items: ['Tudo do Aberto', 'Banner na tela inicial', 'Notificações push aos moradores', 'Relatórios semanais por WhatsApp'],
    acao: `https://wa.me/55${ADMIN_WA}?text=Quero+assinar+o+Plano+Radar+do+Pertim`,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loja, setLoja] = useState({ nome: '', produtos: [] })
  const [lojaId, setLojaId] = useState(null)
  const [aberta, setAberta] = useState(false)
  const [toast, setToast] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [stats, setStats] = useState({ views: 0, whatsapp: 0 })
  const [showUpgrade, setShowUpgrade] = useState(false)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { setDemoMode(true); return }

      setUser(session.user)
      supabase
        .from('lojas')
        .select('*, categorias(*), produtos(*)')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setLojaId(data.id)
            setAberta(data.aberta ?? false)
            setLoja({
              id: data.id,
              nome: data.nome || '',
              whatsapp: data.whatsapp || '',
              produtos: (data.produtos || []).map(p => ({
                id: p.id, nome: p.nome, preco: p.preco || 0,
                emoji: p.emoji || '🛍️', disponivel: p.disponivel ?? true,
              })),
            })
            setStats({ views: data.visualizacoes || 0, whatsapp: data.cliques_whatsapp || 0 })
          } else {
            setDemoMode(true)
          }
        })
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  const toggleAberta = async () => {
    const novoStatus = !aberta
    setAberta(novoStatus)
    showToast(novoStatus ? '✅ Loja marcada como ABERTA' : '🔴 Loja marcada como FECHADA')

    if (lojaId) {
      const { error } = await supabase.from('lojas').update({ aberta: novoStatus }).eq('id', lojaId)
      if (error) { setAberta(!novoStatus); showToast('❌ Erro ao atualizar status') }
    }
  }

  const primeiroNome = (loja.nome || '').split(' ')[0] || 'lojista'

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--slate-200)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>Pertim<span style={{ color: 'var(--green)' }}>.</span></div>
          <div style={{ fontSize: '.68rem', color: 'var(--slate-400)', fontWeight: 500 }}>
            {demoMode ? '⚡ Modo demo — ' : ''}Painel do lojista
          </div>
        </div>
        {demoMode ? (
          <button className="btn btn-green btn-sm" onClick={() => navigate('/lojista/login')}>
            <LogIn size={15} /> Entrar
          </button>
        ) : (
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
            <Bell size={22} />
          </button>
        )}
      </div>

      {/* Banner demo */}
      {demoMode && (
        <div style={{ background: 'var(--amber-light)', border: '1px solid rgba(245,158,11,.3)', margin: '12px 16px', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: '.82rem', color: '#92400e', fontWeight: 600 }}>
          ⚡ Você está em modo demo. <a onClick={() => navigate('/lojista/login')} style={{ color: 'var(--amber)', cursor: 'pointer', textDecoration: 'underline' }}>Faça login</a> para gerenciar sua loja real.
        </div>
      )}

      {/* Saudação */}
      <div className="merchant-greeting">
        <h2>Olá, {primeiroNome}! 👋</h2>
        <p>Hoje é um ótimo dia para vender.</p>
      </div>

      {/* Toggle ABERTA/FECHADA — ação principal */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <button
          className={`merchant-toggle ${aberta ? 'open' : ''}`}
          onClick={toggleAberta}
          style={{ width: '100%', fontFamily: 'inherit' }}
        >
          <div className="toggle-label">Status da loja agora</div>
          <div className="toggle-status">
            {aberta ? '🟢 Minha loja está ABERTA' : '🔴 Minha loja está FECHADA'}
          </div>
          <div className={`toggle-switch ${aberta ? 'on' : ''}`}>
            <div className="toggle-thumb" />
          </div>
          <div style={{ fontSize: '.72rem', color: aberta ? 'var(--green-dark)' : 'var(--slate-400)', marginTop: 10, fontWeight: 600 }}>
            {aberta ? 'Visível para todos os moradores do bairro' : 'Sua loja está oculta nos resultados'}
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: 'var(--green)' }}><Eye size={18} /></div>
          <div className="num">{stats.views}</div>
          <div className="lbl">Visualizações hoje</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: '#25D366' }}><MessageCircle size={18} /></div>
          <div className="num">{stats.whatsapp}</div>
          <div className="lbl">Cliques WhatsApp hoje</div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="section-header" style={{ paddingBottom: 4 }}>
        <h3>Ações rápidas</h3>
      </div>
      <div className="quick-actions">
        {[
          { icon: '📸', label: 'Add Produto', action: () => navigate('/lojista/produtos') },
          { icon: '🕐', label: 'Horários',    action: () => navigate('/lojista/perfil') },
          { icon: '👤', label: 'Meu Perfil',  action: () => navigate('/lojista/perfil') },
          { icon: '⭐', label: 'Upgrade',     action: () => setShowUpgrade(true) },
          { icon: '🔗', label: 'Meu Link',    action: () => {
            const link = `https://pertim.online/app/loja/${lojaId}`
            navigator.clipboard?.writeText(link).then(() => showToast('🔗 Link copiado!')).catch(() => showToast(link))
          }},
        ].map((a, i) => (
          <button key={i} className="quick-action" onClick={a.action}>
            <span className="qa-icon">{a.icon}</span>
            <span className="qa-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Produtos recentes */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <h3>Produtos ativos</h3>
        <a onClick={() => navigate('/lojista/produtos')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
          Ver todos <ChevronRight size={14} />
        </a>
      </div>

      <div className="products-container" style={{ margin: '0 16px' }}>
        {loja.produtos.length === 0 ? (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--slate-400)' }}>
            <Package size={28} style={{ margin: '0 auto 10px', opacity: .4 }} />
            <p style={{ fontSize: '.85rem' }}>Nenhum produto ainda.</p>
          </div>
        ) : (
          loja.produtos.slice(0, 4).map((p, i) => (
            <div key={p.id} className="product-card" style={{ borderBottom: i < Math.min(loja.produtos.length, 4) - 1 ? '1px solid var(--slate-200)' : 'none' }}>
              <div className="product-emoji">{p.emoji}</div>
              <div className="product-info">
                <div className="product-name">{p.nome}</div>
                <div className="product-price">
                  {p.preco > 0 ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'}
                </div>
              </div>
              <span style={{ fontSize: '.68rem', fontWeight: 700, color: p.disponivel ? 'var(--green-dark)' : 'var(--slate-400)', background: p.disponivel ? 'var(--green-light)' : 'var(--bg)', padding: '3px 9px', borderRadius: 'var(--r-full)', flexShrink: 0 }}>
                {p.disponivel ? 'Disponível' : 'Esgotado'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Banner upgrade */}
      <div style={{ margin: '16px', background: 'var(--navy)', borderRadius: 'var(--r-lg)', padding: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle at top right, rgba(16,185,129,.3) 0%, transparent 70%)' }} />
        <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Plano Vizinho (Grátis)</div>
        <div style={{ fontWeight: 800, fontSize: '.92rem', marginBottom: 6 }}>Upgrade para o Plano Aberto</div>
        <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.65)', marginBottom: 14 }}>Apareça em destaque e receba 3x mais visualizações.</div>
        <button className="btn btn-green btn-sm" onClick={() => setShowUpgrade(true)}>Ver planos · R$29/mês →</button>
      </div>

      <div style={{ height: 16 }} />
      <button className="fab" onClick={() => navigate('/lojista/produtos')} title="Adicionar produto">
        <Plus size={24} />
      </button>

      {/* Modal de planos */}
      {showUpgrade && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowUpgrade(false) }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--r-xl) var(--r-xl) 0 0', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: '24px 16px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Escolha seu plano</div>
                <div style={{ fontSize: '.78rem', color: 'var(--slate-400)' }}>Mais visibilidade, mais clientes</div>
              </div>
              <button onClick={() => setShowUpgrade(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PLANOS.map(p => (
                <div key={p.slug} style={{ border: p.destaque ? '2px solid var(--green)' : '1.5px solid var(--slate-200)', borderRadius: 'var(--r-lg)', padding: 16, position: 'relative' }}>
                  {p.destaque && (
                    <div style={{ position: 'absolute', top: -11, left: 16, background: 'var(--green)', color: 'white', fontSize: '.68rem', fontWeight: 800, padding: '2px 10px', borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      Mais popular
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '.95rem' }}>{p.nome}</div>
                      <div style={{ fontWeight: 900, fontSize: '1.2rem', color: p.destaque ? 'var(--green)' : 'var(--navy)' }}>{p.preco}</div>
                    </div>
                  </div>
                  <ul style={{ margin: '0 0 14px', paddingLeft: 18, color: 'var(--slate-600)', fontSize: '.82rem', lineHeight: 1.8 }}>
                    {p.items.map(it => <li key={it}>{it}</li>)}
                  </ul>
                  {p.acao ? (
                    <a href={p.acao} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', background: p.destaque ? 'var(--green)' : 'var(--navy)', color: 'white', textAlign: 'center', padding: '11px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: '.88rem', textDecoration: 'none' }}>
                      Assinar {p.nome} via WhatsApp →
                    </a>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '11px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: '.88rem', color: 'var(--slate-400)', background: 'var(--bg)' }}>
                      Plano atual
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
