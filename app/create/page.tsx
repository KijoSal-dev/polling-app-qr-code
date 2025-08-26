import PollForm from '@/components/PollForm'

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Poll</h1>
      <PollForm />
    </div>
  )
}