import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, User, Star } from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Início',   path: '/lojista' },
  { icon: Package,         label: 'Produtos', path: '/lojista/produtos' },
  { icon: User,            label: 'Perfil',   path: '/lojista/perfil' },
  { icon: Star,            label: 'Plano',    path: '/lojista/plano' },
]

export default function LojistaShell() {
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
            const active = path === '/lojista' ? pathname === '/lojista' : pathname.startsWith(path)
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
