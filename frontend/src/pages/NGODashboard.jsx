import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function NGODashboard() {
  const [items, setItems] = useState([])
  const load = async () => { const { data } = await api.get('/api/ngos/alerts'); setItems(data) }
  useEffect(()=>{ load() }, [])

  const pickup = async (itemId) => { try { await api.post('/api/ngos/pickup', { itemId }); load() } catch { alert('Failed') } }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Expiring soon items</h3>
      {items.map(i => (
        <div key={i._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-semibold">{i.name}</div>
            <div className="text-sm text-gray-600">Qty: {i.quantityAvailable} | Location: {i.location}</div>
          </div>
          <button onClick={()=>pickup(i._id)} className="px-3 py-1 rounded bg-brand-green text-white">Confirm pickup</button>
        </div>
      ))}
    </div>
  )
}