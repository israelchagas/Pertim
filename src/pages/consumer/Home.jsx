import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { CATEGORIAS, LOJAS } from '../../lib/mockData'

function normalizeSupabase(row) {
  const cat = row.categorias || {}
  return {
    id: row.id, nome: row.nome,
    categoria: { emoji: cat.emoji || '🏪', nome: cat.nome || 'Outros', slug: cat.slug || 'outros' },
    whatsapp: row.whatsapp, endereco: row.endereco || '',
    bairro: row.bairro || 'Riacho Fundo 1',
    distancia: row.distancia_metros ? Math.round(row.distancia_metros) : 999,
    aberta: row.aberta ?? false,
    horario: row.horario_abertura && row.horario_fechamento
      ? `${String(row.horario_abertura).slice(0, 5)} – ${String(row.horario_fechamento).slice(0, 5)}`
      : 'Horário não informado',
    descricao: row.descricao || '',
    produtos: (row.produtos || []).map(p => ({ id: p.id, nome: p.nome, preco: p.preco || 0, emoji: p.emoji || '🛍️', disponivel: p.disponivel ?? true })),
  }
}

function StoreCard({ loja, onClick }) {
  const handleWhatsApp = (e) => {
    e.stopPropagation()
    window.open(`https://wa.me/55${loja.whatsapp}?text=Oi, vi sua loja no Pertim!`, '_blank')
  }
  return (
    <div className="store-card" onClick={onClick}>
      <div className="store-avatar">{loja.categoria.emoji}</div>
      <div className="store-card-info">
        <div className="store-card-name">{loja.nome}</div>
        <div className="store-card-meta">
          <span className={loja.aberta ? 'badge-open' : 'badge-closed'}>{loja.aberta ? '● Aberta' : '● Fechada'}</span>
          <span className="badge-dist"><MapPin size={11} /> {loja.distancia}m</span>
          <span className="badge-cat">{loja.categoria.nome}</span>
        </div>
        <div style={{ fontSize: '.72rem', color: 'var(--slate-400)' }}>{loja.horario}</div>
      </div>
      <button className="store-card-cta" onClick={handleWhatsApp}>
        <MessageCircle size={14} /> WhatsApp
      </button>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [lojas, setLojas] = useState(LOJAS)
  const [loading, setLoading] = useState(true)
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [apenasAbertas, setApenasAbertas] = useState(false)

  useEffect(() => {
    supabase
      .from('lojas')
      .select('*, categorias(*), produtos(*)')
      .eq('status', 'ativo')
      .then(({ data, error }) => {
        if (!error && data?.length) setLojas(data.map(normalizeSupabase))
        setLoading(false)
      })
  }, [])

  const lojasFiltradas = useMemo(() => {
    let r = [...lojas]
    if (apenasAbertas) r = r.filter(l => l.aberta)
    if (categoriaAtiva !== 'todos') r = r.filter(l => l.categoria.slug === categoriaAtiva)
    return r.sort((a, b) => a.distancia - b.distancia)
  }, [lojas, categoriaAtiva, apenasAbertas])

  return (
    <>
      {/* Header */}
      <div className="app-header">
        <div className="location-bar">
          <div>
            <div className="location-text"><MapPin size={15} color="var(--green)" strokeWidth={2.5} /> Riacho Fundo 1, DF</div>
            <div className="location-sub">Bairro atual</div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}>
            <Bell size={22} />
          </button>
        </div>
        <input
          className="app-search"
          placeholder="O que você precisa agora?"
          onFocus={() => navigate('/app/busca')}
          readOnly
        />
      </div>

      {/* Categorias */}
      <div className="category-scroll">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.id}
            className={`category-pill ${categoriaAtiva === cat.id ? 'active' : ''}`}
            onClick={() => setCategoriaAtiva(cat.id)}
          >
            <span className="emoji">{cat.emoji}</span>
            <span className="label">{cat.nome}</span>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <button
          className={`filter-pill ${apenasAbertas ? 'active' : ''}`}
          onClick={() => setApenasAbertas(!apenasAbertas)}
        >
          🟢 Aberto agora
        </button>
        <button className="filter-pill">📍 Mais próximo</button>
      </div>

      {/* Lista */}
      <div className="section-header">
        <h3>
          {categoriaAtiva === 'todos' ? 'Perto de você' : CATEGORIAS.find(c => c.id === categoriaAtiva)?.nome}
          <span style={{ fontWeight: 500, color: 'var(--slate-400)', marginLeft: 8, fontSize: '.8rem' }}>
            {loading ? '…' : `${lojasFiltradas.length} lojas`}
          </span>
        </h3>
        <a onClick={() => navigate('/app/busca')} style={{ cursor: 'pointer' }}>
          Ver todas <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
        </a>
      </div>

      <div className="store-list">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="store-card" style={{ opacity: .4, pointerEvents: 'none' }}>
              <div className="store-avatar" style={{ background: 'var(--slate-200)' }} />
              <div className="store-card-info">
                <div style={{ height: 14, width: '60%', background: 'var(--slate-200)', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 10, width: '40%', background: 'var(--slate-200)', borderRadius: 6 }} />
              </div>
            </div>
          ))
        ) : lojasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🔍</div>
            <p>Nenhuma loja encontrada.<br />Tente remover os filtros.</p>
          </div>
        ) : lojasFiltradas.map(loja => (
          <StoreCard key={loja.id} loja={loja} onClick={() => navigate(`/app/loja/${loja.id}`)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
    </>
  )
}
