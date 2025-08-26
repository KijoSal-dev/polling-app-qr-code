import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Polling App</h1>
      <p className="text-xl mb-8 text-gray-600">
        Create polls, share with QR codes, and see results in real-time
      </p>
      
      <div className="flex gap-4 justify-center">
        <Link 
          href="/create"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Create New Poll
        </Link>
        
        <Link 
          href="/dashboard"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
        >
          View My Polls
        </Link>
      </div>
    </div>
  )
}