import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="mt-3 space-y-2">
        <div><span className="text-gray-500">Name:</span> {user.name}</div>
        <div><span className="text-gray-500">Role:</span> {user.role}</div>
        <div><span className="text-gray-500">Points:</span> {user.points ?? 0}</div>
      </div>
    </div>
  )
}