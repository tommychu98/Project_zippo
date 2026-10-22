# ZIPPO 홈 모션

2026-10-22. 기존 레이아웃, 폰트, 색상, 이미지 자산과 상품 호버를 유지하며 GSAP/ScrollTrigger를 적용했다. 네이티브 스크롤을 사용하고 pin이나 추가 스크롤 높이를 만들지 않는다.

## 영상 분석과 적용

아래 페이지의 `<source>`에 연결된 원본 MP4를 내려받고 각 영상에서 20개 시점의 프레임을 추출해 직접 비교했다. 추출 도구는 `scripts/analyze-motion-references.mjs`, 영상·프레임·콘택트 시트는 Git에서 제외한 `docs/screenshots/motion-references/`에 있다. 프레임의 시각은 녹화 영상 내 시각이며 실제 사이트의 애니메이션 시간을 측정한 값은 아니다.

| 레퍼런스 | 확인한 움직임 | ZIPPO 적용 |
|---|---|---|
| [Oaksun Studio](https://www.awwwards.com/inspiration/text-reveal-animation-oaksun-studio) · 2.833초 | 약 0.63~1.78초에 본문이 위에서 아래, 왼쪽에서 오른쪽으로 이어지며 나타난다. | 제목은 줄별 이동·페이드, 스토리 본문은 단어별 페이드로 읽는 순서를 유지한다. 전체 제목의 시간차는 최대 0.36초, 본문은 0.42초로 제한한다. |
| [Giulia Gartner](https://www.awwwards.com/inspiration/heading-scroll-photo-mask-giulia-gartner) · 6.8초 | 약 0.05~1.46초에 사진의 상단 경계가 올라가고 사진 내부 구도도 함께 이동한다. 제목과 사진은 서로 다른 속도로 움직인다. | 스토리·갤러리의 마스크 열림과 이미지 축소를 분리하고, 별도 내부 래퍼로 약한 패럴랙스를 더한다. 갤러리는 DOM 순서인 대형→오른쪽 위→오른쪽 아래에 각각 0/0.12/0.24초 지연을 둔다. 각 사진이 화면에 들어온 뒤 실행하므로 아래 사진을 미리 재생하지 않는다. |
| [Oakley](https://www.awwwards.com/inspiration/scroll-animation-oakley-crush-ordinary) · 13.716초 | 약 0.77~2.20초에 작은 고글 내부의 영상 영역이 화면을 채우며 캠페인 영상으로 이어진다. | 고글 형태를 중앙 직사각형 마스크로 바꿔 기존 오렌지 셔츠 화보에 적용한다. 배너 크기를 변경하지 않고 clip-path만 확장한다. 확장이 끝나면 카피와 링크를 한 번 재생한다. |

## 구성

- `src/hooks/useSectionMotion.js`: 섹션마다 `useGSAP`와 `gsap.matchMedia`를 생성한다. unmount, 컬렉션 변경, 반응형·접근성 설정 변경 시 해당 context만 복구한다.
- `src/motion/homeMotion.js`: 섹션별 타임라인과 트리거. 일반 등장은 최초 진입 시 한 번, 사진 패럴랙스 4개와 캠페인 확장 1개만 scrub을 사용한다.
- `RevealLines`: 원래 줄바꿈과 행간을 유지한다. 마스크의 바깥쪽 여유로 작은 행간의 글리프가 잘리지 않게 한다.
- `MotionPicture`: 기존 회전 프레임 / 마스크 / 패럴랙스 / 확대 래퍼를 분리한다. 패럴랙스 경계에 여백이 생기지 않도록 내부에만 작은 여유를 둔다.
- 제품 카드는 `.product-reveal` 래퍼에만 등장 transform을 적용한다. 상품 사진의 hover/focus opacity와 가격 배지 회전은 그대로 둔다.
- Explore 구분선은 원래 border의 공간을 보존한 채 의사 요소를 scaleX로 펼친다. 그 뒤 각 행의 라벨·제목을 재생한다.
- 이미지·폰트 로딩, 브라우저 복원 후 ScrollTrigger 위치를 다시 측정한다. 기본 HTML/CSS는 표시 상태이므로 reduced-motion에서는 콘텐츠가 즉시 보이고 추가 트리거도 생성하지 않는다.
- SHOP 라우트 전환 시 새 페이지를 mount하기 전에 이전 스크롤을 초기화한다. 이전 SHOP 푸터 위치 때문에 홈 모션이 미리 완료되는 것을 방지한다.
- 빠른 스크롤로 지나친 등장은 완료 상태로 만든다. 푸터의 시작 위치는 최대 스크롤 위치에 clamp하여 도달할 수 없는 트리거를 방지한다.

모바일에서는 제목 이동량·사진 확대·패럴랙스·지연·캠페인 마스크 크기를 줄였다. 캠페인 최종 이미지의 크기와 object-position에는 transform을 적용하지 않는다.

추가 요청: 스토리 뒤의 노란 띠 두 줄은 스크롤과 관계없이 계속 흐른다. `KEEP THE FLAME ALIVE`는 왼쪽, `THE POCKET ARCHIVE`는 오른쪽으로 이동한다. 동일한 텍스트 그룹을 복제해 경계에서 끊김 없이 반복하며, 띠의 회전은 바깥 래퍼에 유지한다. 한 바퀴는 데스크톱 50초, 모바일 60초이고 reduced-motion에서는 정지한다. 1920 / 768 / 390px에서 이동 방향, 반복 설정, 띠 전체의 텍스트 채움, 가로 넘침과 reduced-motion 정리를 확인했고 lint/build를 통과했다.

## 검증

```powershell
$env:PREVIEW_URL='http://127.0.0.1:5174'
npm run verify:motion
npm run verify
npm run verify:shop
npm run lint
npm run build
```

`verify:motion`은 1920 / 1440 / 1024 / 768 / 390px에서 일반·빠른 스크롤, 확장 전후 카피 순서, 중간 위치 새로고침, SHOP 왕복·뒤로가기, 상품 탭·호버·키보드 포커스, 실시간 reduced-motion 변경과 반응형 전환을 검사한다. 검사 중 SHOP에서는 홈 scrub 트리거가 0개, 홈에서는 패럴랙스 4개·캠페인 1개인지 확인한다. 초기 reduced-motion과 `/#footer` 직접 진입도 검사한다.

수정 전 치수 스냅샷이 `docs/screenshots/motion-baseline.json`에 있으면 기존 섹션 치수와도 비교한다. 현재 5개 너비에서 차이는 모바일 사진 종횡비의 반올림으로 인한 최대 1px이다. 자동 검증 결과와 화면 캡처는 `docs/screenshots/motion/`에 기록한다.

최종 결과: `verify:motion`, `verify`, `verify:shop`, `lint`, `build` 모두 통과했다. 별도로 프로덕션 preview에서도 1440×844 / 390×844의 일반 모션·reduced-motion, 빠른 스크롤, SHOP 푸터에서 홈 복귀와 캠페인 카피 순서를 확인했다. 런타임·HTTP 오류, 중복 scrub 트리거, 콘텐츠가 숨은 채 남는 현상은 없었다. 데스크톱 캠페인 확장 3단계와 모바일 갤러리·Explore·푸터 캡처를 시각 검수했다.
