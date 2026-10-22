# ZIPPO 상품 카탈로그

공식 상품 수집 및 가격 재검증: 2026-10-22. 기존 공식 상품 32개와 EMBLEM/LIMITED 각 4개로 공식 상품은 총 40개다. CLASSIC 시안 제품 4개를 포함해 화면에는 총 44개를 표시한다. 공식몰 가격·재고는 이후 변경될 수 있다.

## 기존 CLASSIC 시안 제품 — CUSTOM에 추가

사용자 요청으로 기존 생성 이미지를 재사용하고 이름·가격을 지정했다. 공식 상품 데이터와 구분해 src/data/products.js에서 관리한다.

| 제품명 | 시안 가격 | 기본 이미지 | 호버 이미지 |
| --- | ---: | --- | --- |
| CLASSIC MINT | 49,000원 | imgProductCard01 | hover-mint |
| CLASSIC RED | 49,000원 | imgProductCard02 | imgGalleryImageTop |
| CLASSIC BLACK | 45,000원 | imgProductCard03 | hover-black |
| CLASSIC CHROME | 55,000원 | imgProductCard04 | hover-chrome |

## 공식 상품 분류 근거

- NEW: [공식 신상 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001034004)의 제품.
- CUSTOM: [공식 각인 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001031)의 클래식 제품. 각인 옵션과 추가 비용은 공식몰에서 선택한다.
- ARMOR: [공식 조각 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001010)에서 제품명에 Armor가 명시된 제품.
- 540 COLOR: [공식 프린팅 분류](https://zippo.co.kr/goods/goods_list.php?cateCd=001009)의 540 제품. 분류 확인에는 ZIPPO UK 공식 540 컬렉션의 모델 정보도 참고했고, 표시 가격·사진·제품명은 한국 공식몰에서 수집했다.

원본 페이지는 상품 번호별 HTML, 원본 이미지 및 WebP는 public/images/shop/{category}/{goodsNo}/, 데이터는 src/data/shop/의 카테고리별 JSON에 저장했다. manifest.json은 공식 상품 전체 이미지 출처·치수·기본/호버 매핑, verification.json은 실시간 명칭·가격 대조 기록이다.

## NEW — 공식 상품 8개

| 공식몰 제품명 | 모델 | 가격 | 기본 / 호버 이미지 |
| --- | --- | ---: | --- |
| [[사은품 오일증정] ZIPPO 지포 47449 플로럴 레오파드](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002391) | 47449 | 59,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47438 그런지 플래그](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002390) | 47438 | 79,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47437 어브덕션](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002389) | 47437 | 59,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47434 지포 게이머](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002388) | 47434 | 59,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47433 익스플로어](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002387) | 47433 | 69,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47414 제임스 본드 007 건 로고 (Multi Logo)](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002386) | 47414 | 89,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47413 제임스 본드 007 건 로고 (Gold Diamond Pattern)](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002385) | 47413 | 79,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47399 크라운 로얄](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002384) | 47399 | 69,000원 | 02.webp / 01.webp |

## CUSTOM — 공식 상품 8개

| 공식몰 제품명 | 모델 | 가격 | 기본 / 호버 이미지 |
| --- | --- | ---: | --- |
| [[사은품 오일증정] Brushed Chrome](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000617) | 200 | 39,000원 | 03.webp / 01.webp |
| [[사은품 오일증정] Classic High Polish Chrome](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000533) | 250 | 46,000원 | 01.webp / 04.webp |
| [[사은품 오일증정] Classic Black Matte](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000871) | 218 | 39,000원 | 01.webp / 03.webp |
| [[사은품 오일증정] 150 BLACK ICE](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000874) | 1000000874 | 49,000원 | 01.webp / 04.webp |
| [[사은품 오일증정] Classic Multi Color](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000875) | 151 | 49,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] Classic White Matte](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000000731) | 214 | 36,000원 | 01.webp / 03.webp |
| [[사은품 오일증정] Classic Iridescent](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001033) | 49146 | 46,000원 | 01.webp / 03.webp |
| [[사은품 오일증정] Classic Brick](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001550) | 49844 | 39,000원 | 01.webp / 02.webp |

## ARMOR — 공식 상품 8개

| 공식몰 제품명 | 모델 | 가격 | 기본 / 호버 이미지 |
| --- | --- | ---: | --- |
| [[사은품 오일증정] ZIPPO 라이터 29670 Armor Tree of life](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002189) | 29670 | 128,700원 | 02.webp / 01.webp |
| [[사은품 오일증정] Zippo Script Logo Collectible Armor® Rose Gold](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001871) | 48768 | 209,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] Armor® Side Black](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001842) | 1000001842 | 111,300원 | 01.webp / 04.webp |
| [[사은품 오일증정] Armor® Wicca Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001837) | 49689 | 159,000원 | 02.webp / 03.webp |
| [[사은품 오일증정] Armor® Magic Eye-1](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001834) | 1000001834 | 55,300원 | 02.webp / 04.webp |
| [[사은품 오일증정] Armor® Lucky Cat Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001830) | 49802 | 93,000원 | 01.webp / 02.webp |
| [[사은품 오일증정] Armor® Diamond edge Black](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001632) | 1000001632 | 74,250원 | 03.webp / 01.webp |
| [[사은품 오일증정] Armor® Good Luck Rose Gold](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001402) | 1000001402 | 74,250원 | 02.webp / 01.webp |

## 540-COLOR — 공식 상품 8개

| 공식몰 제품명 | 모델 | 가격 | 기본 / 호버 이미지 |
| --- | --- | ---: | --- |
| [[사은품 오일증정] Psychedelic Swirl Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001892) | 48774 | 73,000원 | 03.webp / 01.webp |
| [[사은품 오일증정] Abstract Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001888) | 48779 | 69,000원 | 03.webp / 01.webp |
| [[사은품 오일증정] Dragon Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001890) | 48777 | 63,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] Hot Rod Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001770) | 48660 | 61,110원 | 02.webp / 01.webp |
| [[사은품 오일증정] Pop Art Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001464) | 49533 | 63,000원 | 01.webp / 02.webp |
| [[사은품 오일증정] Spooky Skulls Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001985) | 48772 | 63,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] Horror Wolf Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001993) | 48923 | 63,000원 | 02.webp / 01.webp |
| [[사은품 오일증정] ZIPPO 지포 47263 컬러풀 스컬](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002374) | 47263 | 79,000원 | 02.webp / 01.webp |

## EMBLEM — ARMOR에 추가

사용자가 지정한 SHOP 분류이며 실제 제품의 케이스/인쇄 방식을 뜻하지 않는다. 기본 사진은 공식몰, 호버 사진은 제품을 참조해 별도 생성했다.

| 제품명 | 가격 | 호버 콘셉트 |
| --- | ---: | --- |
| [Valkyrie Gold Emblem](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001912) | 74,250원 | CRAFTED IN METAL |
| [Wolf Emblem Design](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001756) | 76,000원 | CRAFTED IN METAL |
| [Lucky Wings Brass Antique](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000001847) | 57,000원 | CRAFTED IN METAL |
| [ZIPPO 46856 오딘 엠블렘](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002170) | 66,930원 | CRAFTED IN METAL |

## LIMITED — 540 COLOR에 추가

사용자가 지정한 SHOP 분류이며 실제 제품의 케이스/인쇄 방식을 뜻하지 않는다. 기본 사진은 공식몰, 호버 사진은 제품을 참조해 별도 생성했다.

| 제품명 | 가격 | 호버 콘셉트 |
| --- | ---: | --- |
| [ZIPPO 지포 x Pink Floyd® 락스피릿 한정판 47239 피라미드](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002315) | 59,000원 | THE COLLECTOR’S LIGHT |
| [ZIPPO 지포 x 가이하비® 한정판 47104 샤크](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002237) | 47,200원 | THE COLLECTOR’S LIGHT |
| [ZIPPO 지포 x Blazy Susan® 한정판 47193 부케 로즈](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002325) | 59,000원 | THE COLLECTOR’S LIGHT |
| [ZIPPO 지포 x Grateful Dead® 락스피릿 한정판 47250 댄싱베어](https://zippo.co.kr/goods/goods_view.php?goodsNo=1000002321) | 59,000원 | THE COLLECTOR’S LIGHT |

생성 방식: built-in image_gen. 개별 프롬프트는 [editorial-image-prompts.json](editorial-image-prompts.json), 생성 원본 위치와 콘셉트는 [editorial-generated.json](editorial-generated.json). 배포 WebP와 보존 PNG는 public/images/collections/{emblem,limited}/에 있다.
