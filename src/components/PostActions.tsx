'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PostActions({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('board_posts').delete().eq('id', postId)

      if (error) throw error

      router.push('/posts')
      router.refresh()
    } catch (error: any) {
      alert('삭제에 실패했습니다: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => router.push(`/posts/${postId}/edit`)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        수정
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? '삭제 중...' : '삭제'}
      </button>
    </div>
  )
}

