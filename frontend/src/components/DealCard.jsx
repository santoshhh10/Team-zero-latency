import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { fmtCurrency, pctOff } from '../utils/format'
import { useState } from 'react'
import ReserveModal from './ReserveModal'

dayjs.extend(relativeTime)

export default function DealCard({ item, onReserve, onPickup }) {
  const [open, setOpen] = useState(false)
  const timeLeft = dayjs(item.bestBefore).fromNow(true)
  const percent = pctOff(item.originalPrice, item.discountedPrice)
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded">{percent}% OFF</div>
        {item.veg && <div className="absolute top-2 right-2 bg-brand-green text-white text-xs px-2 py-1 rounded">VEG</div>}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{item.name}</h3>
          <span className="text-xs text-gray-500">Best-before in {timeLeft}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-bold text-gray-900">{fmtCurrency(item.discountedPrice)}</span>
          <span className="text-sm text-gray-400 line-through">{fmtCurrency(item.originalPrice)}</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={()=>setOpen(true)} className="flex-1 bg-brand-red text-white py-2 rounded">Reserve</button>
          <button onClick={()=>onPickup?.(item)} className="flex-1 border py-2 rounded">Pickup</button>
        </div>
      </div>
      {open && <ReserveModal item={item} onClose={()=>setOpen(false)} onReserved={(o)=>{ setOpen(false); onReserve?.(o) }} />}
    </div>
  )
}