'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import PostActions from '@/components/PostActions'
import CommentsSection from '@/components/CommentsSection'

export default function PostDetailClient({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPost = async () => {
      // 더미 ID인 경우 처리하지 않음
      if (postId === '00000000-0000-0000-0000-000000000000') {
        setError('게시글을 찾을 수 없습니다.')
        setLoading(false)
        return
      }

      try {
        // 환경 변수 확인
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Supabase 환경 변수가 설정되지 않았습니다.')
          setLoading(false)
          return
        }

        // 게시글 조회
        const { data: postData, error: postError } = await supabase
          .from('board_posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (postError) {
          console.error('게시글 조회 오류:', postError)
          throw postError
        }
        
        if (!postData) {
          setError('게시글을 찾을 수 없습니다.')
          setLoading(false)
          return
        }

        // 프로필 정보 조회
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', postData.user_id)
          .single()

        // 프로필이 없어도 게시글은 표시
        const postWithProfile = {
          ...postData,
          profiles: profileError ? null : profileData,
        }

        setPost(postWithProfile)

        // 조회수 증가 (에러가 나도 게시글은 표시)
        try {
          await supabase
            .from('board_posts')
            .update({ views: postData.views + 1 })
            .eq('id', postId)
        } catch (viewError) {
          console.warn('조회수 증가 실패:', viewError)
        }

        // 사용자 정보 가져오기
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          setUser(user)
        } catch (authError) {
          console.warn('사용자 정보 가져오기 실패:', authError)
          setUser(null)
        }
      } catch (err: any) {
        console.error('게시글 로드 오류:', err)
        setError(err.message || '게시글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, supabase])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link href="/posts" className="text-blue-600 hover:text-blue-800">
            ← 목록으로
          </Link>
        </div>
        <div className="p-4 text-red-600">
          {error || '게시글을 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link href="/posts" className="text-blue-600 hover:text-blue-800">
          ← 목록으로
        </Link>
      </div>

      <article className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>작성자: {post.profiles?.username || '익명'}</span>
            <span>조회수: {post.views}</span>
            <span>{new Date(post.created_at).toLocaleString('ko-KR')}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
        </div>

        {user && user.id === post.user_id && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <PostActions postId={post.id} />
          </div>
        )}
      </article>

      <CommentsSection postId={post.id} />
    </div>
  )
}

