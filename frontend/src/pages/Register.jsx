import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { register } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await register({ name, email, password, role }); nav('/') } catch { alert('Register failed') } finally { setLoading(false) }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded w-full px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded w-full px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="border rounded w-full px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="canteen">Canteen</option>
          <option value="ngo">NGO</option>
        </select>
        <button disabled={loading} className="w-full bg-brand-red text-white py-2 rounded">{loading ? '...' : 'Create account'}</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link className="text-brand-green" to="/login">Login</Link></p>
    </div>
  )
}