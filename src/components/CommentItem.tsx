'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CommentItem({
  comment,
  onDelete,
}: {
  comment: any
  onDelete: (id: string) => void
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('board_comments').delete().eq('id', comment.id)

      if (error) throw error

      onDelete(comment.id)
    } catch (error: any) {
      alert('삭제에 실패했습니다: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">
              {comment.profiles?.username || '익명'}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleString('ko-KR')}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{comment.content}</p>
        </div>
        {user && user.id === comment.user_id && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="ml-4 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {loading ? '삭제 중...' : '삭제'}
          </button>
        )}
      </div>
    </div>
  )
}

