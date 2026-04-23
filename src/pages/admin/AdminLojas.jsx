import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, CheckCircle, XCircle, ToggleLeft, ToggleRight, X, Mail, MessageCircle, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LOJAS } from '../../lib/mockData'

const CATEGORIAS = [
  { slug: 'mercado',   emoji: '🛒', nome: 'Mercado / Mercearia' },
  { slug: 'lanches',  emoji: '🍔', nome: 'Lanches / Restaurante' },
  { slug: 'farmacia', emoji: '💊', nome: 'Farmácia / Saúde' },
  { slug: 'beleza',   emoji: '💇', nome: 'Beleza / Barbearia' },
  { slug: 'pet',      emoji: '🐾', nome: 'Pet Shop' },
  { slug: 'eletro',   emoji: '📱', nome: 'Eletrônicos / Informática' },
  { slug: 'servicos', emoji: '🔧', nome: 'Serviços Gerais' },
  { slug: 'moda',     emoji: '👗', nome: 'Moda / Acessórios' },
  { slug: 'outros',   emoji: '✨', nome: 'Outros' },
]

const BAIRROS = ['Riacho Fundo 1', 'Riacho Fundo 2', 'Candangolândia', 'Núcleo Bandeirante', 'Park Way']
const FORM_VAZIO = { nomeLoja: '', categoria: 'outros', whatsapp: '', endereco: '', bairro: 'Riacho Fundo 1', status: 'ativo' }

/* ─── Campo de formulário reutilizável ─── */
function Campo({ label, children }) {
  return (
    <label style={{ fontSize: '.82rem', fontWeight: 700, color: '#475569', display: 'block' }}>
      {label}
      <div style={{ marginTop: 4 }}>{children}</div>
    </label>
  )
}

const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '.9rem', fontFamily: 'inherit', boxSizing: 'border-box' }

/* ─── Modal base ─── */
function Modal({ titulo, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>{titulo}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ─── Dropdown de notificações (fixed — não fica cortado pelo overflow da tabela) ─── */
function NotifDropdown({ loja, onNotif }) {
  const [pos, setPos] = useState(null)
  const btnRef = useRef(null)

  const opcoes = [
    { tipo: 'boasVindas', canal: 'email',    label: '📧 E-mail de boas-vindas' },
    { tipo: 'aprovacao',  canal: 'email',    label: '📧 E-mail de aprovação' },
    { tipo: 'lembrete',   canal: 'email',    label: '📧 Lembrete de produtos' },
    { tipo: 'boasVindas', canal: 'whatsapp', label: '💬 WhatsApp boas-vindas' },
    { tipo: 'aprovacao',  canal: 'whatsapp', label: '💬 WhatsApp aprovação' },
    { tipo: 'lembrete',   canal: 'whatsapp', label: '💬 WhatsApp lembrete' },
  ]

  const open = () => {
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
  }
  const close = () => setPos(null)

  return (
    <span style={{ display: 'inline-block' }}>
      <button ref={btnRef} className="admin-action-btn" onClick={open} title="Notificações"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        <Mail size={12} /><ChevronDown size={10} />
      </button>
      {pos && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1999 }} onClick={close} />
          <div style={{
            position: 'fixed', top: pos.top, right: pos.right,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,.18)', zIndex: 2000, minWidth: 230, overflow: 'hidden',
          }}>
            <div style={{ padding: '9px 14px', fontSize: '.7rem', fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '.05em', background: '#f8fafc' }}>
              Notificar — {loja.nome}
            </div>
            {opcoes.map((op, i) => (
              <button key={i} onClick={() => { close(); onNotif(op.tipo, op.canal) }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', borderBottom: i < opcoes.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', fontSize: '.84rem', fontWeight: 500, color: '#1e293b' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {op.label}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  )
}

export default function AdminLojas() {
  const [lojas, setLojas] = useState(
    LOJAS.map(l => ({ ...l, status: 'ativo', plano: 'vizinho', categoria_slug: l.categoria.slug }))
  )
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroPlano, setFiltroPlano]   = useState('todos')
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [toast, setToast]               = useState('')

  // modais
  const [modalNova, setModalNova]         = useState(false)
  const [lojaEditando, setLojaEditando]   = useState(null)   // null = fechado
  const [formNova, setFormNova]           = useState(FORM_VAZIO)
  const [formEdit, setFormEdit]           = useState({})
  const [erroNova, setErroNova]           = useState('')
  const [erroEdit, setErroEdit]           = useState('')
  const [salvando, setSalvando]           = useState(false)
  const [enviando, setEnviando]           = useState(false)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  /* ─── Carregar lojas ─── */
  useEffect(() => {
    supabase.from('lojas').select('*, categorias(*)').order('created_at', { ascending: false })
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

  /* ─── Ações diretas ─── */
  const aprovar = async (id) => {
    const { error } = await supabase.from('lojas').update({ status: 'ativo' }).eq('id', id)
    if (!error) { setLojas(p => p.map(l => l.id === id ? { ...l, status: 'ativo' } : l)); showToast('✅ Loja aprovada!') }
  }

  const rejeitar = async (id) => {
    const { error } = await supabase.from('lojas').update({ status: 'inativo' }).eq('id', id)
    if (!error) { setLojas(p => p.map(l => l.id === id ? { ...l, status: 'inativo' } : l)); showToast('❌ Loja rejeitada') }
  }

  const toggleAberta = async (id, atual) => {
    const { error } = await supabase.from('lojas').update({ aberta: !atual }).eq('id', id)
    if (!error) setLojas(p => p.map(l => l.id === id ? { ...l, aberta: !atual } : l))
  }

  const excluir = async (id) => {
    if (!confirm('Excluir esta loja permanentemente?')) return
    const { error } = await supabase.from('lojas').delete().eq('id', id)
    if (!error) { setLojas(p => p.filter(l => l.id !== id)); showToast('🗑️ Loja removida') }
  }

  /* ─── Criar loja ─── */
  const criarLoja = async () => {
    if (!formNova.nomeLoja.trim()) { setErroNova('Informe o nome da loja'); return }
    if (formNova.whatsapp.replace(/\D/g, '').length < 10) { setErroNova('WhatsApp inválido'); return }
    setSalvando(true); setErroNova('')
    try {
      const res = await fetch('/.netlify/functions/criar-loja-admin', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formNova),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro ao criar loja')
      if (data.loja) {
        const cat = CATEGORIAS.find(c => c.slug === formNova.categoria) || { emoji: '✨', nome: 'Outros', slug: formNova.categoria }
        setLojas(p => [{ ...data.loja, categoria: cat }, ...p])
      }
      setModalNova(false)
      showToast('✅ Loja criada!')
    } catch (err) { setErroNova(err.message) }
    finally { setSalvando(false) }
  }

  /* ─── Editar loja ─── */
  const abrirEdicao = (loja) => {
    setFormEdit({
      id: loja.id,
      nome: loja.nome || '',
      whatsapp: loja.whatsapp || '',
      endereco: loja.endereco || '',
      bairro: loja.bairro || 'Riacho Fundo 1',
      status: loja.status || 'ativo',
      plano: loja.plano || 'vizinho',
      categoria: loja.categoria?.slug || 'outros',
      email: loja.email || '',
    })
    setErroEdit('')
    setLojaEditando(loja)
  }

  const salvarEdicao = async () => {
    if (!formEdit.nome.trim()) { setErroEdit('Informe o nome da loja'); return }
    if (formEdit.whatsapp.replace(/\D/g, '').length < 10) { setErroEdit('WhatsApp inválido'); return }
    setSalvando(true); setErroEdit('')
    try {
      const catRes = await supabase.from('categorias').select('id').eq('slug', formEdit.categoria).single()
      const { error } = await supabase.from('lojas').update({
        nome: formEdit.nome,
        whatsapp: formEdit.whatsapp.replace(/\D/g, ''),
        endereco: formEdit.endereco,
        bairro: formEdit.bairro,
        status: formEdit.status,
        plano: formEdit.plano,
        categoria_id: catRes.data?.id || null,
      }).eq('id', formEdit.id)
      if (error) throw new Error(error.message)
      const cat = CATEGORIAS.find(c => c.slug === formEdit.categoria) || { emoji: '✨', nome: 'Outros', slug: formEdit.categoria }
      setLojas(p => p.map(l => l.id === formEdit.id ? { ...l, ...formEdit, nome: formEdit.nome, categoria: cat } : l))
      setLojaEditando(null)
      showToast('✅ Loja atualizada!')
    } catch (err) { setErroEdit(err.message) }
    finally { setSalvando(false) }
  }

  /* ─── Notificar lojista ─── */
  const notificar = async (loja, tipo, canal) => {
    const email   = loja.email || formEdit.email
    const wpp     = loja.whatsapp
    const nome    = loja.nome
    const nomeLoja = loja.nome

    if (canal === 'email' && !email) {
      showToast('⚠️ E-mail do lojista não cadastrado — edite a loja e informe o e-mail')
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/.netlify/functions/notificar-lojista', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, canal, email, whatsapp: wpp, nome, nomeLoja }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar')

      const labels = { boasVindas: 'boas-vindas', aprovacao: 'aprovação', lembrete: 'lembrete' }
      const canalLabel = canal === 'email' ? '📧 E-mail' : '💬 WhatsApp'
      showToast(`${canalLabel} de ${labels[tipo]} enviado!`)
    } catch (err) {
      showToast(`❌ ${err.message}`)
    } finally {
      setEnviando(false)
    }
  }

  const filtradas = lojas.filter(l => {
    if (filtroStatus !== 'todos' && l.status !== filtroStatus) return false
    if (filtroPlano !== 'todos' && l.plano !== filtroPlano) return false
    if (search && !l.nome?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <>
    <div className="admin-main">
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            Lojas <span style={{ color: '#94a3b8', fontWeight: 500 }}>({filtradas.length})</span>
          </div>
          <button className="admin-action-btn primary" onClick={() => { setFormNova(FORM_VAZIO); setErroNova(''); setModalNova(true) }}>
            <Plus size={14} /> Nova loja
          </button>
        </div>

        <div className="admin-filters">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input className="admin-search-input" style={{ paddingLeft: 32 }} placeholder="Buscar por nome..."
              value={search} onChange={e => setSearch(e.target.value)} />
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
          {loading && <span style={{ fontSize: '.8rem', color: '#94a3b8' }}>Carregando...</span>}
          {enviando && <span style={{ fontSize: '.8rem', color: '#10b981' }}>Enviando notificação...</span>}
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
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Nenhuma loja encontrada.</td></tr>
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
                    <a href={`https://wa.me/55${l.whatsapp}`} target="_blank"
                      style={{ color: '#25D366', fontWeight: 700, fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MessageCircle size={12} /> {l.whatsapp}
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
                    <button onClick={() => toggleAberta(l.id, l.aberta)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: l.aberta ? '#10b981' : '#cbd5e1', padding: 0 }}>
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
                    {/* Notificações */}
                    <NotifDropdown loja={l} onNotif={(tipo, canal) => notificar(l, tipo, canal)} />
                    {/* Editar */}
                    <button className="admin-action-btn" onClick={() => abrirEdicao(l)} title="Editar">
                      <Pencil size={13} />
                    </button>
                    {/* Excluir */}
                    <button className="admin-action-btn danger" onClick={() => excluir(l.id)} title="Excluir">
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

    {/* ─── Modal: Nova loja ─── */}
    {modalNova && (
      <Modal titulo="Nova loja" onClose={() => setModalNova(false)}>
        {erroNova && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: '.85rem', marginBottom: 16 }}>{erroNova}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Campo label="Nome da loja *">
            <input type="text" style={inputStyle} placeholder="Ex: Mercadinho do João"
              value={formNova.nomeLoja} onChange={e => setFormNova(f => ({ ...f, nomeLoja: e.target.value }))} />
          </Campo>
          <Campo label="Categoria">
            <select style={inputStyle} value={formNova.categoria} onChange={e => setFormNova(f => ({ ...f, categoria: e.target.value }))}>
              {CATEGORIAS.map(c => <option key={c.slug} value={c.slug}>{c.emoji} {c.nome}</option>)}
            </select>
          </Campo>
          <Campo label="WhatsApp * (com DDD)">
            <input type="tel" style={inputStyle} placeholder="61999999999"
              value={formNova.whatsapp} onChange={e => setFormNova(f => ({ ...f, whatsapp: e.target.value }))} />
          </Campo>
          <Campo label="Endereço (opcional)">
            <input type="text" style={inputStyle} placeholder="Rua, número, quadra..."
              value={formNova.endereco} onChange={e => setFormNova(f => ({ ...f, endereco: e.target.value }))} />
          </Campo>
          <div style={{ display: 'flex', gap: 12 }}>
            <Campo label="Bairro">
              <select style={inputStyle} value={formNova.bairro} onChange={e => setFormNova(f => ({ ...f, bairro: e.target.value }))}>
                {BAIRROS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Campo>
            <Campo label="Status">
              <select style={inputStyle} value={formNova.status} onChange={e => setFormNova(f => ({ ...f, status: e.target.value }))}>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="inativo">Inativo</option>
              </select>
            </Campo>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={() => setModalNova(false)}
            style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={criarLoja} disabled={salvando}
            style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 700, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? .7 : 1 }}>
            {salvando ? 'Criando...' : 'Criar loja →'}
          </button>
        </div>
      </Modal>
    )}

    {/* ─── Modal: Editar loja ─── */}
    {lojaEditando && (
      <Modal titulo={`Editar — ${lojaEditando.nome}`} onClose={() => setLojaEditando(null)}>
        {erroEdit && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: '.85rem', marginBottom: 16 }}>{erroEdit}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Campo label="Nome da loja *">
            <input type="text" style={inputStyle} value={formEdit.nome}
              onChange={e => setFormEdit(f => ({ ...f, nome: e.target.value }))} />
          </Campo>
          <Campo label="E-mail do lojista">
            <input type="email" style={inputStyle} placeholder="para reenvio de e-mails"
              value={formEdit.email} onChange={e => setFormEdit(f => ({ ...f, email: e.target.value }))} />
          </Campo>
          <Campo label="WhatsApp * (com DDD)">
            <input type="tel" style={inputStyle} value={formEdit.whatsapp}
              onChange={e => setFormEdit(f => ({ ...f, whatsapp: e.target.value }))} />
          </Campo>
          <Campo label="Categoria">
            <select style={inputStyle} value={formEdit.categoria} onChange={e => setFormEdit(f => ({ ...f, categoria: e.target.value }))}>
              {CATEGORIAS.map(c => <option key={c.slug} value={c.slug}>{c.emoji} {c.nome}</option>)}
            </select>
          </Campo>
          <Campo label="Endereço">
            <input type="text" style={inputStyle} value={formEdit.endereco}
              onChange={e => setFormEdit(f => ({ ...f, endereco: e.target.value }))} />
          </Campo>
          <div style={{ display: 'flex', gap: 12 }}>
            <Campo label="Bairro">
              <select style={inputStyle} value={formEdit.bairro} onChange={e => setFormEdit(f => ({ ...f, bairro: e.target.value }))}>
                {BAIRROS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Campo>
            <Campo label="Status">
              <select style={inputStyle} value={formEdit.status} onChange={e => setFormEdit(f => ({ ...f, status: e.target.value }))}>
                <option value="ativo">Ativo</option>
                <option value="pendente">Pendente</option>
                <option value="inativo">Inativo</option>
              </select>
            </Campo>
          </div>
          <Campo label="Plano">
            <select style={inputStyle} value={formEdit.plano} onChange={e => setFormEdit(f => ({ ...f, plano: e.target.value }))}>
              <option value="vizinho">Vizinho (grátis)</option>
              <option value="aberto">Aberto (R$29/mês)</option>
              <option value="radar">Radar (R$79/mês)</option>
            </select>
          </Campo>

          {/* Ações de notificação dentro do modal de edição */}
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px', marginTop: 4 }}>
            <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Notificar lojista
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { tipo: 'boasVindas', canal: 'email',    label: '📧 Boas-vindas' },
                { tipo: 'aprovacao',  canal: 'email',    label: '📧 Aprovação' },
                { tipo: 'lembrete',   canal: 'email',    label: '📧 Lembrete' },
                { tipo: 'boasVindas', canal: 'whatsapp', label: '💬 Boas-vindas' },
                { tipo: 'aprovacao',  canal: 'whatsapp', label: '💬 Aprovação' },
                { tipo: 'lembrete',   canal: 'whatsapp', label: '💬 Lembrete' },
              ].map((op, i) => (
                <button key={i} disabled={enviando}
                  onClick={() => notificar({ ...lojaEditando, email: formEdit.email, whatsapp: formEdit.whatsapp }, op.tipo, op.canal)}
                  style={{ padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 7, background: '#fff', cursor: enviando ? 'not-allowed' : 'pointer', fontSize: '.78rem', fontWeight: 600, color: '#334155', opacity: enviando ? .6 : 1 }}>
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={() => setLojaEditando(null)}
            style={{ flex: 1, padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'none', cursor: 'pointer', fontWeight: 700, color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={salvarEdicao} disabled={salvando}
            style={{ flex: 2, padding: '12px', border: 'none', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 700, cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? .7 : 1 }}>
            {salvando ? 'Salvando...' : 'Salvar alterações →'}
          </button>
        </div>
      </Modal>
    )}
    </>
  )
}
