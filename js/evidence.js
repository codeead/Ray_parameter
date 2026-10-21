// parameter_zip.pdf "근거 상세 — 파라미터별 원문 위치와 설명" (17~26쪽)에서 1장 41개를 옮김.
// 행: [논문, 원문 위치, 논문 속 설명]. 논문 문장이 아니라 PDF가 풀어 쓴 한국어 설명이다.
// 쪽 번호: Rosenberger 2001, Schaefer & Summers 2005, Fontanella 2013은 PDF 화면에서 직접 확인,
// 나머지는 머리글·바닥글에서 읽어 쪽 경계의 문장은 한 쪽 어긋날 수 있다. 절 제목과 그림·식 번호는 정확.
export const EV = {
  dw: [
    ['Blevins & Lauder 2012', 'Materials and methods > Kinematic measurements and analysis, p.3233', '양쪽 가슴지느러미를 가로지르는 가장 넓은 폭. 지느러미 스팬과 같은 것으로 봄'],
    ['Fontanella 2013', '2.1 Two-dimensional planform analysis, p.274', '가슴지느러미 스팬 S를 좌우 지느러미 끝 사이 직선거리로 쟀'],
    ['Chaumel 2025', '2.1 Animal morphometrics and density; Fig. 1a', 'DW를 가슴지느러미 끝과 끝 사이 거리로 쟀'],
  ],
  semispan: [
    ['Fish 2016', '2.2 Potential Flow Model; Fig. 1a', '스팬 b는 루트(몸 중심)에서 끝까지 잼'],
    ['Fontanella 2013', '2.2 Three-dimensional analysis, p.274; Fig. 3 (p.276)', 'CT 단면을 반스팬의 백분율 위치에서 잡음. 0%는 몸 중심선, 100%는 지느러미 끝'],
  ],
  dl: [
    ['Rosenberger & Westneat 1999', 'Materials and methods, p.3524; Table 1', '주둥이 끝에서 꼬리 기부까지의 체반 길이. 속도를 DL/s로 표준화할 때 씀'],
    ['Blevins & Lauder 2012', 'Kinematic measurements and analysis, p.3233', '주둥이 끝에서 체반 뒷가장자리까지. 코드 길이와 같은 것으로 봄'],
  ],
  bl: [
    ['Fish 2018', 'Materials and methods > Video analysis, p.2 of 10', '눈에서 꼬리 기부까지 거리로 쟀'],
    ['Fontanella 2013', '2.1 Two-dimensional planform analysis, p.274', '주둥이 끝에서 배지느러미 뒷가장자리까지 직선거리'],
    ['Chaumel 2025', '2.1 Animal morphometrics and density; Fig. 1a', '주둥이에서 배지느러미 사이 꼬리 기부까지'],
    ['Di Santo 2017', 'Materials and methods > Animals and experimental setup, p.706', '몸길이를 체반 길이로 정의하고 속도를 그 배수로 표시'],
    ['Di Santo & Kenaley 2016', 'Materials and methods > Swimming endurance and metabolic costs', '몸길이를 체반 길이로 정의'],
  ],
  finbase: [
    ['Rosenberger 2001', 'Materials and methods > Kinematics, p.381~382', '파수를 구할 때 쓰는 길이. 주둥이에서 체반 뒷가장자리까지이며, 주둥이 연골이나 두부엽이 있는 종은 지느러미 기부가 DL과 달라진다고 설명'],
  ],
  dp: [
    ['Rosenberger & Westneat 1999', 'Materials and methods > Synchronized kinematics and EMG, p.3527; Table 1', '가슴지느러미 바깥 가장자리 길이. 표지점과 전극 위치를 이 길이의 백분율로 표시'],
    ['Blevins & Lauder 2012', 'Kinematic measurements and analysis, p.3232~3233; Discussion > Undulations of the pectoral surface, p.3236~3238', '파수를 표준화하는 길이로 쓰지만 측정법은 따로 적지 않음. 파가 실제로 지나는 경로를 더 잘 반영한다고 주장'],
  ],
  chord: [
    ['Fish 2016', '2.2 Potential Flow Model; Fig. 1a', '루트에서 앞전부터 뒷전까지의 길이'],
    ['Fontanella 2013', '2.2 Three-dimensional analysis, p.274; Fig. 2 (p.275)', '각 단면에서 앞가장자리에서 뒷가장자리까지 직선거리'],
    ['Chaumel 2025', '2.1 Animal morphometrics and density; Fig. 1a', '가슴지느러미 기부의 길이'],
    ['Rosenberger & Westneat 1999', 'Kinematics, p.3525~3526', '환산 진동수 계산용. 중앙 지느러미살에 수직인 최대 코드'],
  ],
  area: [
    ['Fontanella 2013', '2.1 Two-dimensional planform analysis, p.274', '몸과 가슴지느러미의 투영 면적. 꼬리와 교미기는 디지털로 지우고 쟀'],
    ['Martinez 2016', 'Materials and methods > Functional Implications of Pectoral Shape, p.484', '한쪽 가슴지느러미의 표면적을 AR 계산에 씀'],
    ['Chaumel 2025', '2.1 Animal morphometrics and density; Fig. 1a', 'DW × 코드 / 2로 추정. 가슴지느러미를 삼각형으로 보고 머리·두부엽·배지느러미는 뺌'],
  ],
  ar: [
    ['Moored 2011a', 'Morphometrics, p.99', '스팬 대 코드의 비. 파동형은 낮고 진동형은 높다고 설명'],
    ['Fish 2016', '1 Introduction', '만타 가슴지느러미 AR 3.5, 스팬 대 코드의 비로 정의'],
    ['Fish 2018', 'Introduction, p.2 of 10', 'Fish 2016과 같은 정의·값(3.5)'],
    ['Fontanella 2013', '2.1 Two-dimensional planform analysis, p.274; 3.1, p.276; Fig. 5 (p.277)', 'AR = S²/A. 진동형은 모두 2.60보다 크고 파동형은 모두 그보다 작음'],
    ['Moored 2011b', 'Fixed Velocity Experiments: Heaving Motion, p.111', '로봇 핀의 AR = b²/S'],
    ['Martinez 2016', 'Functional Implications of Pectoral Shape, p.484; 부록 Fig. S1', '(최대 코드 폭)² / 한쪽 지느러미 면적을 구한 뒤 양쪽 기준으로 2배'],
    ['Chaumel 2025', '2.1 Animal morphometrics and density; 3.1 Myliobatid morphology; Fig. 3c', 'AR = DW² / 추정 면적'],
    ['López-Romero 2025', 'Introduction', '유영 방식이 AR과 관련된다고 쓰며 AR을 radial이 지지하는 면적으로 설명(Martinez 2016 인용)'],
  ],
  shape: [
    ['Moored 2011a', 'Morphometrics, p.99', '원형에 가까운 디스크부터 삼각형 날개꼴까지 다양'],
    ['Fontanella 2013', 'Abstract, p.273; Fig. 1 (p.275)', '진동형은 날개형, 파동형은 원형·마름모꼴'],
    ['Martinez 2016', 'Materials and methods > Shape Acquisition and Major Axes of Pectoral Variation, p.483; Fig. 1', '지느러미 윤곽에 35점(양끝 고정점 2 + 접선 방향으로 미끄러지는 세미랜드마크 33)을 찍어 형상을 비교'],
  ],
  sweep: [
    ['Fontanella 2013', '3.1 Two-dimensional geometry, p.276', '진동형의 높은 AR이 후퇴형·날개형 형태와 맞다고 서술. 각도는 재지 않음'],
    ['Moored 2011b', 'Tip Lag Mode, p.113', '소가오리류는 뚜렷한 평면 후퇴각과 끝 지연이 없다고 설명(Heine 1992, Rosenberger 2001 인용)'],
  ],
  tmax: [
    ['Fontanella 2013', '2.2 Three-dimensional analysis, p.274; Fig. 2 (p.275)', '코드에 수직으로 쟀 등면과 배면 사이 최대 거리'],
    ['Di Santo 2017', 'Materials and methods > Morphology, p.706; Fig. 1 (p.707)', 'micro-CT 단면별로 두께를 재고, 가장자리와 뒷가장자리로 갈수록 얇아짐을 보임'],
  ],
  tr: [
    ['Fontanella 2013', '2.2, p.274; 3.2 Three-dimensional geometry, p.276~277; Fig. 8A', 'TR = T/C. 몸 중심선에서 최대이고 끝으로 갈수록 줄어듦'],
  ],
  sp: [
    ['Fontanella 2013', '2.2, p.274; 3.2, p.277; Fig. 8B', 'SP = SR/C. SR은 앞전에서 최대 두께 지점까지 거리'],
  ],
  camber: [
    ['Fontanella 2013', 'Fig. 2 캡션 (p.275); 2.2, p.275; 3.2, p.277; Fig. 9', '최대 캠버와, 앞전에서 최대 캠버까지의 거리(PMC). 파동형이 더 크게 휘어 있고 끝으로 갈수록 줄어듦'],
    ['Moored 2011a', 'Morphometrics, p.99~100', '파동형은 배면이 평평하고 등면이 낮게 솟아 캠버 날개와 비슷하고, 진동형은 대칭 익형과 비슷'],
  ],
  mass: [
    ['Fontanella 2013', '2.1 Two-dimensional planform analysis, p.274', '전자저울로 잼'],
    ['Fish 2016', '2.2 Potential Flow Model (p.7 of 24); 3.2, Eq. 13', '이상화한 만타 모델 질량을 450 kg으로 두고 운반 비용 계산에 씀'],
  ],
  mred: [
    ['Bottom 2016', '§2.3 The governing equations and the numerical method, p.416; Eq. (2.6)', '질량을 유체 밀도 × L³으로 나눈 값. 무게중심 운동 방정식에 들어감'],
  ],
  density: [
    ['Chaumel 2025', '2.1 Animal morphometrics and density; Eq. (2.1)', '알코올 보존 표본의 공기 중 무게와 액체 중 무게로 아르키메데스 원리를 적용해 구함'],
  ],
  com: [
    ['Fontanella 2013', '2.1, p.274 (방법); 3.1, p.276 (결과); Fig. 6 (p.277)', '여러 점에서 매달아 연직선의 교점으로 구함. 최대 스팬 축보다 앞이면 음수로 표시'],
    ['Fish 2018', 'Discussion > Manta turning performance, p.6 of 10', '몸길이의 약 47% 지점(Fontanella 2013 인용)'],
  ],
  tailmass: [
    ['Chaumel 2025', '2.2 Model design and preparation', '소가오리 표본의 몸과 꼬리를 따로 달아 꼬리가 전체 질량에서 차지하는 비율을 구함'],
  ],
  radial: [
    ['Schaefer & Summers 2005', 'Introduction, p.298; Fig. 1', '변형된 가슴띠에서 방사형으로 뻗은 연골 지느러미살이 날개를 이루고, 각 살은 원통형 radial이 끝끝으로 이어진 구조'],
    ['Moored 2011a', 'Morphometrics, p.100', '짧은 원통형 연골 조각이 끝끝으로 쌓인 골격'],
  ],
  calc: [
    ['Schaefer & Summers 2005', 'Results > Fine Scale–Calcification Patterns, p.300; Table 1 (p.300); Figs. 2·3 (p.301~302)', 'radial 전체를 석회화 층이 덮는 crustal과, tesserae가 사슬처럼 줄지어 붙는 catenated를 구분'],
    ['Schaefer & Summers 2005', 'Discussion > Second Moment of Area and Radial Stiffness, p.308~310; Fig. 10 (p.310)', 'crustal과 2사슬·4사슬 catenated radial의 단면2차모멘트를 같은 석회화 면적 조건에서 계산해 crustal이 더 단단함을 보임'],
    ['Moored 2011a', 'Morphometrics, p.100', '석회가 연골 바깥에 쌓이고 속은 석회화되지 않음(Schaefer & Summers 2005 인용)'],
  ],
  chains: [
    ['Schaefer & Summers 2005', 'Results, p.300~303; Table 2 (p.303)', 'catenated radial마다 근위 등·배 사슬 수, 첫 분지 뒤 두 번째 radial의 등·배 사슬 수, 측면 사슬 유무를 적음'],
  ],
  brace: [
    ['Schaefer & Summers 2005', 'Results > Medium Scale–Individual Radials, p.300~301; Fig. 4 (p.304); Fig. 5 (p.305); Fig. 9 (p.309)', '인접한 지느러미살의 radial을 잇는 연결 구조를 cross-brace라 이름 붙임. 관절이 굽는 것을 막아 날개 일부를 보강하며, 진동형 과에서 나타남'],
    ['Moored 2011a', 'Morphometrics, p.100', '진동형은 cross-bracing과 석회화가 있고 파동형은 관절 석회화가 적다고 요약'],
  ],
  stagger: [
    ['Schaefer & Summers 2005', 'Results > Large Scale–Interradial Relationships, p.304; Fig. 8 (p.308); Fig. 9 (p.309)', '이웃 지느러미살의 관절이 한 줄로 맞지 않고 엇갈리는 배열. 첫 분지 바깥의 날개 가장자리에서만 보임'],
  ],
  radshape: [
    ['Schaefer & Summers 2005', 'Medium Scale–Individual Radials, p.300 (단면형), p.303 (투영형); Fig. 3 (p.302); Figs. 6·7 (p.306~307)', '단면은 사각·삼각·원형에서 등배로 눌린 타원까지, 위에서 본 형상은 가는 직사각형에서 정사각형까지. 파동형은 몸축에서 멀수록 radial이 고르게 짧아지고, 진동형은 위치에 따라 크게 달라짐'],
  ],
  bifurc: [
    ['Schaefer & Summers 2005', 'Introduction, p.298; Fig. 1', '대부분 가오리의 지느러미살은 날개 가장자리에 닿기 전에 한두 번 두 갈래로 나뉨'],
  ],
  rom: [
    ['Schaefer & Summers 2005', 'Introduction, p.298', '인접 radial 사이 가동 범위는 약 15°로 작고, 대신 관절 수가 많음(저자 개인 관찰)'],
    ['Moored 2011a', 'Morphometrics, p.100', 'radial 하나는 약 15°만 움직이지만 여러 개가 모여 스팬·코드 방향 유연성을 만듦'],
  ],
  cantilever: [
    ['Schaefer & Summers 2005', 'Introduction, p.299, Eq. (1); Discussion > Second Moment of Area and Radial Stiffness, p.308~309', '각 radial을 끝에 힘을 받는 외팔보로 보고 Y_max = FL³/3EI로 처짐을 계산. 연골의 E는 종 간에 같다고 가정해 I가 강성을 가른다고 봄'],
  ],
  stiff: [
    ['Fish 2016', '1 Introduction', '지느러미 중심부가 끝보다 단단함'],
  ],
  basal: [
    ['López-Romero 2025', 'Material and methods > Geometric morphometrics; Fig. 1B', 'coracoid bar와 propterygium·metapterygium의 첫 요소에 2차원 랜드마크를 찍음. mesopterygium은 없거나 radial과 유합된 경우가 있어 제외'],
    ['Rosenberger & Westneat 1999', 'Results > Pectoral fin morphology, p.3527; Fig. 3A,B', '세 개의 큰 기저 연골이 지느러미를 가슴띠에 잇고, 마디로 나뉜 radial이 가장자리까지 뻗음(해부·X선 사진)'],
  ],
  pmus: [
    ['Rosenberger & Westneat 1999', 'Results > Pectoral fin morphology, p.3527~3528; Fig. 4B', '등쪽(abductor)·배쪽(adductor) 근육이 각각 표층과 심층으로 나뉘며, 표층은 지느러미 중간에서 끝나고 심층은 가장자리까지 닿음'],
  ],
  pelvmus: [
    ['Macesic & Kajiura 2010', 'Results > Morphology (Musculature), p.1222~1224; Tables 2·3; Fig. 5', '배쪽 근육은 지느러미·propterygium을 내리고 등쪽 근육은 올림. propterygium 전진근·후퇴근은 양면에 있음. 종별 기시·부착은 표에 정리'],
  ],
  pelvarea: [
    ['Macesic & Kajiura 2010', 'Materials and methods·Results > Morphology (Surface area), p.1221~1222; Fig. 4', '배지느러미 표면적을 전체 체반 면적의 백분율로 나타냄'],
  ],
  pseg: [
    ['Macesic & Kajiura 2010', 'Results > Morphology (Musculature), p.1222; Discussion, p.1225~1226; Fig. 5', '진짜 펀터는 propterygium이 마디로 나뉘고 원위 요소가 과상 관절로 붙으며 마디마다 전용 근육이 있음. 보조 펀터는 하나로 된 propterygium'],
  ],
  pei: [
    ['Macesic & Summers 2012', 'Materials and methods > Flexural stiffness, p.2005; Eq. (2)', '받침점 둘(1.2 cm 간격)과 가운데 하중을 쓰는 3점 굽힘 시험에서 보 식으로 EI를 구함'],
  ],
  pE: [
    ['Macesic & Summers 2012', 'Flexural stiffness, p.2005~2006', 'EI와 I로부터 구한, 크기·모양과 무관한 재료 강성. 굽힘만 고려하는 가정은 길이/두께 비 15 이상에서 잘 맞는다고 단서를 달음'],
  ],
  pshape: [
    ['Macesic & Summers 2012', 'Flexural stiffness, p.2005, Eq. (1); Propterygium morphology, p.2005~2006, Eqs. (3)·(4); Fig. 5', 'I = ∫x²dA. Ip:Ih는 같은 단면적의 중공 원과 비교한 비. CSA는 바깥 석회화 tesserae만 세고, R/t는 단면 반지름 / tesserae 두께'],
  ],
  pcomp: [
    ['Macesic & Summers 2012', 'Materials and methods·Results > Composition, p.2006, p.2008; Figs. 7·8', '건조·회화로 무게를 재서 광물질·수분·유기물 함량을 구함'],
  ],
  tail: [
    ['Chaumel 2025', '2.1 Animal morphometrics and density; 3.1 Myliobatid morphology; Figs. 1a·3', '꼬리 기부에서 끝까지의 길이. 꼬리/BL을 STL이라 부르고 꼬리/DW도 계산'],
  ],
  cephalic: [
    ['Rosenberger 2001', 'Materials and methods > Kinematics, p.382', 'Rhinobatos·Raja는 신경두개 앞에 주둥이 연골이, Rhinoptera는 두부엽이 있어 지느러미 기부 길이가 달라진다고 설명'],
    ['Martinez 2016', 'Functional Implications of Pectoral Shape, p.484', 'Mobula hypostoma의 두부엽은 랜드마크와 AR 계산에서 모두 뺌'],
  ],
};
