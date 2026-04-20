import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Store, Users, Star, Settings, LogOut, MapPin, ExternalLink } from 'lucide-react'

const NAV = [
  { section: null },
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/admin' },
  { icon: Store,           label: 'Lojas',       path: '/admin/lojas' },
  { icon: Users,           label: 'Leads',       path: '/admin/leads' },
  { section: 'Sistema' },
  { icon: Star,            label: 'Planos',      path: '/admin/planos' },
  { icon: Settings,        label: 'Config',      path: '/admin/config' },
]

export default function AdminShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <MapPin size={20} color="#10B981" strokeWidth={2.5} />
          <span>Pertim<span style={{ color: '#10B981' }}>.</span> Admin</span>
        </div>

        <nav className="admin-nav">
          {NAV.map((item, i) => {
            if ('section' in item) {
              return item.section ? (
                <div key={i} className="admin-nav-section">{item.section}</div>
              ) : null
            }
            const { icon: Icon, label, path } = item
            const active = path === '/admin' ? pathname === '/admin' : pathname.startsWith(path)
            return (
              <button
                key={path}
                className={`admin-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(path)}
              >
                <Icon size={17} />
                {label}
              </button>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Sessão ativa
          </div>
          <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'rgba(255,255,255,.85)', marginBottom: 14 }}>
            admin.pertim@pertim.online
          </div>
          <button
            className="admin-nav-item"
            onClick={() => navigate('/app')}
            style={{ width: '100%', color: '#6ee7b7' }}
          >
            <ExternalLink size={16} /> Ver app
          </button>
          <button
            className="admin-nav-item"
            onClick={() => navigate('/lojista/login')}
            style={{ width: '100%' }}
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <div className="admin-content">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-page-title">
            {NAV.find(n => n.path && (n.path === '/admin' ? pathname === '/admin' : pathname.startsWith(n.path)))?.label || 'Admin'}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '.82rem', color: '#64748b' }}>
            <span>🟢 Supabase conectado</span>
            <a href="/app" target="_blank" className="btn btn-ghost btn-sm">
              Ver app ao vivo →
            </a>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
