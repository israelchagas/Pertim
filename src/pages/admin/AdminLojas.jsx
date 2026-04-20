import { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, Search, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LOJAS } from '../../lib/mockData'

export default function AdminLojas() {
  const [lojas, setLojas] = useState(
    LOJAS.map(l => ({ ...l, status: 'ativo', plano: 'vizinho', categoria_slug: l.categoria.slug }))
  )
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroPlano, setFiltroPlano] = useState('todos')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    supabase
      .from('lojas')
      .select('*, categorias(*)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setLojas(data.map(l => ({
            ...l,
            categoria: { emoji: l.categorias?.emoji || '🏪', nome: l.categorias?.nome || 'Outros', slug: l.categorias?.slug || 'outros' },
          })))
        }
        setLoading(false)
      })
  }, [])

  const aprovar = async (id) => {
    const { error } = await supabase.from('lojas').update({ status: 'ativo' }).eq('id', id)
    if (!error) { setLojas(prev => prev.map(l => l.id === id ? { ...l, status: 'ativo' } : l)); showToast('✅ Loja aprovada!') }
  }

  const rejeitar = async (id) => {
    const { error } = await supabase.from('lojas').update({ status: 'inativo' }).eq('id', id)
    if (!error) { setLojas(prev => prev.map(l => l.id === id ? { ...l, status: 'inativo' } : l)); showToast('❌ Loja rejeitada') }
  }

  const toggleAberta = async (id, atual) => {
    const { error } = await supabase.from('lojas').update({ aberta: !atual }).eq('id', id)
    if (!error) setLojas(prev => prev.map(l => l.id === id ? { ...l, aberta: !atual } : l))
  }

  const excluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta loja?')) return
    const { error } = await supabase.from('lojas').delete().eq('id', id)
    if (!error) { setLojas(prev => prev.filter(l => l.id !== id)); showToast('🗑️ Loja removida') }
  }

  const filtradas = lojas.filter(l => {
    if (filtroStatus !== 'todos' && l.status !== filtroStatus) return false
    if (filtroPlano !== 'todos' && l.plano !== filtroPlano) return false
    if (search && !l.nome.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="admin-main">
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            Lojas <span style={{ color: '#94a3b8', fontWeight: 500 }}>({filtradas.length})</span>
          </div>
          <button className="admin-action-btn primary"><Plus size={14} /> Nova loja</button>
        </div>

        <div className="admin-filters">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="admin-search-input"
              style={{ paddingLeft: 32 }}
              placeholder="Buscar por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-filter-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="pendente">Pendente</option>
            <option value="inativo">Inativo</option>
          </select>
          <select className="admin-filter-select" value={filtroPlano} onChange={e => setFiltroPlano(e.target.value)}>
            <option value="todos">Todos os planos</option>
            <option value="vizinho">Vizinho (grátis)</option>
            <option value="aberto">Aberto (R$29)</option>
            <option value="radar">Radar (R$79)</option>
          </select>
          {loading && <span style={{ fontSize: '.8rem', color: '#94a3b8' }}>Carregando do Supabase...</span>}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Loja</th>
                <th>WhatsApp</th>
                <th>Bairro</th>
                <th>Status</th>
                <th>Plano</th>
                <th>Aberta</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Nenhuma loja encontrada.
                  </td>
                </tr>
              ) : filtradas.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.3rem' }}>{l.categoria?.emoji || '🏪'}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{l.nome}</div>
                        <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{l.endereco || l.categoria?.nome}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <a href={`https://wa.me/55${l.whatsapp}`} target="_blank" style={{ color: '#25D366', fontWeight: 700, fontSize: '.82rem' }}>
                      {l.whatsapp}
                    </a>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '.82rem' }}>{l.bairro || 'Riacho Fundo 1'}</td>
                  <td>
                    <span className={`badge-status-${l.status || 'ativo'}`}>
                      {(l.status || 'ativo').charAt(0).toUpperCase() + (l.status || 'ativo').slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-plano-${l.plano || 'vizinho'}`}>
                      {(l.plano || 'vizinho').charAt(0).toUpperCase() + (l.plano || 'vizinho').slice(1)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleAberta(l.id, l.aberta)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: l.aberta ? '#10b981' : '#cbd5e1', padding: 0 }}
                    >
                      {l.aberta ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {l.status === 'pendente' && (
                      <>
                        <button className="admin-action-btn primary" onClick={() => aprovar(l.id)}>
                          <CheckCircle size={12} /> Aprovar
                        </button>
                        <button className="admin-action-btn danger" onClick={() => rejeitar(l.id)}>
                          <XCircle size={12} /> Rejeitar
                        </button>
                      </>
                    )}
                    <button className="admin-action-btn"><Eye size={13} /></button>
                    <button className="admin-action-btn danger" onClick={() => excluir(l.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
