import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const EMOJIS = ['🍞', '🥩', '🥛', '🍕', '🍔', '🥗', '💊', '🧴', '🔧', '⚡', '🎂', '🛍️', '📦', '🌿', '🥬', '🍌', '🧀', '🍗', '💧', '🥤', '🍚', '🍫', '🍓', '🫐', '🥟', '🍅', '🔩', '🔌']

export default function Produtos() {
  const navigate = useNavigate()
  const [lojaId, setLojaId]   = useState(null)
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({ nome: '', preco: '', emoji: '🛍️' })
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/lojista/login'); return }

      const { data: loja } = await supabase
        .from('lojas')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      if (!loja) { navigate('/lojista'); return }
      setLojaId(loja.id)

      const { data: prods } = await supabase
        .from('produtos')
        .select('*')
        .eq('loja_id', loja.id)
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false })

      setProdutos(prods || [])
      setLoading(false)
    })
  }, [])

  const handleAddProduto = async (e) => {
    e.preventDefault()
    if (!lojaId) return
    setSalvando(true)
    try {
      const { data, error } = await supabase.from('produtos').insert({
        loja_id:   lojaId,
        nome:      form.nome,
        preco:     parseFloat(form.preco) || 0,
        emoji:     form.emoji,
        disponivel: true,
      }).select().single()

      if (error) throw error
      setProdutos(prev => [data, ...prev])
      setForm({ nome: '', preco: '', emoji: '🛍️' })
      setShowForm(false)
      showToast('✅ Produto adicionado!')
    } catch (err) {
      showToast('❌ ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  const toggleDisponivel = async (p) => {
    const novoStatus = !p.disponivel
    setProdutos(prev => prev.map(x => x.id === p.id ? { ...x, disponivel: novoStatus } : x))
    const { error } = await supabase.from('produtos').update({ disponivel: novoStatus }).eq('id', p.id)
    if (error) {
      setProdutos(prev => prev.map(x => x.id === p.id ? { ...x, disponivel: p.disponivel } : x))
      showToast('❌ Erro ao atualizar')
    }
  }

  const deletarProduto = async (id) => {
    if (!confirm('Remover este produto?')) return
    setProdutos(prev => prev.filter(p => p.id !== id))
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) {
      showToast('❌ Erro ao remover')
    } else {
      showToast('🗑️ Produto removido')
    }
  }

  if (loading) return <div style={{ height: '100%' }} />

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

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

      {showForm && (
        <div style={{ background: 'var(--green-light)', border: '1.5px solid rgba(16,185,129,.25)', borderRadius: 'var(--r-lg)', margin: '16px', padding: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 16, fontSize: '.95rem' }}>Novo produto</div>
          <form onSubmit={handleAddProduto}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--slate-700)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>Ícone</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    style={{ fontSize: '1.4rem', padding: '6px 8px', borderRadius: 8, border: form.emoji === e ? '2px solid var(--green)' : '2px solid transparent', background: form.emoji === e ? 'var(--white)' : 'transparent', cursor: 'pointer' }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="app-form-field" style={{ marginBottom: 12 }}>
              <label>Nome do produto *</label>
              <input type="text" placeholder="Ex: Pão Francês" value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
            </div>

            <div className="app-form-field" style={{ marginBottom: 16 }}>
              <label>Preço (R$)</label>
              <input type="number" step="0.01" min="0" placeholder="0,00 (opcional)" value={form.preco}
                onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-green btn-md" style={{ flex: 1 }} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar produto'}
              </button>
              <button type="button" className="btn btn-ghost btn-md" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
            <div key={p.id} className="product-card"
              style={{ borderBottom: i < produtos.length - 1 ? '1px solid var(--slate-200)' : 'none', opacity: p.disponivel ? 1 : 0.6 }}>
              <div className="product-emoji">{p.emoji}</div>
              <div className="product-info">
                <div className="product-name" style={{ textDecoration: p.disponivel ? 'none' : 'line-through' }}>{p.nome}</div>
                <div className="product-price">
                  {p.preco > 0 ? Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sob consulta'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => toggleDisponivel(p)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.disponivel ? 'var(--green)' : 'var(--slate-300)', padding: 4 }}
                  title={p.disponivel ? 'Marcar como indisponível' : 'Marcar como disponível'}>
                  {p.disponivel ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
                <button onClick={() => deletarProduto(p.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-300)', padding: 4 }}
                  title="Remover produto">
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
