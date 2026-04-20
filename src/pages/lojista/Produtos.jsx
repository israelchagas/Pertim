import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight, Camera } from 'lucide-react'
import { LOJAS } from '../../lib/mockData'

const CATEGORIAS_PROD = ['🍞 Alimentação', '💊 Saúde', '🔧 Ferramentas', '🧴 Higiene', '🎁 Outros']

export default function Produtos() {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState(LOJAS[0].produtos)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', preco: '', emoji: '🛍️', disponivel: true })
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const toggleDisponivel = (id) => {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, disponivel: !p.disponivel } : p))
  }

  const deletarProduto = (id) => {
    if (confirm('Remover este produto?')) {
      setProdutos(prev => prev.filter(p => p.id !== id))
      showToast('🗑️ Produto removido')
    }
  }

  const handleAddProduto = (e) => {
    e.preventDefault()
    const novo = {
      id: `p${Date.now()}`,
      nome: form.nome,
      preco: parseFloat(form.preco) || 0,
      emoji: form.emoji,
      disponivel: true,
    }
    setProdutos(prev => [novo, ...prev])
    setForm({ nome: '', preco: '', emoji: '🛍️', disponivel: true })
    setShowForm(false)
    showToast('✅ Produto adicionado!')
  }

  const EMOJIS = ['🍞', '🥩', '🥛', '🍕', '🍔', '🥗', '💊', '🧴', '🔧', '⚡', '🎂', '🛍️', '📦', '🌿', '🥬', '🍌']

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div className="app-page-header">
        <button className="back-btn" onClick={() => navigate('/lojista')}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-page-title">Meus Produtos</span>
        <button
          className="btn btn-green btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={15} /> Adicionar
        </button>
      </div>

      {/* Formulário de novo produto */}
      {showForm && (
        <div style={{ background: 'var(--green-light)', border: '1.5px solid rgba(16,185,129,.25)', borderRadius: 'var(--r-lg)', margin: '16px', padding: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 16, fontSize: '.95rem' }}>Novo produto</div>
          <form onSubmit={handleAddProduto}>
            {/* Emoji picker */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--slate-700)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Ícone</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    style={{
                      fontSize: '1.4rem',
                      padding: '6px 8px',
                      borderRadius: 8,
                      border: form.emoji === e ? '2px solid var(--green)' : '2px solid transparent',
                      background: form.emoji === e ? 'var(--white)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="app-form-field" style={{ marginBottom: 12 }}>
              <label>Nome do produto *</label>
              <input
                type="text"
                placeholder="Ex: Pão Francês"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required
              />
            </div>

            <div className="app-form-field" style={{ marginBottom: 16 }}>
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00 (opcional)"
                value={form.preco}
                onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-green btn-md" style={{ flex: 1 }}>
                Salvar produto
              </button>
              <button type="button" className="btn btn-ghost btn-md" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de produtos */}
      <div style={{ padding: '8px 16px 0', fontSize: '.78rem', color: 'var(--slate-400)', fontWeight: 600 }}>
        {produtos.length} produto{produtos.length !== 1 ? 's' : ''} cadastrado{produtos.length !== 1 ? 's' : ''}
      </div>

      <div className="products-container" style={{ margin: '12px 16px' }}>
        {produtos.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate-400)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: '.9rem' }}>Nenhum produto ainda.<br />Adicione seu primeiro produto!</p>
          </div>
        ) : (
          produtos.map((p, i) => (
            <div
              key={p.id}
              className="product-card"
              style={{
                borderBottom: i < produtos.length - 1 ? '1px solid var(--slate-200)' : 'none',
                opacity: p.disponivel ? 1 : 0.6,
              }}
            >
              <div className="product-emoji">{p.emoji}</div>
              <div className="product-info">
                <div className="product-name" style={{ textDecoration: p.disponivel ? 'none' : 'line-through' }}>
                  {p.nome}
                </div>
                <div className="product-price">
                  {p.preco > 0 ? p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => toggleDisponivel(p.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.disponivel ? 'var(--green)' : 'var(--slate-300)', padding: 4 }}
                  title={p.disponivel ? 'Marcar como indisponível' : 'Marcar como disponível'}
                >
                  {p.disponivel ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
                <button
                  onClick={() => deletarProduto(p.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-300)', padding: 4 }}
                  title="Remover produto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '0 16px', fontSize: '.78rem', color: 'var(--slate-400)', lineHeight: 1.7 }}>
        💡 Toque no toggle para marcar um produto como disponível ou indisponível em tempo real.
      </div>

      <div style={{ height: 24 }} />
    </>
  )
}
