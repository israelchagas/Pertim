import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Map, User } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home,   label: 'Início',   path: '/app' },
  { icon: Search, label: 'Buscar',   path: '/app/busca' },
  { icon: Map,    label: 'Mapa',     path: '/app/mapa' },
  { icon: User,   label: 'Conta',    path: '/app/conta' },
]

export default function AppShell() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="app-viewport">
      <div className="app-frame">
        <div className="app-content">
          <Outlet />
        </div>
        <nav className="bottom-nav">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const active = path === '/app' ? pathname === '/app' : pathname.startsWith(path)
            return (
              <button
                key={path}
                className={`bottom-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(path)}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
