'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import QRCodeGenerator from '@/components/QRCode'

interface Poll {
  id: string
  title: string
  options: string[]
  created_at: string
  vote_count?: number
}

export default function DashboardPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPolls()
  }, [])

  const fetchUserPolls = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setPolls([])
        setLoading(false)
        return
      }

      // Fetch user's polls with vote counts
      const { data: pollsData } = await supabase
        .from('polls')
        .select(`
          *,
          votes(count)
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      // Process the data to include vote counts
      const pollsWithCounts = pollsData?.map(poll => ({
        ...poll,
        vote_count: poll.votes?.[0]?.count || 0
      })) || []

      setPolls(pollsWithCounts)
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll?')) return

    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (!error) {
      setPolls(polls.filter(poll => poll.id !== pollId))
    }
  }

  if (loading) {
    return <div className="text-center">Loading your polls...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Polls</h1>
      
      {polls.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-4">You haven't created any polls yet.</p>
          <a 
            href="/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Your First Poll
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-xl font-semibold mb-2">{poll.title}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {poll.options.length} options • {poll.vote_count} votes
                </p>
                <p className="text-sm text-gray-500">
                  Created {new Date(poll.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Share this poll:</p>
                <div className="flex items-center gap-4">
                  <QRCodeGenerator pollId={poll.id} />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Poll URL:</p>
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}/poll/${poll.id}`}
                      className="text-xs bg-gray-100 p-2 rounded border w-full"
                      onClick={(e) => e.currentTarget.select()}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a 
                  href={`/poll/${poll.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View Poll
                </a>
                <button 
                  onClick={() => deletePoll(poll.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}