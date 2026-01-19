import PostDetailClient from '@/components/PostDetailClient'

// 정적 빌드를 위한 generateStaticParams
export async function generateStaticParams() {
  // 환경 변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // 환경 변수가 없으면 더미 값 반환 (빌드 오류 방지)
    // 실제로는 빌드 환경에서 환경 변수가 설정되어 있어야 함
    return [{ id: '00000000-0000-0000-0000-000000000000' }]
  }

  try {
    // Supabase 클라이언트 생성 (서버 사이드)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 모든 게시글 ID 가져오기
    const { data: posts, error } = await supabase
      .from('board_posts')
      .select('id')
      .limit(1000) // 최대 1000개까지 (필요시 조정)

    if (error || !posts || posts.length === 0) {
      console.warn('Failed to fetch posts for static generation:', error)
      // 빈 배열 대신 더미 값 반환 (output: export에서는 빈 배열 불가)
      return [{ id: '00000000-0000-0000-0000-000000000000' }]
    }

    // { id: 'uuid' } 형태로 반환
    return posts.map((post) => ({
      id: post.id,
    }))
  } catch (error) {
    console.warn('Error in generateStaticParams:', error)
    // 빈 배열 대신 더미 값 반환 (output: export에서는 빈 배열 불가)
    return [{ id: '00000000-0000-0000-0000-000000000000' }]
  }
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return <PostDetailClient postId={params.id} />
}

