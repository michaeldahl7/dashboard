export interface Member {
  id: string
  created_at: Date
  updated_at: Date | null
  user_id: string
  house_id: string
  role: 'admin' | 'member' | null
  user: {
    id: string
    name: string
  }
} 