'use client'
import { useState, FormEvent } from 'react'


export default function PollForm() {
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)

  const createPoll = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          options: options.filter(opt => opt.trim())
        })
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = `/poll/${data.id}`
      } else {
        alert(data.error || 'Failed to create poll')
      }
    } catch (error) {
      alert('Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={createPoll} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Poll Question
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your favorite color?"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addOption}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Add Option
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-medium"
        >
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </form>
    </div>
  )
}