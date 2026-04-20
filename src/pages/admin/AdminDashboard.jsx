import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Users, TrendingUp, Radio, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LOJAS } from '../../lib/mockData'

const LEADS_MOCK = [
  { nome: 'Carlos Eduardo', loja: 'Mercadinho do Carlos', tipo: 'Mercado', status: 'novo', created_at: '2026-04-20' },
  { nome: 'Marcia Santos', loja: 'Salão da Marcia', tipo: 'Beleza', status: 'contatado', created_at: '2026-04-19' },
  { nome: 'João Ferreira', loja: 'Ferragens do João', tipo: 'Ferragens', status: 'novo', created_at: '2026-04-20' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 8, ativas: 6, abertas: 5, leads: 12, pendentes: 2, mrr: 0 })

  useEffect(() => {
    Promise.allSettled([
      supabase.from('lojas').select('status, aberta, plano'),
      supabase.from('leads').select('status'),
    ]).then(([lRes, ldRes]) => {
      const lojas = lRes.value?.data || []
      const leads = ldRes.value?.data || []
      if (lojas.length) {
        const pagos = lojas.filter(l => l.plano === 'aberto' || l.plano === 'radar')
        setStats({
          total: lojas.length,
          ativas: lojas.filter(l => l.status === 'ativo').length,
          abertas: lojas.filter(l => l.aberta).length,
          leads: leads.length,
          pendentes: lojas.filter(l => l.status === 'pendente').length,
          mrr: pagos.filter(l => l.plano === 'aberto').length * 29 + pagos.filter(l => l.plano === 'radar').length * 79,
        })
      }
    })
  }, [])

  const cards = [
    { label: 'Total de Lojas', num: stats.total, icon: Store, change: `${stats.abertas} abertas agora`, color: '#10B981' },
    { label: 'Lojas Ativas', num: stats.ativas, icon: CheckCircle, change: `${stats.pendentes} aguardando aprovação`, color: '#10B981' },
    { label: 'Leads Captados', num: stats.leads, icon: Users, change: 'Formulário + campo', color: '#F59E0B' },
    { label: 'MRR', num: `R$${stats.mrr}`, icon: TrendingUp, change: 'Receita mensal recorrente', color: '#6366F1' },
  ]

  const STATUS_SETUP = [
    { label: 'Supabase Database', ok: true, action: null },
    { label: 'Netlify Deploy', ok: true, action: null },
    { label: 'Mapbox (Mapa)', ok: true, action: null },
    { label: 'Evolution API (WhatsApp)', ok: false, action: 'Configurar EVOLUTION_API_URL no .env' },
    { label: 'Asaas (Pagamentos)', ok: false, action: 'Criar conta em asaas.com e adicionar ASAAS_API_KEY' },
    { label: 'Resend (Email)', ok: false, action: 'Gerar nova chave em resend.com/api-keys' },
    { label: 'OneSignal (Push)', ok: false, action: 'Criar app em onesignal.com' },
  ]

  return (
    <div className="admin-main">
      {/* Stats */}
      <div className="admin-stats-grid">
        {cards.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div className="admin-stat-label">{c.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                <c.icon size={18} />
              </div>
            </div>
            <div className="admin-stat-num">{c.num}</div>
            <div className="admin-stat-change">{c.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* Últimas lojas */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Lojas cadastradas</div>
            <button
              className="admin-action-btn primary"
              onClick={() => navigate('/admin/lojas')}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Ver todas <ArrowRight size={13} />
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Loja</th>
                <th>Status</th>
                <th>Aberta</th>
                <th>Plano</th>
              </tr>
            </thead>
            <tbody>
              {LOJAS.slice(0, 6).map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{l.categoria.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{l.nome}</div>
                        <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{l.bairro}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge-status-ativo">Ativo</span></td>
                  <td>
                    <span className={l.aberta ? 'badge-open' : 'badge-closed'} style={{ fontSize: '.65rem' }}>
                      {l.aberta ? '● Aberta' : '● Fechada'}
                    </span>
                  </td>
                  <td><span className="badge-plano-vizinho">Vizinho</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status do sistema + Leads recentes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Status das integrações</div>
            </div>
            <div style={{ padding: '8px 0' }}>
              {STATUS_SETUP.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', borderBottom: i < STATUS_SETUP.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <span style={{ fontSize: '.82rem', fontWeight: 600, color: '#334155' }}>{s.label}</span>
                  {s.ok ? (
                    <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,.1)', padding: '3px 10px', borderRadius: 999 }}>
                      ● Online
                    </span>
                  ) : (
                    <span
                      title={s.action || ''}
                      style={{ fontSize: '.68rem', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,.1)', padding: '3px 10px', borderRadius: 999, cursor: 'help' }}
                    >
                      ● Configurar
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">Últimos leads</div>
              <button className="admin-action-btn" onClick={() => navigate('/admin/leads')}>Ver todos →</button>
            </div>
            <div>
              {LEADS_MOCK.map((lead, i) => (
                <div key={i} style={{ padding: '12px 20px', borderBottom: i < LEADS_MOCK.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.82rem' }}>{lead.nome}</div>
                    <div style={{ fontSize: '.72rem', color: '#94a3b8' }}>{lead.loja}</div>
                  </div>
                  <span style={{
                    fontSize: '.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                    background: lead.status === 'novo' ? '#dbeafe' : 'rgba(16,185,129,.1)',
                    color: lead.status === 'novo' ? '#1d4ed8' : '#059669',
                  }}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
