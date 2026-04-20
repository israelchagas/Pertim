import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.senha,
      })
      if (error) throw error
      navigate('/lojista')
    } catch (err) {
      setErro('E-mail ou senha incorretos. Verifique e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    navigate('/lojista')
  }

  return (
    <div className="auth-page">
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <MapPin size={28} color="var(--green)" strokeWidth={2.5} />
          <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Pertim<span style={{ color: 'var(--green)' }}>.</span>
          </span>
        </div>
        <div style={{ fontSize: '.82rem', color: 'var(--slate-400)', fontWeight: 500 }}>
          Área exclusiva do lojista
        </div>
      </div>

      <div className="auth-card">
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 6 }}>Entrar na sua conta</h2>
        <p style={{ fontSize: '.88rem', color: 'var(--slate-500)', marginBottom: 28 }}>
          Gerencie sua loja, produtos e status de funcionamento.
        </p>

        {erro && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20, fontSize: '.85rem', color: '#dc2626', fontWeight: 600 }}>
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field" style={{ marginBottom: 16 }}>
            <label>E-mail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="email"
                placeholder="seu@email.com"
                style={{ paddingLeft: 42 }}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-field" style={{ marginBottom: 24 }}>
            <label>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ paddingLeft: 42, paddingRight: 42 }}
                value={form.senha}
                onChange={e => setForm({ ...form, senha: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer' }}
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-green btn-lg btn-full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : (<>Entrar <ArrowRight size={18} /></>)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="#" style={{ fontSize: '.82rem', color: 'var(--slate-500)' }}>Esqueci minha senha</a>
        </div>

        <div style={{ borderTop: '1px solid var(--slate-200)', margin: '24px 0' }} />

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: '.85rem', color: 'var(--slate-500)' }}>Ainda não tem conta? </span>
          <a href="#" style={{ fontSize: '.85rem', color: 'var(--green)', fontWeight: 700 }}>Cadastrar minha loja</a>
        </div>

        <button
          className="btn btn-ghost btn-md btn-full"
          onClick={handleDemo}
          style={{ fontSize: '.82rem' }}
        >
          🔍 Ver demo (sem login)
        </button>
      </div>

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a onClick={() => navigate('/app')} style={{ fontSize: '.82rem', color: 'var(--slate-400)', cursor: 'pointer' }}>
          ← Voltar para o app do consumidor
        </a>
      </div>
    </div>
  )
}
