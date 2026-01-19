# Next.js Supabase 게시판 프로젝트

Next.js와 Supabase를 활용한 사용자 인증 및 게시판 CRUD 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 게시글 CRUD (생성, 조회, 수정, 삭제)
- ✅ 댓글 기능 (작성, 삭제)
- ✅ 조회수 기능
- ✅ 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database)
- **배포**: GitHub Pages

## 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://daiufkxhanqiiasgwvol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaXVma3hoYW5xaWlhc2d3dm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTkzMzIsImV4cCI6MjA4NDMzNTMzMn0.xRDeD8eao7g7k7FkPxwArM6hP7I2tmEAT3k7ObnMHa8
```

### 2. Supabase 데이터베이스 설정

1. Supabase 대시보드에 접속
2. SQL Editor 열기
3. `document/supabase_schema.sql` 파일의 내용을 복사하여 실행

### 3. 의존성 설치

```bash
npm install
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── login/              # 로그인 페이지
│   ├── signup/             # 회원가입 페이지
│   ├── posts/              # 게시판 페이지
│   │   ├── page.tsx        # 게시글 목록
│   │   ├── new/            # 게시글 작성
│   │   └── [id]/           # 게시글 상세/수정
│   └── layout.tsx          # 루트 레이아웃
├── components/             # 재사용 가능한 컴포넌트
│   ├── Header.tsx          # 헤더 네비게이션
│   ├── PostActions.tsx     # 게시글 수정/삭제 버튼
│   ├── CommentsSection.tsx # 댓글 섹션
│   └── CommentItem.tsx     # 댓글 아이템
├── lib/                    # 유틸리티 함수
│   └── supabase/           # Supabase 클라이언트
│       ├── client.ts       # 브라우저 클라이언트
│       ├── server.ts       # 서버 클라이언트
│       └── middleware.ts   # 미들웨어
└── types/                  # TypeScript 타입 정의
    └── database.types.ts   # 데이터베이스 타입
```

## 데이터베이스 스키마

- `profiles`: 사용자 프로필 정보
- `board_posts`: 게시글 정보
- `board_comments`: 댓글 정보
- `board_post_likes`: 게시글 좋아요 정보

자세한 내용은 `document/DB 설계도.html`을 참조하세요.

## 배포

GitHub Pages로 배포하려면:

```bash
npm run deploy
```

## 라이선스

MIT
