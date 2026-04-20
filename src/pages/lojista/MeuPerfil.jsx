import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, LogOut } from 'lucide-react'
import { LOJAS } from '../../lib/mockData'

const TIPOS = [
  'Padaria / Confeitaria', 'Mercearia / Mercadinho', 'Hortifruti',
  'Farmácia', 'Ferragens / Material', 'Restaurante / Lanchonete',
  'Beleza / Estética', 'Prestador de Serviços', 'Outro',
]

export default function MeuPerfil() {
  const navigate = useNavigate()
  const loja = LOJAS[0]
  const [form, setForm] = useState({
    nome: loja.nome,
    tipo: loja.categoria.nome,
    whatsapp: loja.whatsapp,
    endereco: loja.endereco,
    descricao: loja.descricao || '',
    horarioAbertura: loja.horario.split(' – ')[0],
    horarioFechamento: loja.horario.split(' – ')[1],
  })
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      {/* Header */}
      <div className="app-page-header">
        <button className="back-btn" onClick={() => navigate('/lojista')}>
          <ArrowLeft size={20} />
        </button>
        <span className="app-page-title">Meu Perfil</span>
      </div>

      {/* Avatar */}
      <div style={{ background: 'var(--navy)', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
        <span>{loja.categoria.emoji}</span>
        <button style={{ position: 'absolute', bottom: 8, right: 16, background: 'var(--green)', border: 'none', color: 'white', borderRadius: 'var(--r-full)', padding: '6px 12px', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Foto da loja
        </button>
      </div>

      <form onSubmit={handleSave} className="app-form">
        <div className="app-form-field">
          <label>Nome da loja *</label>
          <input
            type="text"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="app-form-field">
          <label>Tipo de negócio</label>
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="app-form-field">
          <label>WhatsApp *</label>
          <input
            type="tel"
            placeholder="61 99999-9999"
            value={form.whatsapp}
            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
            required
          />
        </div>

        <div className="app-form-field">
          <label>Endereço</label>
          <input
            type="text"
            placeholder="QR 409, Lote 12, Riacho Fundo 1"
            value={form.endereco}
            onChange={e => setForm({ ...form, endereco: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="app-form-field">
            <label>Abre</label>
            <input
              type="time"
              value={form.horarioAbertura}
              onChange={e => setForm({ ...form, horarioAbertura: e.target.value })}
            />
          </div>
          <div className="app-form-field">
            <label>Fecha</label>
            <input
              type="time"
              value={form.horarioFechamento}
              onChange={e => setForm({ ...form, horarioFechamento: e.target.value })}
            />
          </div>
        </div>

        <div className="app-form-field">
          <label>Descrição da loja</label>
          <textarea
            rows={3}
            placeholder="Descreva o que sua loja vende, seu diferencial..."
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
            style={{ resize: 'none' }}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-lg btn-full ${saved ? 'btn-ghost' : 'btn-green'}`}
          style={{ gap: 10 }}
        >
          {saved ? '✅ Salvo com sucesso!' : (<><Save size={18} /> Salvar alterações</>)}
        </button>
      </form>

      <div style={{ padding: '0 16px 24px' }}>
        <button
          className="btn btn-ghost btn-md btn-full"
          onClick={() => navigate('/lojista/login')}
          style={{ color: '#dc2626', borderColor: 'rgba(239,68,68,.3)', marginTop: 8 }}
        >
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </>
  )
}
