import { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({})

  const loadItems = async (params = {}) => {
    const { data } = await api.get('/api/items', { params })
    setItems(data)
  }

  useEffect(() => { loadItems(filters) }, [])

  return (
    <AppContext.Provider value={{ items, loadItems, filters, setFilters }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)