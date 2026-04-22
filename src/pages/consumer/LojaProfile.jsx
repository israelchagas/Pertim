import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Share2, Heart, MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function LojaProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loja, setLoja]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('lojas')
      .select('*, categorias(*), produtos(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setLoja(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ height: '100%' }} />

  if (!loja) {
    return (
      <div className="empty-state" style={{ paddingTop: 120 }}>
        <div className="emoji">🔍</div>
        <p>Loja não encontrada.</p>
        <button className="btn btn-green btn-md" style={{ marginTop: 24 }} onClick={() => navigate('/app')}>
          Voltar ao início
        </button>
      </div>
    )
  }

  const cat = loja.categorias || {}
  const produtos = loja.produtos || []
  const disponiveis = produtos.filter(p => p.disponivel)
  const indisponiveis = produtos.filter(p => !p.disponivel)

  const handleWhatsApp = () => {
    window.open(`https://wa.me/55${loja.whatsapp}?text=Oi ${loja.nome}, vi sua loja no Pertim e quero saber mais!`, '_blank')
  }

  const handleShare = () => {
    const url = `https://pertim.online/app/loja/${loja.id}`
    if (navigator.share) {
      navigator.share({ title: loja.nome, url })
    } else {
      navigator.clipboard?.writeText(url)
    }
  }

  return (
    <>
      {/* Hero */}
      <div className="loja-hero" style={{ background: loja.foto_capa ? 'transparent' : 'var(--navy)', position: 'relative' }}>
        {loja.foto_capa ? (
          <img src={loja.foto_capa} alt={loja.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '5rem' }}>{cat.emoji || '🏪'}</span>
        )}

        {/* Back + Actions */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: 16 }}>
          <button onClick={() => navigate(-1)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
              <Heart size={16} />
            </button>
            <button onClick={handleShare}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,.35)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
          <span className={loja.aberta ? 'badge-open' : 'badge-closed'} style={{ fontSize: '.78rem', padding: '5px 12px' }}>
            {loja.aberta ? '● Aberta agora' : '● Fechada'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="loja-info">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 4 }}>{loja.nome}</h1>
            <div style={{ fontSize: '.82rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{cat.emoji} {cat.nome}</span>
              {loja.bairro && <><span>·</span><MapPin size={12} /><span>{loja.bairro}</span></>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, margin: '14px 0', fontSize: '.82rem', color: 'var(--slate-600)', flexWrap: 'wrap' }}>
          {loja.horario && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={14} color="var(--green)" /> {loja.horario}
            </div>
          )}
          {loja.endereco && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={14} color="var(--green)" /> {loja.endereco}
            </div>
          )}
        </div>

        {loja.descricao && (
          <p style={{ fontSize: '.88rem', color: 'var(--slate-500)', lineHeight: 1.7, marginBottom: 16 }}>
            {loja.descricao}
          </p>
        )}

        <button className="whatsapp-cta" onClick={handleWhatsApp}>
          <MessageCircle size={20} /> Falar no WhatsApp
        </button>

        {/* Produtos disponíveis */}
        {disponiveis.length > 0 && (
          <>
            <div style={{ fontWeight: 800, fontSize: '.9rem', marginBottom: 12, marginTop: 8 }}>Disponível agora</div>
            <div className="product-grid">
              {disponiveis.map(p => (
                <div key={p.id} className="product-tile">
                  <div className="product-tile-emoji">{p.emoji || '🛍️'}</div>
                  <div className="product-tile-name">{p.nome}</div>
                  {p.preco > 0 && (
                    <div className="product-tile-price">
                      {Number(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Produtos indisponíveis */}
        {indisponiveis.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
              Confirmar disponibilidade
            </div>
            {indisponiveis.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--slate-200)', opacity: 0.6 }}>
                <span style={{ fontSize: '1.3rem' }}>{p.emoji || '🛍️'}</span>
                <span style={{ fontSize: '.88rem', fontWeight: 600, textDecoration: 'line-through', color: 'var(--slate-400)' }}>{p.nome}</span>
                <span style={{ fontSize: '.7rem', color: 'var(--slate-400)', marginLeft: 'auto' }}>Confirmar</span>
              </div>
            ))}
          </div>
        )}

        {produtos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--slate-400)', fontSize: '.88rem' }}>
            Nenhum produto cadastrado ainda.
          </div>
        )}

        <div style={{ height: 32 }} />
      </div>
    </>
  )
}
