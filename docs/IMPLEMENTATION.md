# ZIPPO 홈 구현

기준: `project.md`, `design.md`, Figma `292:2` 및 타이포그래피 보드 `239:164`.

## 페이지 연결

`App.jsx` → `pages/HomePage.jsx`에서 다음 컴포넌트를 순서대로 조합한다.

| 영역              | 컴포넌트                         | 이동 대상                                      |
| ----------------- | -------------------------------- | ---------------------------------------------- |
| Header            | SiteHeader                       | SHOP 페이지 / ABOUT·CONTACT·FAQ 홈 앵커, 모바일 메뉴 |
| Hero              | HeroSection                      | #home                                          |
| Con 01            | CollectionSection + ProductCard  | #collection                                    |
| Con 02            | BrandStorySection                | #story                                         |
| Con 03            | SocialGallerySection             | #gallery                                       |
| Con 04            | CampaignSection + NewsletterForm | #archive                                       |
| Con 05            | ExploreSection                   | #explore                                       |
| Footer navigation | FooterNav                        | 홈 섹션 앵커                                   |
| Footer            | SiteFooter + NewsletterForm      | #footer / #support                             |

공통 사진 컴포넌트는 `Picture`, 워드마크는 `Wordmark`다. 제품·내비게이션·카테고리는 `src/data`에서 관리한다. 스타일은 `tokens.css`, `global.css`, `desktop.css`, `responsive.css`로 분리했다.

## 디자인 및 반응형

- 1920px에서 시안의 전체 높이 11391px, 주요 섹션 높이와 사진 비율을 맞췄다. 루트의 4~5px 오프셋과 캠페인 시작의 3px 겹침은 정상 문서 흐름으로 정리했다.
- 큰 ZIPPO 글자는 Figma 텍스트 레이어를 SVG로 내보내 글리프까지 보존했다. 불꽃과 좌우 원형 아이콘은 Figma 제공 자산이다.
- 1200px 이하에서 작은 텍스트와 푸터를 보정하고, 768px 이하에서는 모바일 메뉴·세로 스토리·캠페인·푸터를 적용한다. 480px 이하의 갤러리는 1열이다.
- 전체 화면을 transform으로 축소하지 않는다. 사진 크롭, Grid/Flex, 콘텐츠에 맞는 높이로 반응한다.
- 시안 원문의 `TOTHE`, 흰색 해시태그는 유지했다. CLASSIC의 임시 `TEXT`와 빈 가격 종이는 사용자 요청으로 시안용 제품명·가격으로 채웠다. 상세 내용은 [SHOP.md](SHOP.md)에 기록했다.
- GSAP은 섹션 제목의 짧은 진입 모션에만 사용하고 컴포넌트 해제 시 정리한다. `prefers-reduced-motion`에서는 모션과 부드러운 스크롤을 비활성화한다.

## 자산

모든 런타임 사진·SVG·폰트는 `public`에서 제공한다. 만료되는 Figma URL이나 외부 폰트 서버에 의존하지 않는다. PNG 원본은 보존하고 같은 해상도의 WebP(quality 96)를 별도로 생성했다. `asset-manifest.json`에서 실제 픽셀 크기를 확인할 수 있다.

| 제품 | 기본 원본 노드 | 호버 원본 노드            |
| ---- | -------------- | ------------------------- |
| 민트 | 292:35         | 335:146, 코랄 의상 여성   |
| 레드 | 292:38         | 292:70, 초록 셔츠 남성    |
| 블랙 | 292:41         | 335:147, 보라색 의상 여성 |
| 크롬 | 292:44         | 335:148, 파란 셔츠 남성   |

Hero 원본은 1639×959, Campaign 원본은 1543×1019이며 1920px 데스크톱에서 확대 표시된다. 추가 디테일을 생성하거나 원본 해상도가 개선되었다고 처리하지 않았다.

## 동작 범위

- 실제 동작: 앵커 이동, 모바일 메뉴와 Escape 닫기, 제품 이미지의 hover/키보드 focus 전환, 가로 스크롤·방향키·이전/다음 버튼, 컬렉션 탭, 안내 다이얼로그, 이메일 형식 검사.
- EMBLEM/LIMITED는 공식몰 상품 각 4개로 구성하며 각각 ARMOR/540 COLOR에 연결한다. 공식 제품 사진과 별도 생성 연출 사진을 호버로 교체한다.
- SHOP, 상품 상세, CART, Explore 카테고리별 목록은 연결했다. 구현·영상 분석·상품 출처·검수는 [SHOP.md](SHOP.md)를 참고한다. 전체 갤러리와 푸터 세부 페이지는 준비 중 안내를 제공한다.
- 뉴스레터 서버는 연결하지 않았다. 유효한 이메일에도 신청 완료로 표시하지 않고, 저장하지 않았음을 안내한다.
- 배포·저장소 푸시·상거래 서버 연결은 수행하지 않았다.

## 실행과 검수

```sh
npm install
npm run dev -- --host 127.0.0.1
```

미리보기: http://127.0.0.1:5173/

```sh
npm run build
npm run lint
# 개발 서버 실행 상태에서:
npm run verify
```

Playwright 브라우저가 없는 환경에서는 `npx playwright install chromium`을 먼저 실행한다. `verify`는 1920 / 1440 / 1024 / 768 / 390px의 전체 화면을 저장하고 이미지 로딩, 가로 넘침, 런타임 오류, 탭, 캐러셀, 키보드 이미지 전환, 다이얼로그, 이메일 검증, 모바일 메뉴를 점검한다. 결과는 `verification.json`, 캡처는 `screenshots/home-{width}.png`에 있다.

1920px 구현 캡처와 Figma 원본을 섹션별로 육안 비교해 로고 위치, 첫 카드 여백, 스토리 회전, 갤러리 간격, Explore와 푸터 위치를 보정했다.
