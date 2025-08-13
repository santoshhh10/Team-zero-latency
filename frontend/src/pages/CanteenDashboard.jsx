import { useEffect, useState } from 'react'
import api from '../utils/api'
import ScannerView from '../components/ScannerView'

export default function CanteenDashboard() {
  const [items, setItems] = useState([])
  const [showScanner, setShowScanner] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', quantityTotal: 10, originalPrice: 100, discountedPrice: 50, veg: true, location: 'Campus', bestBefore: '', start: '', end: '' })
  const [studentEmail, setStudentEmail] = useState('')

  const load = async () => { const { data } = await api.get('/api/items'); setItems(data) }
  useEffect(()=>{ load() }, [])

  const create = async (e) => {
    e.preventDefault()
    const payload = { ...form, availabilityWindow: { start: form.start, end: form.end }, images: [] }
    const { data } = await api.post('/api/items', payload)
    setForm({ ...form, name: '', description: '' })
    load()
  }

  const serve = async (id) => {
    try { await api.post('/api/orders/walkin', { itemId: id, quantity: 1, studentEmail: studentEmail || undefined }); setStudentEmail(''); load() } catch { alert('Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Quick add item</h3>
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input className="border rounded px-2 py-1" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="border rounded px-2 py-1" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <input className="border rounded px-2 py-1" type="number" placeholder="Qty" value={form.quantityTotal} onChange={e=>setForm({...form, quantityTotal:Number(e.target.value)})} />
          <input className="border rounded px-2 py-1" type="number" placeholder="Original Price" value={form.originalPrice} onChange={e=>setForm({...form, originalPrice:Number(e.target.value)})} />
          <input className="border rounded px-2 py-1" type="number" placeholder="Discounted Price" value={form.discountedPrice} onChange={e=>setForm({...form, discountedPrice:Number(e.target.value)})} />
          <input className="border rounded px-2 py-1" placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.veg} onChange={e=>setForm({...form, veg:e.target.checked})} /> Veg</label>
          <input className="border rounded px-2 py-1" type="datetime-local" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
          <input className="border rounded px-2 py-1" type="datetime-local" value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
          <input className="border rounded px-2 py-1" type="datetime-local" value={form.bestBefore} onChange={e=>setForm({...form, bestBefore:e.target.value})} />
          <button className="bg-brand-green text-white rounded px-3 py-2">Create</button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Your items</h3>
        <button onClick={()=>setShowScanner(!showScanner)} className="border px-3 py-1 rounded">{showScanner ? 'Hide' : 'QR Scanner'}</button>
      </div>
      {showScanner && <div className="bg-white p-4 rounded shadow"><ScannerView /></div>}

      <div className="bg-white p-4 rounded shadow flex items-center gap-2">
        <input className="border rounded px-2 py-1 flex-1" placeholder="Student email (optional)" value={studentEmail} onChange={e=>setStudentEmail(e.target.value)} />
        <span className="text-sm text-gray-500">Use when serving walk-in to attach points</span>
      </div>

      <div className="grid gap-3">
        {items.map(i => (
          <div key={i._id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">Available: {i.quantityAvailable}</div>
            </div>
            <button onClick={()=>serve(i._id)} className="px-3 py-1 rounded bg-brand-red text-white">Serve Walk-in</button>
          </div>
        ))}
      </div>
    </div>
  )
}