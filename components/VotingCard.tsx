'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import QRCodeGenerator from './QRCode'

interface Poll {
  id: string
  title: string
  options: string[]
}

interface VoteCount {
  option_index: number
  count: number
}

export default function VotingCard({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [voteCounts, setVoteCounts] = useState<number[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    fetchPoll()
    fetchVotes()
    checkIfVoted()
    subscribeToVotes()
  }, [pollId])

  const fetchPoll = async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single()

    if (data) {
      setPoll(data)
      // Initialize vote counts array
      setVoteCounts(new Array(data.options.length).fill(0))
    }
  }

  const fetchVotes = async () => {
    const { data } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId)

    if (data && poll) {
      const counts = new Array(poll.options.length).fill(0)
      data.forEach(vote => {
        if (vote.option_index < counts.length) {
          counts[vote.option_index]++
        }
      })
      setVoteCounts(counts)
    }
    setLoading(false)
  }

  const checkIfVoted = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    let query = supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)

    if (user) {
      query = query.eq('user_id', user.id)
    }

    const { data } = await query.single()
    setHasVoted(!!data)
  }

  const vote = async (optionIndex: number) => {
    setVoting(true)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          optionIndex
        })
      })

      const data = await response.json()

      if (response.ok) {
        setHasVoted(true)
        // Refresh vote counts
        fetchVotes()
      } else {
        alert(data.error || 'Failed to vote')
      }
    } catch (error) {
      alert('Failed to vote')
    } finally {
      setVoting(false)
    }
  }

  const subscribeToVotes = () => {
    const channel = supabase
      .channel(`poll-${pollId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`,
        },
        () => fetchVotes()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  const totalVotes = voteCounts.reduce((sum, count) => sum + count, 0)

  const getPercentage = (count: number) => {
    return totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow text-center">
        Loading poll...
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Poll Not Found</h2>
        <p className="text-gray-600">This poll doesn't exist or has been deleted.</p>
        <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go Home
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-center">{poll.title}</h2>

      {hasVoted ? (
        // Show results
        <div className="space-y-4">
          <h3 className="font-semibold text-center mb-4">
            Results ({totalVotes} votes)
          </h3>
          
          {poll.options.map((option, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <span>{option}</span>
                <span className="font-semibold">
                  {voteCounts[index]} ({getPercentage(voteCounts[index])}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getPercentage(voteCounts[index])}%` }}
                ></div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-600 mb-3">Share this poll:</p>
            <QRCodeGenerator pollId={pollId} />
          </div>
        </div>
      ) : (
        // Show voting options
        <div className="space-y-3">
          <p className="text-sm text-gray-600 text-center mb-4">
            Choose your option:
          </p>
          
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => vote(index)}
              disabled={voting}
              className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors disabled:opacity-50"
            >
              {option}
            </button>
          ))}

          {voting && (
            <p className="text-center text-blue-600">Submitting vote...</p>
          )}
        </div>
      )}
    </div>
  )
}