import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, MapPin, MessageCircle, ChevronRight } from 'lucide-react'
import { CATEGORIAS, LOJAS } from '../../lib/mockData'

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
          <span className={loja.aberta ? 'badge-open' : 'badge-closed'}>
            {loja.aberta ? '● Aberta' : '● Fechada'}
          </span>
          <span className="badge-dist">
            <MapPin size={11} /> {loja.distancia}m
          </span>
          <span className="badge-cat">{loja.categoria.nome}</span>
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--slate-400)' }}>{loja.horario}</div>
      </div>
      <button className="store-card-cta" onClick={handleWhatsApp}>
        <MessageCircle size={14} /> WhatsApp
      </button>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [apenasAbertas, setApenasAbertas] = useState(false)
  const [query, setQuery] = useState('')

  const lojasFiltradas = useMemo(() => {
    let r = [...LOJAS]
    if (apenasAbertas) r = r.filter(l => l.aberta)
    if (categoriaAtiva !== 'todos') r = r.filter(l => l.categoria.slug === categoriaAtiva)
    if (query.trim()) {
      const q = query.toLowerCase()
      r = r.filter(l =>
        l.nome.toLowerCase().includes(q) ||
        l.produtos.some(p => p.nome.toLowerCase().includes(q))
      )
    }
    return r.sort((a, b) => a.distancia - b.distancia)
  }, [categoriaAtiva, apenasAbertas, query])

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/app/busca?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="app-header">
        <div className="location-bar">
          <div>
            <div className="location-text">
              <MapPin size={15} color="var(--green)" strokeWidth={2.5} />
              Riacho Fundo 1, DF
            </div>
            <div className="location-sub">Bairro atual</div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', position: 'relative' }}>
            <Bell size={22} />
          </button>
        </div>
        <input
          className="app-search"
          placeholder="O que você precisa agora?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleSearchKey}
          onFocus={() => navigate('/app/busca')}
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
          <span>🟢</span> Aberto agora
        </button>
        <button className="filter-pill">📍 Mais próximo</button>
        <button className="filter-pill">⭐ Destaques</button>
      </div>

      {/* Lista de lojas */}
      <div className="section-header">
        <h3>
          {categoriaAtiva === 'todos' ? 'Perto de você' : CATEGORIAS.find(c => c.id === categoriaAtiva)?.nome}
          <span style={{ fontWeight: 500, color: 'var(--slate-400)', marginLeft: 8, fontSize: '.82rem' }}>
            {lojasFiltradas.length} {lojasFiltradas.length === 1 ? 'loja' : 'lojas'}
          </span>
        </h3>
        <a onClick={() => navigate('/app/busca')} style={{ cursor: 'pointer' }}>
          Ver todas <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
        </a>
      </div>

      <div className="store-list">
        {lojasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🔍</div>
            <p>Nenhuma loja encontrada.<br />Tente remover os filtros.</p>
          </div>
        ) : (
          lojasFiltradas.map(loja => (
            <StoreCard
              key={loja.id}
              loja={loja}
              onClick={() => navigate(`/app/loja/${loja.id}`)}
            />
          ))
        )}
      </div>

      <div style={{ height: 24 }} />
    </>
  )
}
