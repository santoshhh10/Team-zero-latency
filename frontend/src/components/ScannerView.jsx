import { useEffect, useRef } from 'react'
import api from '../utils/api'

export default function ScannerView() {
  const ref = useRef(null)

  useEffect(() => {
    let scanner
    async function init() {
      const { Html5Qrcode } = await import('html5-qrcode')
      const id = 'qr-reader'
      const div = document.createElement('div')
      div.id = id
      ref.current.appendChild(div)
      scanner = new Html5Qrcode(id)
      scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 200 }, async (text) => {
        try {
          const { data } = await api.post('/api/orders/scan', { token: text })
          alert('Scan success')
        } catch (e) {
          alert('Invalid or already used QR')
        }
      })
    }
    init()
    return () => { try { scanner?.stop(); scanner?.clear(); } catch {} }
  }, [])

  return <div ref={ref} />
}