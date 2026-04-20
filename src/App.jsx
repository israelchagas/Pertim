import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import AppShell from './components/AppShell'
import LojistaShell from './components/LojistaShell'
import AdminShell from './components/AdminShell'
import Home from './pages/consumer/Home'
import Busca from './pages/consumer/Busca'
import LojaProfile from './pages/consumer/LojaProfile'
import Login from './pages/lojista/Login'
import Cadastro from './pages/lojista/Cadastro'
import Dashboard from './pages/lojista/Dashboard'
import Produtos from './pages/lojista/Produtos'
import MeuPerfil from './pages/lojista/MeuPerfil'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLojas from './pages/admin/AdminLojas'
import AdminLeads from './pages/admin/AdminLeads'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page institucional */}
        <Route path="/" element={<Landing />} />

        {/* App do consumidor — PWA */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="busca" element={<Busca />} />
          <Route path="loja/:id" element={<LojaProfile />} />
        </Route>

        {/* Área do lojista */}
        <Route path="/lojista/login" element={<Login />} />
        <Route path="/lojista/cadastro" element={<Cadastro />} />
        <Route path="/lojista" element={<LojistaShell />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="perfil" element={<MeuPerfil />} />
        </Route>

        {/* Painel admin */}
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboard />} />
          <Route path="lojas" element={<AdminLojas />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
