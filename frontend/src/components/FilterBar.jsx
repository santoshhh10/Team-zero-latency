export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex gap-3 items-center text-sm">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!filters?.veg} onChange={e=>onChange?.({ ...filters, veg: e.target.checked })} />
        Veg only
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={!!filters?.expiringSoon} onChange={e=>onChange?.({ ...filters, expiringSoon: e.target.checked })} />
        Expiring soon
      </label>
    </div>
  )
}