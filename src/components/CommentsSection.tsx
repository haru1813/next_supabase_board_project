'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import CommentItem from './CommentItem'

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchComments = async () => {
      // 댓글 조회
      const { data: commentsData, error: commentsError } = await supabase
        .from('board_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (commentsError || !commentsData) {
        setComments([])
        return
      }

      // 프로필 정보 조회
      const userIds = [...new Set(commentsData.map((comment) => comment.user_id))]
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        // 댓글과 프로필 정보 결합
        const commentsWithProfiles = commentsData.map((comment) => ({
          ...comment,
          profiles: profilesData?.find((profile) => profile.id === comment.user_id) || null,
        }))

        setComments(commentsWithProfiles)
      } else {
        setComments(commentsData)
      }
    }

    fetchComments()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!content.trim()) {
      alert('댓글 내용을 입력하세요.')
      return
    }

    setLoading(true)

    try {
      const { data: commentData, error: insertError } = await supabase
        .from('board_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        })
        .select('*')
        .single()

      if (insertError) throw insertError

      // 프로필 정보 조회
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', user.id)
        .single()

      const commentWithProfile = {
        ...commentData,
        profiles: profileData || null,
      }

      setComments([...comments, commentWithProfile])
      setContent('')
    } catch (error: any) {
      alert('댓글 작성에 실패했습니다: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId))
  }

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">댓글 ({comments.length})</h2>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onDelete={handleDelete} />
        ))}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="댓글을 입력하세요..."
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-4 text-center text-sm text-gray-600">
          댓글을 작성하려면 <a href="/login" className="text-blue-600 hover:underline">로그인</a>이 필요합니다.
        </div>
      )}
    </div>
  )
}

