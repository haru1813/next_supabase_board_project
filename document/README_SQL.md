# Supabase 데이터베이스 설정 가이드

## 실행 방법

1. **Supabase 대시보드 접속**
   - https://supabase.com 에서 프로젝트 생성 또는 기존 프로젝트 선택

2. **SQL Editor 열기**
   - 좌측 메뉴에서 "SQL Editor" 클릭
   - "New query" 버튼 클릭

3. **SQL 스크립트 실행**
   - `supabase_schema.sql` 파일의 내용을 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭하여 실행

## 생성되는 테이블

### 1. profiles
- 사용자 프로필 정보 저장
- auth.users와 1:1 관계

### 2. board_posts
- 게시글 정보 저장
- 작성자, 제목, 내용, 조회수 포함

### 3. board_comments
- 댓글 정보 저장
- 게시글과 사용자에 대한 외래키

### 4. board_post_likes
- 게시글 좋아요 정보 저장
- 복합 기본키 (post_id, user_id)

## 보안 설정

모든 테이블에 Row Level Security (RLS)가 활성화되어 있으며, 다음 정책이 적용됩니다:

- **조회**: 모든 사용자 가능
- **작성**: 인증된 사용자만 가능
- **수정/삭제**: 본인이 작성한 항목만 가능

## 인덱스

성능 최적화를 위해 다음 인덱스가 생성됩니다:

- `idx_board_posts_user_id`: 작성자별 게시글 조회
- `idx_board_posts_created_at`: 최신 게시글 조회
- `idx_board_comments_post_id`: 게시글별 댓글 조회
- `idx_board_comments_user_id`: 사용자별 댓글 조회

## 자동 업데이트

`updated_at` 컬럼은 자동으로 업데이트되도록 트리거가 설정되어 있습니다.

## 주의사항

- 이 스크립트는 한 번만 실행하면 됩니다
- 이미 테이블이 존재하는 경우 `IF NOT EXISTS`로 인해 오류 없이 건너뜁니다
- RLS 정책은 보안상 중요하므로 반드시 확인하세요

