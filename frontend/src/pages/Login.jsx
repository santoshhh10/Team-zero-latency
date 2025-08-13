import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('alice@student.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await login(email, password); nav('/') } catch { alert('Login failed') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded w-full px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-brand-red text-white py-2 rounded">{loading ? '...' : 'Login'}</button>
      </form>
      <p className="text-sm mt-3">No account? <Link className="text-brand-green" to="/register">Register</Link></p>
    </div>
  )
}