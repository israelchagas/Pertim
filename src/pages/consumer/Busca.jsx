import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Search, MapPin, MessageCircle, SlidersHorizontal } from 'lucide-react'
import { LOJAS, buscarLojas } from '../../lib/mockData'

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

export default function Busca() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [apenasAbertas, setApenasAbertas] = useState(false)
  const [inputFocused, setInputFocused] = useState(true)

  const resultados = useMemo(() => buscarLojas({ query, apenasAbertas }), [query, apenasAbertas])

  const sugestoes = ['pão fresco', 'cola instantânea', 'remédio', 'frutas', 'burgão', 'bolo de aniversário']

  return (
    <>
      {/* Header */}
      <div className="app-page-header">
        <button className="back-btn" onClick={() => navigate('/app')}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          <input
            autoFocus
            className="app-search"
            style={{ paddingLeft: 38 }}
            placeholder="O que você precisa agora?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 150)}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-bar" style={{ paddingTop: 12 }}>
        <button
          className={`filter-pill ${apenasAbertas ? 'active' : ''}`}
          onClick={() => setApenasAbertas(!apenasAbertas)}
        >
          🟢 Aberto agora
        </button>
        <button className="filter-pill">📍 Mais próximo</button>
        <button className="filter-pill"><SlidersHorizontal size={13} /> Filtros</button>
      </div>

      {/* Sem query — mostra sugestões */}
      {!query.trim() && (
        <div style={{ padding: '8px 16px' }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Buscas populares no bairro
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sugestoes.map(s => (
              <button
                key={s}
                className="filter-pill"
                style={{ background: 'var(--white)' }}
                onClick={() => setQuery(s)}
              >
                🔍 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {query.trim() && (
        <>
          <div className="section-header">
            <h3>
              {resultados.length} resultado{resultados.length !== 1 ? 's' : ''} para "{query}"
            </h3>
          </div>

          <div className="store-list">
            {resultados.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">😕</div>
                <p>Nenhuma loja encontrada para<br /><strong>"{query}"</strong>.<br /><br />Tente um termo diferente ou remova os filtros.</p>
              </div>
            ) : (
              resultados.map(loja => (
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
      )}
    </>
  )
}
