import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Leaderboard({ role }) {
  const [rows, setRows] = useState([])
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/api/users/leaderboard', { params: { role } }); setRows(data) })() }, [role])
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Leaderboard {role ? `(${role})` : ''}</h3>
      <ul className="divide-y">
        {rows.map((r) => (
          <li key={r._id} className="flex items-center justify-between py-2">
            <span>{r.name} <span className="text-xs text-gray-500">{r.role}</span></span>
            <span className="font-semibold">{r.points}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}