import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { pollId, optionIndex } = await request.json()

    // Validate input
    if (!pollId || optionIndex === undefined) {
      return NextResponse.json(
        { error: 'Poll ID and option index are required' },
        { status: 400 }
      )
    }

    // Get current user and IP
    const { data: { user } } = await supabase.auth.getUser()
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'

    // Check if user/IP has already voted
    let existingVoteQuery = supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)

    if (user) {
      existingVoteQuery = existingVoteQuery.eq('user_id', user.id)
    } else {
      existingVoteQuery = existingVoteQuery.eq('ip_address', ip)
    }

    const { data: existingVote } = await existingVoteQuery.single()

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this poll' },
        { status: 400 }
      )
    }

    // Insert vote
    const { data: vote, error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_index: optionIndex,
        user_id: user?.id || null,
        ip_address: user ? null : ip
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, vote })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}