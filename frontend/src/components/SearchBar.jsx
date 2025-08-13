import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  return (
    <div className="flex gap-2">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search items or canteen..." className="border rounded px-3 py-2 w-full" />
      <button onClick={()=>onSearch?.(q)} className="px-4 py-2 rounded bg-brand-green text-white">Search</button>
    </div>
  )
}