import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, Bell, ChevronRight, Store, LogOut, LogIn } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Conta() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const MenuItem = ({ icon: Icon, label, sub, onClick, danger }) => (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
      borderBottom: '1px solid var(--slate-100)', textAlign: 'left',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: danger ? 'rgba(239,68,68,.08)' : 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={danger ? '#ef4444' : 'var(--green)'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.9rem', color: danger ? '#ef4444' : 'var(--navy)' }}>{label}</div>
        {sub && <div style={{ fontSize: '.75rem', color: 'var(--slate-400)', marginTop: 1 }}>{sub}</div>}
      </div>
      <ChevronRight size={16} color="var(--slate-300)" />
    </button>
  )

  if (loading) return <div style={{ height: '100%' }} />

  return (
    <>
      {/* Header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--slate-200)', padding: '14px 16px' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 900 }}>Minha conta</div>
      </div>

      {/* Avatar / info */}
      <div style={{ background: 'var(--white)', padding: '28px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '8px solid var(--bg)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <User size={32} color="var(--green)" />
        </div>
        {user ? (
          <>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 4 }}>
              {user.user_metadata?.nome || user.email?.split('@')[0]}
            </div>
            <div style={{ fontSize: '.82rem', color: 'var(--slate-400)' }}>{user.email}</div>
          </>
        ) : (
          <>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)', marginBottom: 4 }}>Visitante</div>
            <div style={{ fontSize: '.82rem', color: 'var(--slate-400)' }}>Faça login para acessar sua conta</div>
          </>
        )}
      </div>

      {/* Menu */}
      <div style={{ background: 'var(--white)', marginTop: 8 }}>
        <MenuItem icon={MapPin} label="Meu bairro" sub="Riacho Fundo 1, DF" onClick={() => {}} />
        <MenuItem icon={Bell}   label="Notificações" sub="Alertas de lojas próximas" onClick={() => {}} />
      </div>

      <div style={{ background: 'var(--white)', marginTop: 8 }}>
        <MenuItem icon={Store} label="Sou lojista" sub="Cadastre ou acesse sua loja"
          onClick={() => navigate('/lojista')} />
      </div>

      {user ? (
        <div style={{ background: 'var(--white)', marginTop: 8 }}>
          <MenuItem icon={LogOut} label="Sair" danger onClick={handleLogout} />
        </div>
      ) : (
        <div style={{ padding: '20px 16px' }}>
          <button className="btn btn-green btn-lg btn-full" onClick={() => navigate('/lojista/login')}>
            <LogIn size={18} /> Entrar
          </button>
          <button className="btn btn-ghost btn-md btn-full" style={{ marginTop: 10 }}
            onClick={() => navigate('/lojista/cadastro')}>
            Cadastrar minha loja
          </button>
        </div>
      )}

      <div style={{ height: 16 }} />
    </>
  )
}
