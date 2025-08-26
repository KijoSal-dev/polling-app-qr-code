import VotingCard from '@/components/VotingCard'

interface PollPageProps {
  params: {
    id: string
  }
}

export default function PollPage({ params }: PollPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <VotingCard pollId={params.id} />
    </div>
  )
}