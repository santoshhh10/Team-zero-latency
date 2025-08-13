import { useApp } from '../context/AppContext'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import DealCard from '../components/DealCard'
import api from '../utils/api'

export default function Home() {
  const { items, loadItems, filters, setFilters } = useApp()
  return (
    <div className="space-y-4">
      <SearchBar onSearch={(q)=>loadItems({ ...filters, q })} />
      <FilterBar filters={filters} onChange={(f)=>{ setFilters(f); loadItems(f) }} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <DealCard key={item._id} item={item} onReserve={()=>{}} onPickup={async (it)=>{
            try { await api.post('/api/orders/walkin', { itemId: it._id, quantity: 1 }); alert('Walk-in recorded'); loadItems(filters) } catch (e) { alert('Failed') }
          }} />
        ))}
      </div>
    </div>
  )
}