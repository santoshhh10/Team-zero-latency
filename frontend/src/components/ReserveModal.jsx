import { useState } from 'react'
import api from '../utils/api'
import dayjs from 'dayjs'
import QRModal from './QRModal'

export default function ReserveModal({ item, onClose, onReserved }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [qr, setQr] = useState(null)

  const slots = item.pickupSlots?.length ? item.pickupSlots : [{ start: item.availabilityWindow?.start, end: item.availabilityWindow?.end }]
  const [slotIdx, setSlotIdx] = useState(0)

  const submit = async () => {
    setLoading(true)
    try {
      const payload = { itemId: item._id, quantity, slot: slots?.[slotIdx] }
      const { data } = await api.post('/api/orders', payload)
      setQr({ image: data.qrImage, token: data.order.qrToken, order: data.order })
      onReserved?.(data.order)
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to reserve')
    } finally {
      setLoading(false)
    }
  }

  if (qr) return <QRModal qr={qr} onClose={onClose} />

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">Reserve {item.name}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-sm text-gray-600">Pickup slot</label>
            <select value={slotIdx} onChange={e=>setSlotIdx(Number(e.target.value))} className="border rounded w-full px-2 py-2">
              {slots?.map((s, idx) => (
                <option key={idx} value={idx}>{dayjs(s.start).format('HH:mm')} - {dayjs(s.end).format('HH:mm')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Quantity</label>
            <input type="number" min={1} max={item.quantityAvailable} value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="border rounded w-full px-2 py-2" />
          </div>
          <button disabled={loading} onClick={submit} className="w-full bg-brand-red text-white py-2 rounded">{loading ? 'Reserving...' : 'Confirm & Pay (demo)'}</button>
        </div>
      </div>
    </div>
  )
}