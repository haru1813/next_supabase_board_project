-- ============================================
-- Supabase 데이터베이스 스키마 생성 SQL
-- Next.js Supabase 게시판 프로젝트
-- ============================================

-- 1. profiles 테이블 생성
-- 사용자 프로필 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. board_posts 테이블 생성
-- 게시글 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS public.board_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. board_comments 테이블 생성
-- 댓글 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS public.board_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.board_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. board_post_likes 테이블 생성
-- 게시글 좋아요 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS public.board_post_likes (
    post_id UUID NOT NULL REFERENCES public.board_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- ============================================
-- 인덱스 생성
-- ============================================

-- board_posts 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_board_posts_user_id ON public.board_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON public.board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_title ON public.board_posts USING gin(to_tsvector('english', title));

-- board_comments 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_board_comments_post_id ON public.board_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_board_comments_user_id ON public.board_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_board_comments_created_at ON public.board_comments(created_at DESC);

-- board_post_likes 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_board_post_likes_user_id ON public.board_post_likes(user_id);

-- ============================================
-- 함수 생성
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_board_posts
    BEFORE UPDATE ON public.board_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_board_comments
    BEFORE UPDATE ON public.board_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Row Level Security (RLS) 정책 설정
-- ============================================

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_post_likes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 프로필 조회 가능
CREATE POLICY "프로필 조회는 모든 사용자 가능"
    ON public.profiles
    FOR SELECT
    USING (true);

-- 인증된 사용자만 프로필 생성 가능
CREATE POLICY "인증된 사용자만 프로필 생성 가능"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 본인만 프로필 수정 가능
CREATE POLICY "본인만 프로필 수정 가능"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- board_posts 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 게시글 조회 가능
CREATE POLICY "게시글 조회는 모든 사용자 가능"
    ON public.board_posts
    FOR SELECT
    USING (true);

-- 인증된 사용자만 게시글 작성 가능
CREATE POLICY "인증된 사용자만 게시글 작성 가능"
    ON public.board_posts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 본인이 작성한 게시글만 수정 가능
CREATE POLICY "본인만 게시글 수정 가능"
    ON public.board_posts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 본인이 작성한 게시글만 삭제 가능
CREATE POLICY "본인만 게시글 삭제 가능"
    ON public.board_posts
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- board_comments 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 댓글 조회 가능
CREATE POLICY "댓글 조회는 모든 사용자 가능"
    ON public.board_comments
    FOR SELECT
    USING (true);

-- 인증된 사용자만 댓글 작성 가능
CREATE POLICY "인증된 사용자만 댓글 작성 가능"
    ON public.board_comments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 본인이 작성한 댓글만 수정 가능
CREATE POLICY "본인만 댓글 수정 가능"
    ON public.board_comments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 본인이 작성한 댓글만 삭제 가능
CREATE POLICY "본인만 댓글 삭제 가능"
    ON public.board_comments
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- board_post_likes 테이블 RLS 정책
-- ============================================

-- 모든 사용자가 좋아요 조회 가능
CREATE POLICY "좋아요 조회는 모든 사용자 가능"
    ON public.board_post_likes
    FOR SELECT
    USING (true);

-- 인증된 사용자만 좋아요 추가 가능
CREATE POLICY "인증된 사용자만 좋아요 추가 가능"
    ON public.board_post_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 본인이 추가한 좋아요만 삭제 가능
CREATE POLICY "본인만 좋아요 삭제 가능"
    ON public.board_post_likes
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 초기 데이터 (선택사항)
-- ============================================

-- 주석 처리된 샘플 데이터
/*
-- 샘플 프로필 생성 (실제 사용 시 주석 해제)
INSERT INTO public.profiles (id, username)
VALUES 
    ('user-uuid-1', 'admin'),
    ('user-uuid-2', 'user1');
*/

-- ============================================
-- 완료 메시지
-- ============================================
-- 이 SQL 스크립트는 Supabase SQL Editor에서 실행하세요.
-- 실행 순서:
-- 1. Supabase 대시보드 접속
-- 2. SQL Editor 메뉴 선택
-- 3. 이 스크립트 전체를 복사하여 붙여넣기
-- 4. Run 버튼 클릭하여 실행

