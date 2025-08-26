export interface Poll {
  id: string
  title: string
  options: string[]
  creator_id: string | null
  created_at: string
}

export interface Vote {
  id: string
  poll_id: string
  option_index: number
  user_id: string | null
  ip_address: string | null
  created_at: string
}