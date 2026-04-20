import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, MessageCircle, TrendingUp, Bell, ChevronRight, Package } from 'lucide-react'
import { LOJAS } from '../../lib/mockData'

const LOJA_DEMO = LOJAS[0]

export default function Dashboard() {
  const navigate = useNavigate()
  const [aberta, setAberta] = useState(true)
  const [toast, setToast] = useState('')
  const [loja] = useState(LOJA_DEMO)

  const toggleAberta = () => {
    const novoStatus = !aberta
    setAberta(novoStatus)
    setToast(novoStatus ? '✅ Loja marcada como ABERTA' : '🔴 Loja marcada como FECHADA')
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <>
      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--slate-200)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>Pertim<span style={{ color: 'var(--green)' }}>.</span></div>
          <div style={{ fontSize: '.72rem', color: 'var(--slate-400)' }}>Painel do lojista</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
          <Bell size={22} />
        </button>
      </div>

      {/* Saudação */}
      <div className="merchant-greeting">
        <h2>Olá, {loja.nome.split(' ')[0]}! 👋</h2>
        <p>Hoje é um ótimo dia para vender.</p>
      </div>

      {/* Toggle principal — OPEN/CLOSE */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <button
          className={`merchant-toggle ${aberta ? 'open' : ''}`}
          onClick={toggleAberta}
          style={{ width: '100%', textAlign: 'center', fontFamily: 'inherit' }}
        >
          <div className="toggle-label">Status da loja agora</div>
          <div className="toggle-status">
            {aberta ? '🟢 Minha loja está ABERTA' : '🔴 Minha loja está FECHADA'}
          </div>
          <div className={`toggle-switch ${aberta ? 'on' : ''}`}>
            <div className="toggle-thumb" />
          </div>
          <div style={{ fontSize: '.75rem', color: aberta ? 'var(--green-dark)' : 'var(--slate-400)', marginTop: 10, fontWeight: 600 }}>
            {aberta ? 'Visível para todos os moradores do bairro' : 'Sua loja está oculta nos resultados'}
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: 'var(--green)' }}>
            <Eye size={18} />
          </div>
          <div className="num">24</div>
          <div className="lbl">Visualizações hoje</div>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6, color: '#25D366' }}>
            <MessageCircle size={18} />
          </div>
          <div className="num">3</div>
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
          { icon: '🕐', label: 'Horários', action: () => navigate('/lojista/perfil') },
          { icon: '📊', label: 'Relatórios', action: () => {} },
          { icon: '⭐', label: 'Upgrade', action: () => navigate('/lojista/plano') },
          { icon: '🔗', label: 'Meu Link', action: () => {} },
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

      <div className="products-container">
        {loja.produtos.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--slate-400)' }}>
            <Package size={32} style={{ margin: '0 auto 12px', opacity: .4 }} />
            <p style={{ fontSize: '.88rem' }}>Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          loja.produtos.map((p, i) => (
            <div key={p.id} className="product-card" style={{ borderBottom: i < loja.produtos.length - 1 ? '1px solid var(--slate-200)' : 'none' }}>
              <div className="product-emoji">{p.emoji}</div>
              <div className="product-info">
                <div className="product-name">{p.nome}</div>
                <div className="product-price">
                  {p.preco > 0 ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Preço não informado'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '.7rem', fontWeight: 700, color: p.disponivel ? 'var(--green-dark)' : 'var(--slate-400)', background: p.disponivel ? 'var(--green-light)' : 'var(--bg)', padding: '4px 10px', borderRadius: 'var(--r-full)' }}>
                  {p.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Banner plano */}
      <div style={{ margin: '16px', background: 'var(--navy)', borderRadius: 'var(--r-lg)', padding: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle at top right, rgba(16,185,129,.3) 0%, transparent 70%)' }} />
        <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          Plano Vizinho (Grátis)
        </div>
        <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: 8 }}>
          Faça upgrade para o Plano Aberto
        </div>
        <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.7)', marginBottom: 16 }}>
          Apareça em destaque e receba 3x mais visualizações.
        </div>
        <button className="btn btn-green btn-sm">
          Ver planos por R$29/mês →
        </button>
      </div>

      <div style={{ height: 16 }} />

      {/* FAB */}
      <button
        className="fab"
        onClick={() => navigate('/lojista/produtos')}
        title="Adicionar produto"
      >
        <Plus size={24} />
      </button>
    </>
  )
}
