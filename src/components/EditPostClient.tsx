'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EditPostClient({ postId }: { postId: string }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPost, setLoadingPost] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPost = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: post, error } = await supabase
        .from('board_posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error || !post) {
        setError('게시글을 불러올 수 없습니다.')
        setLoadingPost(false)
        return
      }

      if (post.user_id !== user.id) {
        router.push(`/posts/${postId}`)
        return
      }

      setTitle(post.title)
      setContent(post.content)
      setLoadingPost(false)
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('board_posts')
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)

      if (updateError) throw updateError

      router.push(`/posts/${postId}`)
      router.refresh()
    } catch (error: any) {
      setError(error.message || '게시글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingPost) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">게시글 수정</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            제목
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="제목을 입력하세요"
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            내용
          </label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '수정 중...' : '수정'}
          </button>
        </div>
      </form>
    </div>
  )
}

