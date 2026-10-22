# SHOP 구현 및 검수

2026-10-22. 기존 홈 구현을 유지하며 SHOP, 제품 상세, 장바구니를 연결했다.

## 경로와 진입점

- `/shop`: NEW 컬렉션.
- `/shop?category=new|custom|armor|540-color`: NEW 8개, CUSTOM·ARMOR·540 COLOR 각 12개로 총 44개. CLASSIC 4개는 CUSTOM, EMBLEM 4개는 ARMOR, LIMITED 4개는 540 COLOR에 포함한다.
- `/shop/product/{goodsNo}`: 제품 사진, 확대 보기, 원문 제품명, 가격, 수량, 담기, 관련 제품.
- 홈의 SHOP 메뉴·하단 SHOP, 라이터 컬렉션 카드, DISCOVER THE FLAME, EXPLORE ZIPPO 제목·카테고리·폴라로이드에서 연결한다.
- `SiteHeader`, `FooterNav`, `SiteFooter`를 홈과 공유한다. 헤더는 홈과 동일한 노란색 글씨·아이콘, 크기·간격·위치와 반응형 스타일을 그대로 사용한다.

## 영상 분석

참고 파일: `C:/Users/mbc/Downloads/5efb2fac6d9c2838142551.mp4`. 918×656, 14.5초. 전체는 2초 간격, 전환과 카트 구간(4.75–10.5초)은 0.25초 간격으로 프레임을 추출했다. `reference-video/contact-sheet.png`, `reference-video/detail/contact-sheet.png`에서 확인할 수 있다.

| 영상 구간 | 관찰 | 적용 |
| --- | --- | --- |
| 0–2초 | 흰 배경, 중앙 2줄 제목, 왼쪽 카테고리, 큰 카드와 오른쪽 작은 카드 2개 | 3열 그리드에서 첫 카드는 2열·2행을 차지하고 마지막에는 가로형 카드를 배치 |
| 2–5.75초 | 호버 시 제품 단독 컷에서 다른 연출 컷으로 전환, 제품명과 가격은 하단 유지 | 동일 제품의 공식 연출·개방·다른 각도 정지 이미지로 350ms 교차 전환; 키보드 포커스에도 적용 |
| 5.75–6.5초 | 아래에서 노란 화면이 올라와 화면 전체를 덮은 뒤 상세 화면 노출 | GSAP: 460ms 진입 → 화면 교체 → 140ms 유지 → 560ms 위로 퇴장. 시간은 영상 관찰을 바탕으로 조정한 구현값 |
| 6.5–7.75초 | 왼쪽 대형 사진, 오른쪽 제목·설명·수량·검정 담기 버튼 | 좌우 50:50 상세 화면, 연출 사진이 있는 제품은 해당 사진으로 시작; 썸네일·확대·정보 탭 제공 |
| 7.75–9초 | 오른쪽 절반 노란 카트, 상단 제품·수량·삭제, 중간 추천 3개, 하단 합계 | 500ms 진입·380ms 퇴장 드로어, 실제 수량 계산, 삭제·추천 담기, 브라우저 저장 |
| 9–12초 | 카트 퇴장 후 왼쪽 미디어가 변함 | 동영상 대신 제품별 정지 이미지 갤러리 사용. 카트 종료 시 기존 화면과 스크롤 위치 유지 |
| 14초 | SHOP / ABOUT / CONTACT 3열과 큰 워드마크 푸터 | 기존 홈 푸터 컴포넌트 재사용 |

## 스타일과 동작

- 카드 이름은 왼쪽 하단, 가격은 오른쪽 하단의 기울어진 노란 종이에 배치한다.
- 가격 종이와 홈 포인트는 기존 `--accent: #FFD166`, 전면 전환·카트는 기존 캠페인 토큰 `--campaign: #FFEB00`을 사용한다.
- 원본의 가로·세로 비율을 보존한다. 연출 사진 안의 제품이 잘리지 않도록 contain으로 표시한다. 원본 픽셀을 늘려 고해상도라고 처리하지 않는다.
- 모바일은 큰 카드와 2열 작은 카드를 혼합한다. 카테고리는 상단에 고정하고, 카트는 전체 너비로 표시한다. 터치에서는 기본 이미지를 유지하고 담기 버튼을 항상 표시한다.
- `prefers-reduced-motion`에서는 장식 모션 없이 이동한다. 브라우저 뒤로/앞으로 이동, 새 탭 열기, 직접 상세 URL 접근을 지원한다.
- 가격 낮은순·높은순 정렬, 수량 1–99, 삭제, 추천 제품 추가, `localStorage` 복원, Escape·바깥 영역 클릭 닫기를 제공한다.
- 상거래 백엔드는 연결하지 않았다. 공식몰 구매 링크는 해당 공식 제품 페이지를 열며, 로컬 장바구니가 공식몰에 전송되거나 결제된다고 표시하지 않는다.

## 제품 자료

카테고리별 파일: `src/data/shop/{new,custom,armor,540-color}.json`.

추가한 공식 EMBLEM/LIMITED 제품은 `src/data/shop/editorial.json`에서 관리한다. 홈은 각 4개 카드이며 CLASSIC과 동일한 캐러셀·호버·포커스·노란 전환 효과를 공유한다. EMBLEM은 금속 공방, LIMITED는 프리즘·물빛·장미·레코드 콘셉트다. 공식 사진을 참조해 built-in image_gen으로 호버 사진 8장을 생성했다. PNG 원본과 같은 해상도 WebP는 `public/images/collections/{emblem,limited}`에 보존한다. 개별 프롬프트는 `catalog-source/editorial-image-prompts.json`, 생성 출처는 `catalog-source/editorial-generated.json`에 기록한다.

기존 CLASSIC 제품 4개는 `src/data/products.js`를 홈과 CUSTOM이 함께 사용한다. 사용자 요청에 따라 제품명을 CLASSIC MINT / CLASSIC RED / CLASSIC BLACK / CLASSIC CHROME, 가격을 49,000 / 49,000 / 45,000 / 55,000원으로 지정했다. `isConcept`로 시안 제품을 구분하며, 공식몰 가격·상품 코드로 표시하지 않는다. 홈 카드 클릭은 CUSTOM으로 연결되고, CUSTOM에서 동일한 이미지·호버 이미지·가격으로 상세 보기와 담기를 지원한다.

이미지: `public/images/shop/{category}/{goodsNo}/`. WebP와 `originals/` 원본을 함께 보존한다. 상품마다 기본 이미지와 다른 호버 이미지를 명시했다.

공식몰 원문 이름은 `sourceName`, 표시 제품명은 사은품 접두사를 분리한 `name`, 사은품은 `promotion`으로 보존한다. 가격은 할인 후 공식몰 표시 가격이다. 출처 URL, 모델 번호, 수집일, 이미지별 원본 URL과 픽셀 크기를 데이터에 기록했다.

전체 목록과 분류 근거는 [카탈로그](catalog-source/README.md), 공식몰 명칭·가격 대조 결과는 [verification.json](catalog-source/verification.json)을 참고한다.

## 검수

```sh
npm run dev -- --host 127.0.0.1
npm run lint
npm run build
npm run verify
npm run verify:shop
npm run verify:catalog
```

`verify:shop`은 1920 / 1440 / 1024 / 768 / 390px에서 4개 컬렉션, 이미지 로딩, 제품명·가격 영역 넘침, 상세 갤러리·확대, 정보 탭 키보드 조작, 카트 수량·합계·저장·삭제, 추천 담기, 닫기, 페이지 전환, 홈 진입점과 오류 화면을 검증한다. `verify`는 기존 홈 회귀 검수다. 캡처는 `docs/screenshots`, 결과는 `docs/shop-verification.json`에 저장한다.

공식몰 상품 40개의 원문 이름·표시 가격을 실시간 대조하는 검증 스크립트를 제공한다. 최신 Figma 두 프레임 조회는 재인증 오류로 완료하지 못했으며, 저장된 `design.md`·`project.md`, 기존 홈 구현과 첨부 영상을 기준으로 비교했다.
