export async function sendWhatsApp(phone, message) {
  const res = await fetch('/.netlify/functions/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: phone.replace(/\D/g, ''), message }),
  })
  if (!res.ok) throw new Error(`Z-API error ${res.status}`)
  return res.json()
}
