import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, LogOut, Camera } from 'lucide-react'
import { supabase } from '../../lib/supabase'

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

export default function MeuPerfil() {
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [lojaId, setLojaId]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [salvando, setSalvando]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast]         = useState('')
  const [fotoUrl, setFotoUrl]     = useState(null)
  const [emoji, setEmoji]         = useState('🏪')

  const [form, setForm] = useState({
    nome: '', categoria: 'outros', whatsapp: '', endereco: '',
    descricao: '', horario_abertura: '08:00', horario_fechamento: '18:00',
  })

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/lojista/login'); return }

      const { data, error } = await supabase
        .from('lojas')
        .select('*, categorias(*)')
        .eq('user_id', session.user.id)
        .single()

      if (!error && data) {
        setLojaId(data.id)
        setFotoUrl(data.foto_capa || null)
        setEmoji(data.categorias?.emoji || '🏪')
        const horario = data.horario || '08:00 – 18:00'
        const [ab, fe] = horario.split(' – ')
        setForm({
          nome:               data.nome || '',
          categoria:          data.categorias?.slug || 'outros',
          whatsapp:           data.whatsapp || '',
          endereco:           data.endereco || '',
          descricao:          data.descricao || '',
          horario_abertura:   ab || '08:00',
          horario_fechamento: fe || '18:00',
        })
      }
      setLoading(false)
    })
  }, [])

  const handleFoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !lojaId) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `lojas/${lojaId}/capa.${ext}`
      const { error: upErr } = await supabase.storage
        .from('fotos')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(path)
      await supabase.from('lojas').update({ foto_capa: publicUrl }).eq('id', lojaId)
      setFotoUrl(publicUrl)
      showToast('📸 Foto atualizada!')
    } catch (err) {
      showToast('❌ Erro no upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!lojaId) return
    setSalvando(true)
    try {
      const catRes = await supabase.from('categorias').select('id').eq('slug', form.categoria).single()
      const { error } = await supabase.from('lojas').update({
        nome:         form.nome,
        whatsapp:     form.whatsapp.replace(/\D/g, ''),
        endereco:     form.endereco,
        descricao:    form.descricao,
        horario:      `${form.horario_abertura} – ${form.horario_fechamento}`,
        categoria_id: catRes.data?.id || null,
      }).eq('id', lojaId)

      if (error) throw error
      const cat = CATEGORIAS.find(c => c.slug === form.categoria)
      if (cat) setEmoji(cat.emoji)
      showToast('✅ Perfil salvo!')
    } catch (err) {
      showToast('❌ ' + err.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/lojista/login')
  }

  if (loading) return <div style={{ height: '100%' }} />

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* Header */}
      <div className="app-page-header">
        <button className="back-btn" onClick={() => navigate('/lojista')}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-page-title">Meu Perfil</span>
      </div>

      {/* Capa / foto */}
      <div style={{ background: 'var(--navy)', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {fotoUrl ? (
          <img src={fotoUrl} alt="Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3.5rem' }}>{emoji}</span>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ position: 'absolute', bottom: 10, right: 16, background: 'var(--green)', border: 'none', color: 'white', borderRadius: 'var(--r-full)', padding: '7px 14px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Camera size={14} /> {uploading ? 'Enviando...' : 'Trocar foto'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
      </div>

      <form onSubmit={handleSave} className="app-form">
        <div className="app-form-field">
          <label>Nome da loja *</label>
          <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
        </div>

        <div className="app-form-field">
          <label>Categoria</label>
          <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
            {CATEGORIAS.map(c => <option key={c.slug} value={c.slug}>{c.emoji} {c.nome}</option>)}
          </select>
        </div>

        <div className="app-form-field">
          <label>WhatsApp *</label>
          <input type="tel" placeholder="61 99999-9999" value={form.whatsapp}
            onChange={e => setForm({ ...form, whatsapp: e.target.value })} required />
        </div>

        <div className="app-form-field">
          <label>Endereço</label>
          <input type="text" placeholder="QR 409, Lote 12..." value={form.endereco}
            onChange={e => setForm({ ...form, endereco: e.target.value })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="app-form-field">
            <label>Abre</label>
            <input type="time" value={form.horario_abertura}
              onChange={e => setForm({ ...form, horario_abertura: e.target.value })} />
          </div>
          <div className="app-form-field">
            <label>Fecha</label>
            <input type="time" value={form.horario_fechamento}
              onChange={e => setForm({ ...form, horario_fechamento: e.target.value })} />
          </div>
        </div>

        <div className="app-form-field">
          <label>Descrição da loja</label>
          <textarea rows={3} placeholder="O que sua loja vende, seu diferencial..."
            value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}
            style={{ resize: 'none' }} />
        </div>

        <button type="submit" className="btn btn-green btn-lg btn-full" disabled={salvando} style={{ gap: 10 }}>
          {salvando ? 'Salvando...' : <><Save size={18} /> Salvar alterações</>}
        </button>
      </form>

      <div style={{ padding: '0 16px 32px' }}>
        <button className="btn btn-ghost btn-md btn-full" onClick={handleLogout}
          style={{ color: '#dc2626', borderColor: 'rgba(239,68,68,.3)', marginTop: 8 }}>
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </>
  )
}
