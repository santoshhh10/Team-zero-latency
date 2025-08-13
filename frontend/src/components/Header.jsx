import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">Surplus <span className="text-brand-green">Food</span></Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-brand-green' : 'text-gray-700'}>Home</NavLink>
          {user?.role === 'canteen' && <NavLink to="/canteen">Canteen</NavLink>}
          {user?.role === 'ngo' && <NavLink to="/ngo">NGO</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin/analytics">Analytics</NavLink>}
          {user ? (
            <div className="flex items-center gap-3">
              <NavLink to="/profile">{user.name} ({user.points ?? 0})</NavLink>
              <button onClick={logout} className="px-3 py-1 rounded bg-gray-100">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="px-3 py-1 rounded bg-brand-red text-white">Sign up</NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}