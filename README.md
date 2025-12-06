# 서원길 포트폴리오

풀스택 개발자 서원길의 포트폴리오 웹사이트입니다.

🔗 **Live Demo**: [https://GreenSheep01201.github.io/portfolio](https://GreenSheep01201.github.io/portfolio)

## 기술 스택

### Frontend
- React 19
- React Router (HashRouter)
- Framer Motion
- React Markdown
- Lucide React Icons

### 주요 기능
- 반응형 디자인
- 부드러운 스크롤 네비게이션
- 마크다운 기반 블로그 시스템
- 코드 구문 강조 (Syntax Highlighting)

## 프로젝트 구조

```
client/
├── public/
│   ├── favicon.svg       # 사이트 아이콘
│   └── index.html
├── src/
│   ├── components/       # React 컴포넌트
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── TechStack.js
│   │   ├── ProjectCard.js
│   │   ├── BlogItem.js
│   │   ├── BlogDetail.js
│   │   ├── BlogList.js
│   │   └── Footer.js
│   ├── data/
│   │   └── blogPosts.js  # 블로그 콘텐츠
│   ├── App.js
│   └── index.js
└── package.json
```

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# GitHub Pages 배포
npm run deploy
```

## 포함된 프로젝트

- 자재소요계획(MRP) 시스템
- BIN 데이터 관리 시스템
- 온습도 모니터링 대시보드
- 설비 일일점검 시스템
- YOLO 기반 포장 검사 시스템
- 그 외 다수

## 블로그 주제

- Polyglot Persistence 패턴 (MSSQL + MySQL)
- BOM 역전개 알고리즘
- JWT 인증 중앙화와 RBAC
- QR코드 기반 재고 추적
- Early Warning 대시보드
- Raspberry Pi IoT 모니터링
- YOLO 객체 탐지 활용

## 라이선스

MIT License
