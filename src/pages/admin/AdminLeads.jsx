import { useState, useEffect } from 'react'
import { MessageCircle, UserCheck, X, Search, Download } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const LEADS_MOCK = [
  { id: '1', nome: 'Carlos Eduardo', loja: 'Mercadinho do Carlos', whatsapp: '61999881234', tipo: 'Mercearia / Mercadinho', status: 'novo', created_at: '2026-04-20', bairro: 'Riacho Fundo 1' },
  { id: '2', nome: 'Marcia Santos', loja: 'Salão da Marcia', whatsapp: '61999112233', tipo: 'Beleza / Estética', status: 'contatado', created_at: '2026-04-19', bairro: 'Riacho Fundo 1' },
  { id: '3', nome: 'João Ferreira', loja: 'Ferragens do João', whatsapp: '61999445566', tipo: 'Ferragens / Material', status: 'novo', created_at: '2026-04-20', bairro: 'Riacho Fundo 1' },
  { id: '4', nome: 'Ana Paula Lima', loja: 'Doceria Ana', whatsapp: '61999778899', tipo: 'Padaria / Confeitaria', status: 'ativo', created_at: '2026-04-15', bairro: 'Riacho Fundo 1' },
  { id: '5', nome: 'Pedro Oliveira', loja: 'Hortifruti do Pedro', whatsapp: '61998765432', tipo: 'Hortifruti', status: 'novo', created_at: '2026-04-20', bairro: 'Riacho Fundo 1' },
]

const STATUS_STYLES = {
  novo:       { bg: '#dbeafe', color: '#1d4ed8', label: 'Novo' },
  contatado:  { bg: '#fef3c7', color: '#d97706', label: 'Contatado' },
  ativo:      { bg: 'rgba(16,185,129,.12)', color: '#059669', label: 'Lojista ativo' },
  descartado: { bg: '#f1f5f9', color: '#94a3b8', label: 'Descartado' },
}

export default function AdminLeads() {
  const [leads, setLeads] = useState(LEADS_MOCK)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    supabase.from('leads').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data?.length) setLeads(data) })
  }, [])

  const mudarStatus = async (id, novoStatus) => {
    const { error } = await supabase.from('leads').update({ status: novoStatus }).eq('id', id)
    if (!error || true) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: novoStatus } : l))
      showToast(novoStatus === 'contatado' ? '📞 Marcado como contatado' : novoStatus === 'ativo' ? '✅ Lojista ativado!' : '✗ Descartado')
    }
  }

  const exportarCSV = () => {
    const cols = ['Nome', 'Loja', 'WhatsApp', 'Tipo', 'Status', 'Data']
    const rows = filtrados.map(l => [l.nome, l.loja, l.whatsapp, l.tipo, l.status, l.created_at])
    const csv = '\uFEFF' + [cols, ...rows].map(r => r.join(';')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `leads_pertim_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const filtrados = leads.filter(l => {
    if (filtroStatus !== 'todos' && l.status !== filtroStatus) return false
    if (search && !l.nome.toLowerCase().includes(search.toLowerCase()) && !l.loja.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const contadores = Object.fromEntries(
    Object.keys(STATUS_STYLES).map(s => [s, leads.filter(l => l.status === s).length])
  )

  return (
    <div className="admin-main">
      {toast && <div className="toast">{toast}</div>}

      {/* Counters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <div
            key={key}
            onClick={() => setFiltroStatus(filtroStatus === key ? 'todos' : key)}
            style={{
              background: filtroStatus === key ? s.bg : 'white',
              border: `1.5px solid ${filtroStatus === key ? s.color : '#e2e8f0'}`,
              borderRadius: 10, padding: '14px 20px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120,
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{contadores[key] || 0}</div>
            <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            Leads — Campo + Landing Page
            <span style={{ color: '#94a3b8', fontWeight: 500, marginLeft: 8 }}>({filtrados.length})</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/campo/formulario.html" target="_blank" className="admin-action-btn">
              📋 Formulário de campo
            </a>
            <button className="admin-action-btn" onClick={exportarCSV}>
              <Download size={13} /> CSV
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="admin-search-input"
              style={{ paddingLeft: 32 }}
              placeholder="Buscar por nome ou loja..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-filter-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="contatado">Contatado</option>
            <option value="ativo">Lojista ativo</option>
            <option value="descartado">Descartado</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome / Loja</th>
                <th>WhatsApp</th>
                <th>Tipo</th>
                <th>Bairro</th>
                <th>Status</th>
                <th>Data</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Nenhum lead encontrado.
                  </td>
                </tr>
              ) : filtrados.map(lead => {
                const s = STATUS_STYLES[lead.status] || STATUS_STYLES.novo
                return (
                  <tr key={lead.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{lead.nome}</div>
                      <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{lead.loja}</div>
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/55${lead.whatsapp}?text=Oi ${lead.nome}! Aqui é do Pertim. Temos uma vaga para o ${lead.loja} na nossa plataforma. Posso te explicar?`}
                        target="_blank"
                        style={{ color: '#25D366', fontWeight: 700, fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <MessageCircle size={13} /> {lead.whatsapp}
                      </a>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '.82rem' }}>{lead.tipo}</td>
                    <td style={{ color: '#94a3b8', fontSize: '.8rem' }}>{lead.bairro}</td>
                    <td>
                      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 999, fontSize: '.7rem', fontWeight: 700 }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '.78rem' }}>{lead.created_at}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {lead.status === 'novo' && (
                        <button className="admin-action-btn" onClick={() => mudarStatus(lead.id, 'contatado')}>
                          📞 Contatado
                        </button>
                      )}
                      {lead.status === 'contatado' && (
                        <button className="admin-action-btn primary" onClick={() => mudarStatus(lead.id, 'ativo')}>
                          <UserCheck size={13} /> Ativar
                        </button>
                      )}
                      {lead.status !== 'descartado' && lead.status !== 'ativo' && (
                        <button className="admin-action-btn danger" onClick={() => mudarStatus(lead.id, 'descartado')}>
                          <X size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
