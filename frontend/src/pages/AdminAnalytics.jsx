import { useEffect, useState } from 'react'
import api from '../utils/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [range, setRange] = useState({ from: '', to: '' })

  const load = async () => {
    const { data } = await api.get('/api/admin/analytics', { params: { ...range } })
    setStats(data)
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Filters</h3>
        <div className="flex gap-2">
          <input type="date" value={range.from} onChange={e=>setRange({...range, from:e.target.value})} className="border rounded px-2 py-1" />
          <input type="date" value={range.to} onChange={e=>setRange({...range, to:e.target.value})} className="border rounded px-2 py-1" />
          <button className="px-3 py-1 rounded bg-brand-green text-white" onClick={load}>Apply</button>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Totals</h4>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Items saved" value={stats.total_items_saved} />
              <Metric label="People served" value={stats.total_people_served} />
              <Metric label="CO₂ saved (kg)" value={stats.estimated_co2_saved} />
              <Metric label="Water saved (L)" value={stats.estimated_water_saved} />
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Sample chart</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={[{name:'Mon', value: 3},{name:'Tue', value: 5},{name:'Wed', value: 2},{name:'Thu', value: 7},{name:'Fri', value: 4}] }>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2E7D32" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="bg-gray-50 rounded p-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}