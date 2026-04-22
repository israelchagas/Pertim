import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff, User, Phone, Store, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CATEGORIAS = [
  { id: null, emoji: '🏪', nome: 'Selecione...' },
  { slug: 'mercado',    emoji: '🛒', nome: 'Mercado / Mercearia' },
  { slug: 'lanches',   emoji: '🍔', nome: 'Lanches / Restaurante' },
  { slug: 'farmacia',  emoji: '💊', nome: 'Farmácia / Saúde' },
  { slug: 'beleza',    emoji: '💇', nome: 'Beleza / Barbearia' },
  { slug: 'pet',       emoji: '🐾', nome: 'Pet Shop' },
  { slug: 'eletro',    emoji: '📱', nome: 'Eletrônicos / Informática' },
  { slug: 'servicos',  emoji: '🔧', nome: 'Serviços Gerais' },
  { slug: 'moda',      emoji: '👗', nome: 'Moda / Acessórios' },
  { slug: 'outros',    emoji: '✨', nome: 'Outros' },
]

export default function Cadastro() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    nomeLoja: '', categoria: '', whatsapp: '', endereco: '', bairro: 'Riacho Fundo 1',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validarStep1 = () => {
    if (!form.nome.trim()) return 'Informe seu nome'
    if (!form.email.includes('@')) return 'E-mail inválido'
    if (form.senha.length < 6) return 'Senha deve ter ao menos 6 caracteres'
    if (form.senha !== form.confirmarSenha) return 'As senhas não coincidem'
    return null
  }

  const validarStep2 = () => {
    if (!form.nomeLoja.trim()) return 'Informe o nome da loja'
    if (!form.categoria) return 'Selecione uma categoria'
    const wpp = form.whatsapp.replace(/\D/g, '')
    if (wpp.length < 10) return 'WhatsApp inválido (ex: 61999999999)'
    return null
  }

  const handleNext = () => {
    setErro('')
    const err = validarStep1()
    if (err) { setErro(err); return }
    setStep(2)
  }

  const handleSubmit = async () => {
    setErro('')
    const err = validarStep2()
    if (err) { setErro(err); return }

    setLoading(true)
    try {
      const res = await fetch('/.netlify/functions/cadastro-lojista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          nomeLoja: form.nomeLoja,
          categoria: form.categoria,
          whatsapp: form.whatsapp,
          endereco: form.endereco,
          bairro: form.bairro,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 409) throw new Error('Este e-mail já possui uma conta. Faça login.')
      if (!res.ok) throw new Error(data.error || 'Erro ao criar conta. Tente novamente.')

      // Faz login automático após cadastro
      await supabase.auth.signInWithPassword({ email: form.email, password: form.senha })

      setStep(3)
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <MapPin size={26} color="var(--green)" strokeWidth={2.5} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Pertim<span style={{ color: 'var(--green)' }}>.</span>
          </span>
        </div>
        <div style={{ fontSize: '.82rem', color: 'var(--slate-400)', fontWeight: 500 }}>
          Cadastre sua loja gratuitamente
        </div>
      </div>

      {/* Steps indicator */}
      {step < 3 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '.85rem',
                background: step >= s ? 'var(--green)' : 'var(--slate-200)',
                color: step >= s ? '#fff' : 'var(--slate-400)',
              }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 2, background: step > s ? 'var(--green)' : 'var(--slate-200)', borderRadius: 2 }} />}
            </div>
          ))}
        </div>
      )}

      <div className="auth-card">
        {/* ─── STEP 1: Dados pessoais ─── */}
        {step === 1 && (
          <>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 4 }}>Seus dados</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--slate-500)', marginBottom: 24 }}>Crie sua conta de acesso ao painel.</p>

            {erro && <div className="form-error">{erro}</div>}

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Nome completo</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="text" placeholder="Seu nome" style={{ paddingLeft: 40 }}
                  value={form.nome} onChange={e => set('nome', e.target.value)} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="email" placeholder="seu@email.com" style={{ paddingLeft: 40 }}
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type={mostrarSenha ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  value={form.senha} onChange={e => set('senha', e.target.value)} />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}>
                  {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 24 }}>
              <label>Confirmar senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="password" placeholder="Repita a senha" style={{ paddingLeft: 40 }}
                  value={form.confirmarSenha} onChange={e => set('confirmarSenha', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} />
              </div>
            </div>

            <button className="btn btn-green btn-lg btn-full" onClick={handleNext}>
              Continuar <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* ─── STEP 2: Dados da loja ─── */}
        {step === 2 && (
          <>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 4 }}>Sua loja</h2>
            <p style={{ fontSize: '.85rem', color: 'var(--slate-500)', marginBottom: 24 }}>Como os moradores vão te encontrar.</p>

            {erro && <div className="form-error">{erro}</div>}

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Nome da loja</label>
              <div style={{ position: 'relative' }}>
                <Store size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="text" placeholder="Ex: Mercadinho do João" style={{ paddingLeft: 40 }}
                  value={form.nomeLoja} onChange={e => set('nomeLoja', e.target.value)} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Categoria</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--slate-200)', borderRadius: 'var(--r-md)', fontSize: '.9rem', background: 'var(--white)', color: form.categoria ? 'var(--navy)' : 'var(--slate-400)', fontFamily: 'inherit' }}>
                {CATEGORIAS.map(c => (
                  <option key={c.slug || 'none'} value={c.slug || ''}>{c.emoji} {c.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>WhatsApp</label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="tel" placeholder="61999999999 (com DDD)" style={{ paddingLeft: 40 }}
                  value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 14 }}>
              <label>Endereço <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(opcional)</span></label>
              <div style={{ position: 'relative' }}>
                <MapPin size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input type="text" placeholder="Rua, número, quadra..." style={{ paddingLeft: 40 }}
                  value={form.endereco} onChange={e => set('endereco', e.target.value)} />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: 24 }}>
              <label>Bairro</label>
              <select value={form.bairro} onChange={e => set('bairro', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--slate-200)', borderRadius: 'var(--r-md)', fontSize: '.9rem', background: 'var(--white)', fontFamily: 'inherit', color: 'var(--navy)' }}>
                <option>Riacho Fundo 1</option>
                <option>Riacho Fundo 2</option>
                <option>Candangolândia</option>
                <option>Núcleo Bandeirante</option>
                <option>Park Way</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-lg" onClick={() => { setErro(''); setStep(1) }}
                style={{ flex: '0 0 auto', padding: '0 18px' }}>
                <ChevronLeft size={18} />
              </button>
              <button className="btn btn-green btn-lg btn-full" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar minha loja →'}
              </button>
            </div>
          </>
        )}

        {/* ─── STEP 3: Sucesso ─── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: 64, height: 64, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} color="var(--green)" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 10 }}>Loja cadastrada! 🎉</h2>
            <p style={{ fontSize: '.88rem', color: 'var(--slate-500)', lineHeight: 1.6, marginBottom: 28 }}>
              Sua loja <strong>{form.nomeLoja}</strong> está em análise.<br />
              Em até <strong>24 horas</strong> você receberá a confirmação no e-mail <strong>{form.email}</strong>.
            </p>
            <div style={{ background: 'var(--green-light)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: 24, fontSize: '.82rem', color: 'var(--green-dark)', textAlign: 'left' }}>
              <strong>Enquanto isso, você pode:</strong>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20, lineHeight: 1.9 }}>
                <li>Acessar seu painel e adicionar produtos</li>
                <li>Configurar seus horários de funcionamento</li>
                <li>Personalizar sua loja</li>
              </ul>
            </div>
            <button className="btn btn-green btn-lg btn-full" onClick={() => navigate('/lojista')}>
              Acessar meu painel →
            </button>
            <button className="btn btn-ghost btn-md btn-full" style={{ marginTop: 10 }}
              onClick={() => navigate('/lojista/login')}>
              Fazer login
            </button>
          </div>
        )}
      </div>

      {step < 3 && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <span style={{ fontSize: '.82rem', color: 'var(--slate-500)' }}>Já tem conta? </span>
          <a onClick={() => navigate('/lojista/login')}
            style={{ fontSize: '.82rem', color: 'var(--green)', fontWeight: 700, cursor: 'pointer' }}>
            Fazer login
          </a>
        </div>
      )}
    </div>
  )
}
