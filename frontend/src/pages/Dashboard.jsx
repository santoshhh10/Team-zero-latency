import Leaderboard from '../components/Leaderboard'

export default function Dashboard() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Leaderboard role="student" />
      <Leaderboard role="canteen" />
      <Leaderboard role="ngo" />
    </div>
  )
}