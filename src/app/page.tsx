'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          게시판에 오신 것을 환영합니다
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Next.js와 Supabase를 활용한 게시판 프로젝트입니다.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          {loading ? (
            <div className="text-gray-500">로딩 중...</div>
          ) : user ? (
            <>
              <Link
                href="/posts"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                게시판 보기
              </Link>
              <Link
                href="/posts/new"
                className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white hover:bg-green-700"
              >
                글쓰기
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-300"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
