import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { LOJAS } from '../../lib/mockData'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const CENTER = [-48.0, -15.87] // Riacho Fundo 1, DF

export default function Mapa() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [lojas, setLojas] = useState(LOJAS)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    supabase.from('lojas').select('*, categorias(*)')
      .eq('status', 'ativo')
      .then(({ data, error }) => {
        if (!error && data?.length) setLojas(data)
      })
  }, [])

  useEffect(() => {
    if (!MAPBOX_TOKEN || mapInstance.current) return

    import('https://cdn.jsdelivr.net/npm/mapbox-gl@3/dist/mapbox-gl.js')
      .then(({ default: mapboxgl }) => {
        import('https://cdn.jsdelivr.net/npm/mapbox-gl@3/dist/mapbox-gl.css')
          .catch(() => {})

        mapboxgl.accessToken = MAPBOX_TOKEN

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: CENTER,
          zoom: 14,
        })

        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }), 'top-right')

        map.on('load', () => {
          lojas.forEach(loja => {
            const lng = loja.lng || loja.longitude || CENTER[0] + (Math.random() - 0.5) * 0.01
            const lat = loja.lat || loja.latitude  || CENTER[1] + (Math.random() - 0.5) * 0.01
            const emoji = loja.categorias?.emoji || loja.categoria?.emoji || '🏪'

            const el = document.createElement('div')
            el.style.cssText = `
              width:36px;height:36px;border-radius:50%;
              background:${loja.aberta ? '#10B981' : '#94a3b8'};
              border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);
              display:flex;align-items:center;justify-content:center;
              font-size:16px;cursor:pointer;
            `
            el.textContent = emoji

            const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(`
              <div style="padding:8px 4px;min-width:160px">
                <div style="font-weight:800;font-size:.95rem;color:#0f172a;margin-bottom:4px">${loja.nome}</div>
                <div style="font-size:.75rem;color:${loja.aberta ? '#10B981' : '#94a3b8'};font-weight:700;margin-bottom:8px">
                  ${loja.aberta ? '● Aberta' : '● Fechada'}
                </div>
                <a href="/app/loja/${loja.id}"
                   style="display:block;background:#10B981;color:#fff;text-align:center;padding:7px 12px;border-radius:8px;font-size:.8rem;font-weight:700;text-decoration:none">
                  Ver loja →
                </a>
              </div>
            `)

            new mapboxgl.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map)
          })
        })

        mapInstance.current = map
      })
      .catch(() => setErro(true))

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [lojas])

  if (!MAPBOX_TOKEN || erro) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
        <MapPin size={40} color="var(--slate-300)" style={{ marginBottom: 16 }} />
        <p style={{ color: 'var(--slate-500)', fontSize: '.9rem' }}>Mapa não disponível.<br />Configure o VITE_MAPBOX_TOKEN.</p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)', padding: '14px 16px', borderBottom: '1px solid var(--slate-200)' }}>
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

      {/* Legenda */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,.12)', fontSize: '.75rem', display: 'flex', gap: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Aberta
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }} /> Fechada
        </span>
      </div>

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mapbox-gl@3/dist/mapbox-gl.css" />
      <div ref={mapRef} style={{ width: '100%', height: '100%', paddingTop: 60 }} />
    </div>
  )
}
