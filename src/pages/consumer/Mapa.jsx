import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LOJAS } from '../../lib/mockData'

const CENTER = [-15.87, -48.0] // lat, lng — Riacho Fundo 1, DF

export default function Mapa() {
  const mapRef      = useRef(null)
  const mapInstance = useRef(null)
  const markersRef  = useRef([])
  const [lojas, setLojas] = useState(LOJAS)

  useEffect(() => {
    supabase.from('lojas').select('*, categorias(*)')
      .eq('status', 'ativo')
      .then(({ data, error }) => {
        if (!error && data?.length) setLojas(data)
      })
  }, [])

  useEffect(() => {
    let L
    let cancelled = false

    async function initMap() {
      L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current) return

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          center: CENTER,
          zoom: 15,
          zoomControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(mapInstance.current)
      }

      // Limpar marcadores antigos
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      lojas.forEach(loja => {
        const lat = loja.lat || loja.latitude  || CENTER[0] + (Math.random() - 0.5) * 0.01
        const lng = loja.lng || loja.longitude || CENTER[1] + (Math.random() - 0.5) * 0.01
        const emoji = loja.categorias?.emoji || loja.categoria?.emoji || '🏪'
        const aberta = loja.aberta

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:36px;height:36px;border-radius:50%;
            background:${aberta ? '#10B981' : '#94a3b8'};
            border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);
            display:flex;align-items:center;justify-content:center;
            font-size:16px;cursor:pointer;
          ">${emoji}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

        const popup = L.popup({ offset: [0, -10] }).setContent(`
          <div style="padding:4px;min-width:160px;font-family:-apple-system,sans-serif">
            <div style="font-weight:800;font-size:.95rem;color:#0f172a;margin-bottom:4px">${loja.nome}</div>
            <div style="font-size:.75rem;color:${aberta ? '#10B981' : '#94a3b8'};font-weight:700;margin-bottom:8px">
              ${aberta ? '● Aberta' : '● Fechada'}
            </div>
            <a href="/app/loja/${loja.id}"
               style="display:block;background:#10B981;color:#fff;text-align:center;padding:7px 12px;border-radius:8px;font-size:.8rem;font-weight:700;text-decoration:none">
              Ver loja →
            </a>
          </div>
        `)

        const marker = L.marker([lat, lng], { icon }).bindPopup(popup)
        marker.addTo(mapInstance.current)
        markersRef.current.push(marker)
      })
    }

    initMap().catch(console.error)

    return () => {
      cancelled = true
    }
  }, [lojas])

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(8px)', padding: '14px 16px', borderBottom: '1px solid var(--slate-200)', flexShrink: 0 }}>
        <div style={{ fontWeight: 900, fontSize: '1rem' }}>
          Mapa do bairro
          <span style={{ fontWeight: 500, color: 'var(--slate-400)', fontSize: '.8rem', marginLeft: 8 }}>
            {lojas.length} lojas
          </span>
        </div>
        <div style={{ fontSize: '.72rem', color: 'var(--slate-400)', marginTop: 2 }}>
          <MapPin size={11} style={{ verticalAlign: 'middle' }} /> Riacho Fundo 1, DF
        </div>
      </div>

      <div ref={mapRef} style={{ flex: 1, width: '100%' }} />

      {/* Legenda */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 1000, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,.12)', fontSize: '.75rem', display: 'flex', gap: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Aberta
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} /> Fechada
        </span>
      </div>
    </div>
  )
}
