import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import AppShell from './components/AppShell'
import LojistaShell from './components/LojistaShell'
import Home from './pages/consumer/Home'
import Busca from './pages/consumer/Busca'
import LojaProfile from './pages/consumer/LojaProfile'
import Login from './pages/lojista/Login'
import Dashboard from './pages/lojista/Dashboard'
import Produtos from './pages/lojista/Produtos'
import MeuPerfil from './pages/lojista/MeuPerfil'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page institucional */}
        <Route path="/" element={<Landing />} />

        {/* App do consumidor */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="busca" element={<Busca />} />
          <Route path="loja/:id" element={<LojaProfile />} />
        </Route>

        {/* Área do lojista */}
        <Route path="/lojista/login" element={<Login />} />
        <Route path="/lojista" element={<LojistaShell />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="perfil" element={<MeuPerfil />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
