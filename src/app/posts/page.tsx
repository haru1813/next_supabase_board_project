'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 게시글 조회
        const { data: postsData, error: postsError } = await supabase
          .from('board_posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (postsError) throw postsError

        if (!postsData || postsData.length === 0) {
          setPosts([])
          setLoading(false)
          return
        }

        // 프로필 정보 조회
        const userIds = [...new Set(postsData.map((post) => post.user_id))]
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        if (profilesError) throw profilesError

        // 게시글과 프로필 정보 결합
        const postsWithProfiles = postsData.map((post) => ({
          ...post,
          profiles: profilesData?.find((profile) => profile.id === post.user_id) || null,
        }))

        setPosts(postsWithProfiles)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="p-4 text-red-600">에러: {error}</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">게시판</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          글쓰기
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>작성자: {post.profiles?.username || '익명'}</span>
                <span>조회수: {post.views}</span>
                <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-gray-600">{post.content}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">아직 게시글이 없습니다.</p>
          <Link
            href="/posts/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            첫 게시글 작성하기
          </Link>
        </div>
      )}
    </div>
  )
}

