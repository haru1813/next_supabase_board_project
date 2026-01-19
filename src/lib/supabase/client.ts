import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = 
      '⚠️ Supabase 환경 변수가 설정되지 않았습니다.\n' +
      '프로젝트 루트에 .env.local 파일을 생성하고 다음 내용을 추가하세요:\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL=https://daiufkxhanqiiasgwvol.supabase.co\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaXVma3hoYW5xaWlhc2d3dm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTkzMzIsImV4cCI6MjA4NDMzNTMzMn0.xRDeD8eao7g7k7FkPxwArM6hP7I2tmEAT3k7ObnMHa8\n\n' +
      '환경 변수 설정 후 개발 서버를 재시작하세요: npm run dev'
    
    // 서버 사이드 (빌드 시점)에서는 더미 클라이언트 반환
    if (typeof window === 'undefined') {
      console.warn('Server-side: Missing Supabase env vars, using placeholder')
      return createBrowserClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
      )
    }
    
    // 클라이언트 사이드에서는 명확한 오류 표시
    console.error(errorMessage)
    alert('Supabase 환경 변수가 설정되지 않았습니다. 브라우저 콘솔을 확인하세요.')
    
    // 실제 환경 변수가 없으면 실제 Supabase URL 사용 (환경 변수가 번들에 포함되어야 함)
    // 개발 환경에서는 .env.local이 자동으로 로드되어야 함
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

