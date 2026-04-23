import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, ativas: 0, abertas: 0, leads: 0, pendentes: 0, mrr: 0 })
  const [lojasRecentes, setLojasRecentes] = useState([])
  const [leadsRecentes, setLeadsRecentes] = useState([])

  useEffect(() => {
    Promise.allSettled([
      supabase.from('lojas').select('id, nome, status, aberta, plano, bairro, categorias(emoji, nome)').order('created_at', { ascending: false }),
      supabase.from('leads').select('id, nome, loja, status, created_at').order('created_at', { ascending: false }).limit(5),
    ]).then(([lRes, ldRes]) => {
      const lojas = lRes.value?.data || []
      const leads = ldRes.value?.data || []
      const pagos = lojas.filter(l => l.plano === 'aberto' || l.plano === 'radar')
      setStats({
        total: lojas.length,
        ativas: lojas.filter(l => l.status === 'ativo').length,
        abertas: lojas.filter(l => l.aberta).length,
        leads: leads.length,
        pendentes: lojas.filter(l => l.status === 'pendente').length,
        mrr: pagos.filter(l => l.plano === 'aberto').length * 29 + pagos.filter(l => l.plano === 'radar').length * 79,
      })
      setLojasRecentes(lojas.slice(0, 6))
      setLeadsRecentes(leads)
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
    { label: 'Mapa (Leaflet/OSM)', ok: true, action: null },
    { label: 'WhatsApp (wa.me)', ok: true, action: null },
    { label: 'Resend (Email)', ok: true, action: null },
    { label: 'Asaas (Pagamentos)', ok: false, action: 'Criar conta em asaas.com e adicionar ASAAS_API_KEY' },
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
              {lojasRecentes.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '.85rem' }}>Nenhuma loja cadastrada.</td></tr>
              ) : lojasRecentes.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1.2rem' }}>{l.categorias?.emoji || '🏪'}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '.85rem' }}>{l.nome}</div>
                        <div style={{ fontSize: '.7rem', color: '#94a3b8' }}>{l.bairro || 'Riacho Fundo 1'}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge-status-${l.status || 'ativo'}`}>{(l.status || 'ativo').charAt(0).toUpperCase() + (l.status || 'ativo').slice(1)}</span></td>
                  <td>
                    <span className={l.aberta ? 'badge-open' : 'badge-closed'} style={{ fontSize: '.65rem' }}>
                      {l.aberta ? '● Aberta' : '● Fechada'}
                    </span>
                  </td>
                  <td><span className={`badge-plano-${l.plano || 'vizinho'}`}>{(l.plano || 'vizinho').charAt(0).toUpperCase() + (l.plano || 'vizinho').slice(1)}</span></td>
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
              {leadsRecentes.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '.82rem' }}>Nenhum lead ainda.</div>
              ) : leadsRecentes.map((lead, i) => (
                <div key={lead.id || i} style={{ padding: '12px 20px', borderBottom: i < leadsRecentes.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
