# Netlify 배포 설정 가이드

## 환경 변수 설정

Netlify에서 빌드가 성공하려면 다음 환경 변수를 설정해야 합니다:

### 1. Netlify 대시보드에서 환경 변수 설정

1. Netlify 대시보드 접속
2. 프로젝트 선택
3. **Site settings** → **Environment variables** 메뉴로 이동
4. 다음 환경 변수 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://daiufkxhanqiiasgwvol.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhaXVma3hoYW5xaWlhc2d3dm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTkzMzIsImV4cCI6MjA4NDMzNTMzMn0.xRDeD8eao7g7k7FkPxwArM6hP7I2tmEAT3k7ObnMHa8
```

### 2. 빌드 설정 확인

- **Build command**: `npm run build`
- **Publish directory**: `.next` (또는 `out` - Next.js 설정에 따라)

### 3. 빌드 재시작

환경 변수를 설정한 후:
1. **Deploys** 탭으로 이동
2. **Trigger deploy** → **Clear cache and deploy site** 클릭

## 참고사항

- 환경 변수는 빌드 시점에 사용되므로, 설정 후 반드시 빌드를 재시작해야 합니다
- `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트 사이드에서도 접근 가능합니다
- 보안을 위해 실제 프로덕션에서는 환경 변수를 안전하게 관리하세요

