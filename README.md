# Ray_parameter

Interactive 3D atlas of batoid (ray) morphological parameters.

Explore 41 body-shape parameters
— disc width, chord, aspect ratio, thickness, skeleton, muscles, pelvic fins —
on a manta ray and a generic benthic ray, with definitions, source papers, and cross-paper definition conflicts.
Built with Three.js; no build step.

## 한국어 설명

가오리(batoid) 신체적 특징 파라미터를 3D로 확인하는 인터랙티브 아틀라스입니다.

체반 폭, 코드, 가로세로비, 두께, 골격, 근육, 배지느러미 등 신체 형태 파라미터 41개를
만타 가오리와 표준(저서성) 가오리 모델에서 살펴볼 수 있고, 파라미터별 정의, 출처 논문,
논문 간 정의 차이를 함께 보여줍니다.
Three.js로 만들었으며 별도의 빌드 과정이 없습니다.

## 사용법

### 실행
- 배포 주소(GitHub Pages)로 접속하거나, 로컬에서는 `index.html`을 더블클릭하지 말고 간이 서버로 엽니다.
  (브라우저 보안 때문에 파일로 직접 열면 동작하지 않습니다.)
  ```bash
  python3 -m http.server 8000
  # 브라우저에서 http://localhost:8000 접속
  ```
- 3D 라이브러리를 인터넷(CDN)에서 불러오므로 인터넷 연결이 필요합니다.

### 화면 구성
| 영역 | 설명 |
|------|------|
| 왼쪽 | 파라미터 목록(6개 묶음, 41개). 검색창으로 이름·정의를 찾을 수 있고, 각 항목에 정의 요약이 표시됩니다. |
| 가운데 | 3D 화면. 선택한 파라미터가 어느 부위에서, 어디까지의 범위인지 강조해서 보여줍니다. |
| 오른쪽 | 선택한 파라미터의 정의, 3D에서 보는 범위, 출처 논문, 논문 간 정의 차이 |

### 기본 조작
1. **파라미터 선택**: 왼쪽 목록에서 항목을 클릭하면 3D 화면과 오른쪽 설명이 함께 바뀝니다.
2. **3D 회전·이동**: 드래그로 회전, 휠로 확대·축소, 우클릭 드래그로 이동합니다.
3. **시점 버튼**: 위 / 아래 / 옆 / 앞 / 3D 시점으로 한 번에 이동합니다.
4. **모델 전환**: 상단의 `만타` / `표준 가오리`로 바꿉니다.
   만타에서 측정되지 않는 파라미터(배지느러미 근육, propterygium 관련 지표 등)는
   선택하면 표준 가오리로 자동 전환되고 이유가 표시됩니다.
5. **골격 버튼**: 몸을 반투명하게 만들고 지느러미살(radial)과 기저 연골을 보여줍니다.
6. **라벨 버튼**: 3D 화면의 글자 표시를 켜고 끕니다.

### 정의가 여러 개인 파라미터
체반 길이, 몸길이, 코드, 평면 면적, 가로세로비처럼 논문마다 정의가 다른 항목은
오른쪽 설명에 정의 버튼이 나타납니다. 버튼을 누르면 해당 논문의 정의에 맞게 3D 측정 범위가 바뀝니다.
`정의 차이 #번호` 표시가 있는 항목은 하단에서 논문 간 차이를 비교할 수 있습니다.

### 단면 파라미터
최대 두께, 두께비, 최대 두께 위치, 캠버는 **단면 위치 슬라이더**(% 반스팬)로 위치를 옮기며 볼 수 있고,
2D 단면도와 해당 단면의 값이 함께 표시됩니다.

### 링크 공유
주소 끝에 파라미터 ID를 붙이면 해당 파라미터가 바로 열립니다.
예: `https://<아이디>.github.io/Ray_parameter/#ar`

### 유의사항
- 3D 형상과 점 위치(무게중심, 관절 등)는 **시각화용 예시**이며 실측값이 아닙니다.
- 정의·출처는 `parameter_zip.pdf`(원문)를 따릅니다.

## 파일 구조
```
index.html          레이아웃
css/style.css       스타일
js/data.js          파라미터 텍스트, 출처, 정의 차이, 모식도
js/models.js        만타·표준 가오리 3D 형상과 골격
js/viz.js           파라미터별 3D 표시
js/main.js          화면 조작
parameter_zip.pdf   원문 파라미터 목록
```

## 배포 (GitHub Pages)
레포 **Settings → Pages → Branch: `main` / `(root)`** 로 설정하면 `https://<아이디>.github.io/Ray_parameter/` 로 열립니다.
