// 출처: parameter_zip.pdf — "1. 신체적 특징 파라미터" 41개, 3장 정의 차이, 출처 목록.
// def = 논문 정의(PDF 원문), show = 3D에서 무엇을 어디까지 표시했는지(시각화 설명).
// models 생략 = 만타·표준 가오리 모두 표시.

export const GROUPS = [
  ['1-1', '크기·기준 길이·평면형'],
  ['1-2', '단면·두께'],
  ['1-3', '질량·밀도·무게중심'],
  ['1-4', '골격·강성 (가슴지느러미)'],
  ['1-5', '근육'],
  ['1-6', '배지느러미·꼬리·두부'],
];

const BENTHIC = '만타는 배지느러미로 바닥을 디디는 펀팅을 하지 않아 이 지표가 측정되지 않습니다. 저서성 가오리(홍어·노랑가오리류) 연구의 정의라 표준 가오리 모델에서 보여줍니다.';
const STD = ['standard'];

export const PARAMS = [
  // 1-1
  { g: '1-1', id: 'dw', name: '체반 폭', orig: 'disc width, DW / pectoral span S',
    def: '좌우 가슴지느러미 끝 사이 거리. 체반 최대 폭 = 지느러미 스팬으로 봄.',
    src: ['Blevins & Lauder 2012', 'Fontanella 2013', 'Chaumel 2025'],
    show: '왼쪽·오른쪽 가슴지느러미 끝점(가장 바깥 점)을 잇는, 몸축에 수직인 직선 거리. 체반에서 가장 넓은 폭이며 지느러미 스팬과 같은 값으로 씁니다.' },
  { g: '1-1', id: 'semispan', name: '반스팬', orig: 'span b / semispan',
    def: '몸 중심선(root)에서 지느러미 끝까지. 단면 위치를 % 반스팬로 표시(0% = 중심선, 100% = 끝).',
    src: ['Fish 2016', 'Fontanella 2013'],
    show: '정중선(0%)에서 한쪽 지느러미 끝(100%)까지. 표면의 띠는 25% 간격 단면 위치이며, 1-2 단면 파라미터가 이 위치 표기를 씁니다.' },
  { g: '1-1', id: 'dl', name: '체반 길이', orig: 'disc length, DL', conflict: ['#5', '#2'],
    def: '주둥이 끝~체반 뒷가장자리(B&L 2012) 또는 주둥이 끝~꼬리 기부(R&W 1999).',
    src: ['Rosenberger & Westneat 1999', 'Blevins & Lauder 2012'],
    variants: [
      { label: 'B&L 2012', text: '주둥이 끝 ~ 체반 뒷가장자리', src: 'Blevins & Lauder 2012' },
      { label: 'R&W 1999', text: '주둥이 끝 ~ 꼬리 기부', src: 'Rosenberger & Westneat 1999' },
    ],
    show: '몸축을 따라 잰 길이. 끝점을 체반 뒷가장자리로 잡는지, 더 뒤인 꼬리 기부로 잡는지에 따라 범위가 달라집니다. 만타는 돌출된 주둥이가 없어 머리 앞 끝(두부엽 사이 입 앞)을 기준점으로 표시했습니다.' },
  { g: '1-1', id: 'bl', name: '몸길이', orig: 'body length, BL / L', conflict: ['#5'],
    def: '논문마다 다름: 눈~꼬리 기부, 주둥이~배지느러미 뒷가장자리, 주둥이~꼬리 기부, 또는 BL = DL.',
    src: ['Fish 2018', 'Fontanella 2013', 'Chaumel 2025', 'Di Santo 2017'],
    variants: [
      { label: 'Fish 2018', text: '눈 ~ 꼬리 기부', src: 'Fish 2018' },
      { label: 'Fontanella 2013', text: '주둥이 끝 ~ 배지느러미 뒷가장자리', src: 'Fontanella 2013' },
      { label: 'Chaumel 2025', text: '주둥이 ~ 꼬리 기부(배지느러미 사이)', src: 'Chaumel 2025' },
      { label: 'Di Santo 2017', text: 'BL = DL (체반 길이를 그대로 사용, B&L 방식 DL로 표시)', src: 'Di Santo & Kenaley 2016; Di Santo 2017' },
    ],
    show: '몸축 방향 길이. 정의 버튼을 바꾸면 시작점·끝점이 바뀝니다. 같은 개체라도 정의에 따라 값이 달라져 BL/s 속도, St, Re 비교에 영향을 줍니다.' },
  { g: '1-1', id: 'finbase', name: '지느러미 기부 길이', orig: 'fin base', conflict: ['#2'],
    def: '주둥이~체반 뒷가장자리. 주둥이 연골이나 두부엽이 있는 종은 DL과 달라짐. 파수 계산의 기준 길이.',
    src: ['Rosenberger 2001'],
    show: '가슴지느러미가 몸통에 붙은 선(기부, 산호색)을 따라 앞 끝부터 체반 뒷가장자리까지. 비교용으로 DL(노랑)을 함께 그렸습니다. 두부엽(만타)이나 주둥이 연골(표준 가오리)이 있으면 기부 앞 끝이 주둥이 끝보다 뒤에 있어 DL과 달라집니다.' },
  { g: '1-1', id: 'dp', name: '체반 둘레', orig: 'disc perimeter, DP / circumferential length', conflict: ['#2'],
    def: '가슴지느러미 바깥(원위) 가장자리 길이. 파가 실제로 지나는 경로로 보고 파수 표준화에 사용.',
    src: ['Rosenberger & Westneat 1999', 'Blevins & Lauder 2012'],
    show: '한쪽 가슴지느러미의 바깥 가장자리를 기부 앞에서 끝을 돌아 기부 뒤까지 따라간 곡선 길이. 화살표는 파가 지나가는 방향(앞 → 뒤)입니다.' },
  { g: '1-1', id: 'chord', name: '코드', orig: 'chord, c / C', conflict: ['#2'],
    def: '논문마다 다름: 루트에서 앞전~뒷전(Fish 2016), 단면별 앞~뒤 가장자리 직선거리(Fontanella), 가슴지느러미 기부 길이(Chaumel), 중앙 지느러미살에 수직인 최대 코드(R&W 1999).',
    src: ['Fish 2016', 'Fontanella 2013', 'Chaumel 2025', 'Rosenberger & Westneat 1999'],
    variants: [
      { label: 'Fish 2016', text: '루트(지느러미가 몸에 붙는 곳)에서 앞전 ~ 뒷전', src: 'Fish 2016' },
      { label: 'Fontanella 2013', text: '각 단면(% 반스팬)에서 앞 ~ 뒤 가장자리 직선거리. 25·50·75% 위치 표시', src: 'Fontanella 2013' },
      { label: 'Chaumel 2025', text: '가슴지느러미 기부 길이를 코드로 사용', src: 'Chaumel 2025' },
      { label: 'R&W 1999', text: '중앙 지느러미살(민트)에 수직인 방향의 최대 코드', src: 'Rosenberger & Westneat 1999' },
    ],
    show: '앞전(앞 가장자리)에서 뒷전(뒤 가장자리)까지의 거리. 어디서, 어느 방향으로 재는지가 정의마다 다릅니다.' },
  { g: '1-1', id: 'area', name: '평면 면적', orig: 'planform area, A',
    def: '몸+가슴지느러미 투영 면적(꼬리·교미기 제외). Chaumel은 DW × 코드 / 2로 추정(머리·두부엽·배지느러미 제외).',
    src: ['Fontanella 2013', 'Martinez 2016', 'Chaumel 2025'],
    variants: [
      { label: '투영 면적', text: '위에서 본 몸 + 가슴지느러미 면적. 꼬리·교미기는 칠하지 않음', src: 'Fontanella 2013; Martinez 2016' },
      { label: 'Chaumel 추정', text: 'DW × 코드 / 2 — DW와 코드(기부 길이)를 대각선으로 하는 마름모 면적', src: 'Chaumel 2025' },
    ],
    show: '위에서 내려다본 그림자 면적. 실제 윤곽 면적과 마름모 근사를 정의 버튼으로 비교합니다.' },
  { g: '1-1', id: 'ar', name: '가로세로비', orig: 'aspect ratio, AR', conflict: ['#4'],
    def: '4가지 정의가 공존: 스팬/코드, S²/A, (최대 코드 폭)²/지느러미 면적, DW²/추정 면적.',
    src: ['Moored 2011a', 'Fish 2016', 'Fontanella 2013', 'Martinez 2016', 'Chaumel 2025'],
    variants: [
      { label: '스팬/코드', text: 'AR = 스팬 / 코드', src: 'Moored 2011a; Fish 2016·2018' },
      { label: 'S²/A', text: 'AR = S² / A (S 스팬, A 평면 면적)', src: 'Fontanella 2013; Moored 2011b (b²/S)' },
      { label: 'Martinez', text: 'AR = (최대 코드 폭)² / 지느러미 면적, 한쪽 값 × 2', src: 'Martinez 2016' },
      { label: 'Chaumel', text: 'AR = DW² / (DW × 코드 / 2)', src: 'Chaumel 2025' },
    ],
    show: '어떤 길이와 면적을 쓰는지가 정의마다 달라 같은 만타가 3.5와 5.8로 보고됩니다. 선택한 정의에 쓰이는 길이·면적만 표시합니다.' },
  { g: '1-1', id: 'shape', name: '평면형', orig: 'planform shape',
    def: '원형·마름모(파동형) vs 날개형·삼각형(진동형). 정량화: 지느러미 윤곽 35점(양끝 고정 랜드마크 2 + 슬라이딩 세미랜드마크 33) 기하형태계측.',
    src: ['Moored 2011a', 'Fontanella 2013', 'Martinez 2016'],
    show: '한쪽 지느러미 윤곽에 35점을 찍습니다. 기부 앞·뒤 끝의 고정 랜드마크 2개(산호색)와 그 사이 윤곽을 따라 미끄러지는 세미랜드마크 33개(노랑). 만타(날개형·삼각형)와 표준 가오리(원형·마름모)를 전환해 비교해 보세요.' },
  { g: '1-1', id: 'sweep', name: '후퇴각', orig: 'sweep',
    def: '정성적. 진동형의 후퇴형 평면형과 AR 연관 언급, 소가오리는 뚜렷한 후퇴각이 없다고 기술.',
    src: ['Fontanella 2013', 'Moored 2011b'],
    show: '앞전(노랑)이 몸축에 수직인 기준선(민트)에서 뒤로 젖혀진 정도. 논문에 수치 정의가 없어 각도는 개념 표시입니다.' },

  // 1-2
  { g: '1-2', id: 'tmax', name: '최대 두께', orig: 'T',
    def: '코드에 수직으로 잰 등면~배면 최대 거리. CT 단면을 % 반스팬 간격으로 측정. micro-CT 시상 단면별 두께도 있음.',
    src: ['Fontanella 2013', 'Di Santo 2017'],
    show: '선택한 반스팬 위치에서 몸을 앞뒤 방향으로 자른 단면. 코드에 수직으로 잰 등면(위)~배면(아래) 최대 거리가 T입니다. 슬라이더를 0%로 두면 정중선 시상 단면입니다.' },
  { g: '1-2', id: 'tr', name: '두께비', orig: 'thickness ratio, TR', conflict: ['#7'],
    def: 'TR = T / C',
    src: ['Fontanella 2013'],
    show: '같은 단면에서 T(최대 두께)를 C(코드)로 나눈 값. 슬라이더로 위치를 옮기며 바깥쪽으로 갈수록 어떻게 변하는지 보세요.' },
  { g: '1-2', id: 'sp', name: '최대 두께 위치', orig: 'shoulder position, SP', conflict: ['#7'],
    def: 'SP = SR / C. SR = 앞전~최대 두께 지점 거리.',
    src: ['Fontanella 2013'],
    show: '앞전에서 최대 두께 지점까지 코드 방향 거리(SR)를 C로 나눈 값. 0이면 앞전, 1이면 뒷전입니다.' },
  { g: '1-2', id: 'camber', name: '캠버', orig: 'maximum camber MC, position of maximum camber PMC',
    def: '단면 캠버선의 최대 캠버와 앞전에서 그 지점까지 거리. 파동형은 배면이 평평한 캠버 단면, 진동형은 대칭 익형에 가까움.',
    src: ['Fontanella 2013', 'Moored 2011a'],
    show: '캠버선(등면·배면의 가운데 선, 산호색)이 코드선에서 가장 멀리 떨어진 거리(MC)와 앞전에서 그 위치까지(PMC). 만타는 대칭에 가깝고 표준 가오리는 배면이 평평해 캠버가 큽니다. 모델을 바꿔 비교해 보세요.' },

  // 1-3
  { g: '1-3', id: 'mass', name: '체질량', orig: 'M',
    def: '전자저울로 측정. BEM 모델에서는 COT 계산에 사용.',
    src: ['Fontanella 2013', 'Fish 2016'],
    show: '꼬리·지느러미를 포함한 몸 전체.' },
  { g: '1-3', id: 'mred', name: '환산 질량', orig: 'reduced mass, M_red',
    def: 'M_red = m / (ρL³)',
    src: ['Bottom 2016'],
    show: '몸 전체 질량 m을, 한 변이 L인 정육면체 부피만큼의 물 질량(ρL³)으로 나눈 무차원 값. 상자는 L을 DL로 잡은 예시입니다.' },
  { g: '1-3', id: 'density', name: '체밀도', orig: 'body density',
    def: '공기 중 무게와 액체 중 무게로 아르키메데스 원리 적용.',
    src: ['Chaumel 2025'],
    show: '몸 전체. 공기 중 무게와 물속 무게의 차이가 부력(밀어낸 물의 무게)이므로, 일반식은 밀도 = ρ물 × W공기 / (W공기 − W물)입니다.' },
  { g: '1-3', id: 'com', name: '무게중심 위치', orig: 'centre of mass, COM',
    def: '매달기법(Alexander 1983)으로 구함. 최대 스팬 축 대비 앞(음수)·뒤(양수) 거리를 L로 정규화.',
    src: ['Fontanella 2013', 'Fish 2018'],
    show: '민트 선은 양쪽 지느러미 끝을 잇는 최대 스팬 축. COM이 이 축보다 앞이면 음수, 뒤면 양수이며 그 거리를 L로 나눕니다. 점 위치는 예시입니다.' },
  { g: '1-3', id: 'tailmass', name: '꼬리 질량 비율', orig: '',
    def: '꼬리 질량 / 전체 질량',
    src: ['Chaumel 2025'],
    show: '꼬리 기부에서 잘라낸 꼬리(강조)의 질량을 몸 전체 질량으로 나눈 값.' },

  // 1-4 (골격 보기)
  { g: '1-4', id: 'radial', name: '지느러미살·방사연골 구성', orig: 'fin ray, radial',
    def: '변형된 가슴띠에서 방사형으로 뻗은 지느러미살. 각 살은 짧은 원통형 radial이 끝끝으로 이어짐.',
    src: ['Schaefer & Summers 2005', 'Moored 2011a'],
    show: '골격 보기. 가슴띠(coracoid bar)와 기저 연골에서 바깥으로 뻗은 선이 지느러미살이고, 강조한 한 줄 위의 점이 짧은 radial 마디 사이 관절입니다.' },
  { g: '1-4', id: 'calc', name: '석회화 양식', orig: 'crustal vs catenated', fig: 'calc',
    def: 'radial 전체를 덮는 석회화(crustal) vs 사슬형(catenated). 이론 계산상 crustal이 더 단단함.',
    src: ['Schaefer & Summers 2005'],
    show: 'radial 단면 수준의 특징이라 3D에서는 해당 radial 위치만 표시하고, 아래 단면 모식도로 두 양식을 비교합니다.' },
  { g: '1-4', id: 'chains', name: '사슬(chain) 개수', orig: '', fig: 'chains',
    def: 'catenated radial의 근위 등·배 사슬 수, 원위 등·배 사슬 수, 측면 사슬 유무.',
    src: ['Schaefer & Summers 2005'],
    show: '한 radial을 근위(몸쪽, 민트)·원위(끝쪽, 산호색) 구간으로 나눠 표시. 각 구간 단면에서 등쪽·배쪽 사슬 수와 측면 사슬 유무를 셉니다.' },
  { g: '1-4', id: 'brace', name: '교차 보강', orig: 'cross-bracing',
    def: '인접 지느러미살의 radial 사이 연결 구조의 유무와 분포. 진동형의 날개 중앙부에서 관찰.',
    src: ['Schaefer & Summers 2005'],
    why: '진동형(만타) 날개 중앙부에서 관찰된 구조입니다. 표준 가오리(파동형)에서는 같은 위치에 비교용으로만 표시합니다.',
    show: '이웃한 지느러미살을 가로로 잇는 짧은 연결(노랑). 날개 중앙부에 분포합니다.' },
  { g: '1-4', id: 'stagger', name: '관절 엇갈림', orig: 'joint staggering',
    def: '인접 지느러미살의 관절 위치가 엇갈리는 배열 유무.',
    src: ['Schaefer & Summers 2005'],
    show: '이웃한 두 지느러미살의 관절(점, 줄마다 색을 번갈아 표시)이 같은 거리에 나란히 있지 않고 반 마디씩 어긋난 배열.' },
  { g: '1-4', id: 'radshape', name: 'radial 형상과 길이 분포', orig: '', fig: 'radshape',
    def: '단면형(사각·삼각·원형~등배 압축 타원), 투영형(가는 직사각형~정사각형), 몸축에서의 거리에 따른 길이 변화.',
    src: ['Schaefer & Summers 2005'],
    show: '한 지느러미살의 마디를 몸축에서의 거리에 따라 색(근위 민트 → 원위 산호색)으로 표시. 마디 길이가 거리에 따라 어떻게 변하는지 보는 지표이며, 모델의 길이 변화는 예시입니다.' },
  { g: '1-4', id: 'bifurc', name: '지느러미살 분지', orig: 'bifurcation',
    def: '원위부에서 지느러미살이 두 갈래로 나뉘는 횟수·위치.',
    src: ['Schaefer & Summers 2005'],
    show: '지느러미 가장자리 가까이에서 Y자로 갈라지는 부분(노랑). 몇 번, 어디서 갈라지는지를 셉니다.' },
  { g: '1-4', id: 'rom', name: 'radial 관절 가동 범위', orig: '',
    def: '인접 radial 사이 약 15°.',
    src: ['Schaefer & Summers 2005', 'Moored 2011a'],
    show: '한 관절에서 다음 radial이 꺾일 수 있는 각도. 민트 선은 곧게 이어질 때, 노랑 선은 약 15° 꺾였을 때입니다.' },
  { g: '1-4', id: 'cantilever', name: 'radial 굽힘 모델 (외팔보)', orig: '',
    def: 'Y_max = FL³ / 3EI (F 근력, L radial 길이, E 재료 강성, I 단면2차 모멘트)',
    src: ['Schaefer & Summers 2005'],
    show: '지느러미살을 기부가 고정된 외팔보(민트)로 보고, 끝에 힘 F가 걸릴 때의 최대 처짐 Y_max를 계산합니다. 노랑 선이 처진 모양(과장)입니다.' },
  { g: '1-4', id: 'stiff', name: '강성 분포', orig: '', fig: 'stiff',
    def: '정성적. 지느러미 중심부가 끝보다 단단함.',
    src: ['Fish 2016'],
    show: '색이 짙을수록 단단하고(중심부) 옅을수록 유연합니다(끝). 정성적 기술이라 색은 개념 표시입니다.' },
  { g: '1-4', id: 'basal', name: '기저 연골 형상', orig: 'propterygium, mesopterygium, metapterygium, coracoid bar',
    def: '첫 번째 요소에 랜드마크를 찍어 형상 비교. mesopterygium은 없거나 radial과 유합된 경우가 있어 제외.',
    src: ['López-Romero 2025', 'Rosenberger & Westneat 1999'],
    show: '지느러미살이 붙는 기부의 큰 연골: 앞쪽 propterygium(노랑), 가운데 mesopterygium(회색, 비교에서 제외), 뒤쪽 metapterygium(산호색), 좌우를 잇는 coracoid bar(민트). 위치·길이는 모식입니다.' },

  // 1-5
  { g: '1-5', id: 'pmus', name: '가슴지느러미 근육 층', orig: 'abductor / adductor', fig: 'muscle',
    def: '등쪽 근육(abductor)·배쪽 근육(adductor), 각각 표층·심층. 계측은 표층만.',
    src: ['Rosenberger & Westneat 1999'],
    variants: [
      { label: '등쪽 abductor', text: '등면 쪽 근육층 (위에서 보기)' },
      { label: '배쪽 adductor', text: '배면 쪽 근육층 (아래에서 보기)' },
    ],
    show: '가슴지느러미 등면·배면을 덮는 근육층(강조). 각 층은 표층·심층으로 나뉘며 계측은 표층만 했습니다(아래 단면 모식도).' },
  { g: '1-5', id: 'pelvmus', name: '배지느러미 근육', orig: '', models: STD, why: BENTHIC,
    def: '배쪽: 근위·원위 지느러미 하강근, propterygium 하강근·후퇴근. 등쪽: 거상근, propterygium 전진근. 기시·부착·작용을 정성적으로 기술.',
    src: ['Macesic & Kajiura 2010'],
    variants: [
      { label: '배쪽', text: '근위·원위 지느러미 하강근, propterygium 하강근·후퇴근' },
      { label: '등쪽', text: '거상근, propterygium 전진근' },
    ],
    show: '배지느러미(강조)와 그 앞쪽 엽을 받치는 propterygium(노랑)에 붙는 근육.' },

  // 1-6
  { g: '1-6', id: 'pelvarea', name: '배지느러미 면적 비', orig: '',
    def: '배지느러미 표면적 / 전체 체반 면적(%)',
    src: ['Macesic & Kajiura 2010'],
    show: '배지느러미(밝은 강조) 면적을 전체 체반(어두운 강조) 면적으로 나눈 백분율. 아래에서 본 모습입니다.' },
  { g: '1-6', id: 'pseg', name: '배지느러미 propterygium 분절', orig: '', models: STD, why: BENTHIC,
    def: '진짜 펀터는 분절되고 원위 요소와 과상 관절이 있음, 보조 펀터는 단일 요소.',
    src: ['Macesic & Kajiura 2010'],
    variants: [
      { label: '진짜 펀터', text: '분절된 propterygium + 원위 요소와 과상 관절' },
      { label: '보조 펀터', text: '단일 요소 propterygium' },
    ],
    show: '배지느러미 앞쪽 엽을 받치는 propterygium(골격 보기). 정의 버튼으로 분절형과 단일형을 비교합니다.' },
  { g: '1-6', id: 'pei', name: 'propterygium 굽힘 강성', orig: 'flexural stiffness, EI', models: STD, why: BENTHIC, fig: 'bend3',
    def: '3점 굽힘 시험(받침점 간격 1.2 cm, 가운데 하중)의 보 식 EI = Fl³ / 48y_max (수식은 PDF에서 깨져 추출돼 원문 대조 권장). 펀팅 능력의 가장 강한 예측 변수.',
    src: ['Macesic & Summers 2012'],
    show: '배지느러미 propterygium(노랑)을 떼어 두 받침점 위에 놓고 가운데를 눌러 처짐을 잽니다(모식도).' },
  { g: '1-6', id: 'pE', name: 'propterygium 재료 강성', orig: 'apparent material stiffness, E', models: STD, why: BENTHIC, fig: 'ecross',
    def: '크기·형상과 무관한 재료 자체의 강성. 단면2차 모멘트 I = ∫x²dA와 함께 산출.',
    src: ['Macesic & Summers 2012'],
    show: 'EI에서 단면 형상의 몫(I)을 떼어낸 재료 고유의 강성. I는 단면에서 중립축까지 거리 x의 제곱을 면적에 대해 적분한 값입니다.' },
  { g: '1-6', id: 'pshape', name: 'propterygium 단면 형상 지표', orig: 'Ip:Ih, CSA, R/t', models: STD, why: BENTHIC, fig: 'hollow',
    def: '형상비 Ip:Ih(같은 단면적의 중공 원과 비교, 1 초과면 굽힘에 더 강함), 단면적 CSA, 반지름/두께 비 R/t, tesserae 두께, 길이.',
    src: ['Macesic & Summers 2012'],
    show: 'propterygium(노랑) 단면에서 재는 형상 지표(모식도).' },
  { g: '1-6', id: 'pcomp', name: 'propterygium 조성', orig: '', models: STD, why: BENTHIC,
    def: '광물질 함량(% 건조 질량), 수분 함량(% 습중량), 유기물 함량.',
    src: ['Macesic & Summers 2012'],
    show: 'propterygium(노랑) 조직의 구성 비율. 형상이 아닌 재료 분석값이라 위치만 표시합니다.' },
  { g: '1-6', id: 'tail', name: '꼬리 길이와 표준화 꼬리 길이', orig: 'STL',
    def: '꼬리 기부~끝. STL = 꼬리 길이 / BL, 꼬리 길이 / DW도 사용.',
    src: ['Chaumel 2025'],
    variants: [
      { label: '꼬리 / BL', text: 'STL = 꼬리 길이 / BL (BL = 주둥이 ~ 꼬리 기부)', src: 'Chaumel 2025' },
      { label: '꼬리 / DW', text: '꼬리 길이 / DW', src: 'Chaumel 2025' },
    ],
    show: '꼬리 기부에서 꼬리 끝까지(노랑). 나누는 기준 길이(산호색)는 정의 버튼으로 바꿉니다.' },
  { g: '1-6', id: 'cephalic', name: '두부엽·주둥이 연골', orig: 'cephalic lobes, rostral cartilage',
    def: '있는 종은 지느러미 기부 길이가 DL과 달라짐. AR 계산에서 두부엽을 제외한 연구도 있음.',
    src: ['Rosenberger 2001', 'Martinez 2016'],
    why: '만타에는 주둥이 연골이 없어 두부엽을, 표준 가오리에서는 주둥이 연골을 보여줍니다.',
    show: '만타는 머리 앞 두부엽, 표준 가오리는 주둥이를 받치는 주둥이 연골(강조). 이 구조 때문에 지느러미 기부(산호색)와 DL(노랑)의 시작점이 달라집니다.' },
];

export const REFS = {
  'Rosenberger 2001': 'Pectoral fin locomotion in batoid fishes: undulation versus oscillation. J. Exp. Biol. 204, 379–394.',
  'Rosenberger & Westneat 1999': 'Functional morphology of undulatory pectoral fin locomotion in the stingray Taeniura lymma. J. Exp. Biol. 202.',
  'Blevins & Lauder 2012': 'Rajiform locomotion: three-dimensional kinematics of the pectoral fin surface in Potamotrygon orbignyi. J. Exp. Biol. 215, 3231–3241.',
  'Di Santo 2017': 'Di Santo, Blevins & Lauder. Batoid locomotion: effects of speed on pectoral fin deformation in the little skate. J. Exp. Biol. 220, 705–712.',
  'Schaefer & Summers 2005': 'Batoid wing skeletal structure: novel morphologies, mechanical implications, and phylogenetic patterns. J. Morphol. 264, 298–313.',
  'Fontanella 2013': 'Fontanella et al. Two- and three-dimensional geometries of batoids in relation to locomotor mode. J. Exp. Mar. Biol. Ecol. 446, 273–281.',
  'Martinez 2016': 'Martinez, Rohlf & Frisk. Re-evaluation of batoid pectoral morphology reveals novel patterns of diversity among major lineages. J. Morphol. 277, 482–493.',
  'López-Romero 2025': 'López-Romero et al. Evolution of the Batoidea pectoral fin skeleton: convergence, modularity, and integration driving disparity trends. Evol. Ecol.',
  'Moored 2011a': 'Moored, Fish, Kemp & Bart-Smith. Batoid fishes: inspiration for the next generation of underwater robots. Mar. Technol. Soc. J. 45(4), 99–109.',
  'Moored 2011b': 'Moored, Dewey, Leftwich, Bart-Smith & Smits. Bioinspired propulsion mechanisms based on manta ray locomotion. Mar. Technol. Soc. J. 45(4), 110–118.',
  'Fish 2016': 'Fish et al. Hydrodynamic performance of aquatic flapping: efficiency of underwater flight in the manta. Aerospace 3, 20.',
  'Fish 2018': 'Fish et al. Kinematics of swimming of the manta ray: three-dimensional analysis of open-water maneuverability. J. Exp. Biol. 221, jeb166041.',
  'Bottom 2016': 'Bottom, Borazjani, Blevins & Lauder. Hydrodynamics of swimming in stingrays: numerical simulations and the role of the leading-edge vortex. J. Fluid Mech. 788, 407–443.',
  'Macesic & Kajiura 2010': 'Comparative punting kinematics and pelvic fin musculature of benthic batoids. J. Morphol. 271, 1219–1228.',
  'Macesic & Summers 2012': 'Flexural stiffness and composition of the batoid propterygium as predictors of punting ability. J. Exp. Biol. 215, 2003–2012.',
  'Chaumel 2025': 'Chaumel, White & Lauder. Function of the tail in myliobatid rays: role in controlling body stability. R. Soc. Open Sci. 12, 251269.',
};

export const CONFLICTS = {
  '#2': { title: '파수의 기준 길이', items: [
    'DL / λ: Rosenberger & Westneat 1999.',
    '지느러미 기부 길이 / λ: Rosenberger 2001. 주둥이 연골·두부엽이 있는 종은 DL과 다릅니다.',
    'DL과 DP 둘 다: Blevins & Lauder 2012. 같은 데이터가 DL 기준 1.10, DP 기준 1.65입니다. DL 값은 경계 1을 겨우 넘으므로 DP가 실제 파 경로를 더 잘 반영한다고 주장합니다.',
    '코드 / λ: Zhu 2025 (프리프린트).',
  ] },
  '#4': { title: '가로세로비(AR) 정의', items: [
    '스팬 / 코드: Moored 2011a, Fish 2016·2018. 만타 AR 3.5.',
    'S² / A: Fontanella 2013 (진동형·파동형 경계 2.60), Moored 2011b (b²/S).',
    '(최대 코드 폭)² / 지느러미 면적, 한쪽 값 ×2: Martinez 2016.',
    'DW² / (DW × 코드 / 2): Chaumel 2025. Mobula birostris AR 5.8.',
    'López-Romero 2025: AR을 "plesodic radial이 지지하는 면적"으로 설명하며 Martinez 2016을 인용하는데, Martinez의 정의와 다릅니다.',
    '영향: 같은 만타가 3.5와 5.8로 보고됩니다. Chaumel 식은 산술적으로 2 × DW / 코드라서 스팬/코드 정의와 약 2배 차이가 납니다. Fontanella의 2.60 경계는 S²/A에만 적용됩니다.',
  ] },
  '#5': { title: '몸길이·체반 길이 정의', items: [
    'DL = 주둥이 끝~꼬리 기부: Rosenberger & Westneat 1999.',
    'DL = 주둥이 끝~체반 뒷가장자리: Blevins & Lauder 2012.',
    'L = 주둥이 끝~배지느러미 뒷가장자리: Fontanella 2013.',
    'L = 눈~꼬리 기부: Fish 2018.',
    'BL = 주둥이~꼬리 기부(배지느러미 사이): Chaumel 2025.',
    'BL = DL: Di Santo & Kenaley 2016, Di Santo 2017.',
    '영향: BL/s로 적은 속도, R/L, St, Re는 기준 길이가 다르면 값이 달라집니다.',
  ] },
  '#7': { title: 'Fontanella 2013 초록과 본문 불일치', items: [
    '초록: 파동형이 두께비(TR)가 더 크고, 진동형이 최대 두께 위치(SP)가 더 뒤라고 씁니다.',
    '본문 결과: TR은 진동형 0.12 ± 0.03, 파동형 0.08 ± 0.04(유의, P = 0.003). SP는 파동형 0.37 ± 0.07, 진동형 0.34 ± 0.02(유의하지 않음).',
    '같은 연구진의 SICB 학회 초록: 파동형 지느러미가 코드 대비 더 얇다고 써서 본문과 일치합니다. 단, AR 경계는 2.7로 논문(2.60)과 다릅니다.',
    '논문 Fig. 8 그래프로 직접 확인해 보시는 것을 권합니다.',
  ] },
};

// 3D로 보기 어려운 미세 구조·시험 방법 모식도
export const FIGS = {
  calc: `<svg viewBox="0 0 320 140" class="fig">
    <text x="160" y="16" class="tx">radial 단면 모식도 (위 = 등쪽)</text>
    <g transform="translate(80 66)"><ellipse rx="44" ry="30" class="fs"/><ellipse rx="44" ry="30" class="ring"/><text y="52" class="tx">crustal · 전체를 덮음</text></g>
    <g transform="translate(240 66)"><ellipse rx="44" ry="30" class="fs"/><g class="fa"><circle cy="-22" r="5"/><circle cx="-11" cy="-20" r="5"/><circle cx="11" cy="-20" r="5"/><circle cy="22" r="5"/><circle cx="-11" cy="20" r="5"/><circle cx="11" cy="20" r="5"/></g><text y="52" class="tx">catenated · 사슬형</text></g>
  </svg>`,
  chains: `<svg viewBox="0 0 320 140" class="fig">
    <text x="160" y="16" class="tx">catenated radial 단면 — 사슬 세기 (개수는 예시)</text>
    <g transform="translate(80 66)"><ellipse rx="40" ry="28" class="fs"/><g class="fa"><circle cx="-8" cy="-20" r="5"/><circle cx="8" cy="-20" r="5"/><circle cx="-8" cy="20" r="5"/><circle cx="8" cy="20" r="5"/></g><g class="fb"><circle cx="-36" r="4"/><circle cx="36" r="4"/></g><text y="50" class="tx">근위: 등 2 · 배 2 · 측면 있음</text></g>
    <g transform="translate(240 66)"><ellipse rx="30" ry="20" class="fs"/><g class="fa"><circle cy="-13" r="4.5"/><circle cy="13" r="4.5"/></g><text y="50" class="tx">원위: 등 1 · 배 1 · 측면 없음</text></g>
  </svg>`,
  radshape: `<svg viewBox="0 0 320 150" class="fig">
    <text x="12" y="26" class="tx l">단면형</text>
    <g class="ln fs"><rect x="76" y="10" width="26" height="26"/><path d="M128 36 L141 10 L154 36Z"/><circle cx="196" cy="23" r="13"/><ellipse cx="256" cy="23" rx="22" ry="9"/></g>
    <text x="166" y="54" class="tx">사각 · 삼각 · 원형 ~ 등배 압축 타원</text>
    <text x="12" y="92" class="tx l">투영형</text>
    <g class="ln fs"><rect x="76" y="80" width="64" height="12"/><rect x="160" y="76" width="40" height="20"/><rect x="222" y="72" width="28" height="28"/></g>
    <text x="166" y="118" class="tx">가는 직사각형 → 정사각형</text>
    <text x="160" y="140" class="tx">+ 몸축에서의 거리에 따른 마디 길이 변화</text>
  </svg>`,
  stiff: `<svg viewBox="0 0 320 50" class="fig"><defs><linearGradient id="gs"><stop offset="0" stop-color="#0a3d6b"/><stop offset="1" stop-color="#a8f7ff"/></linearGradient></defs>
    <rect x="20" y="10" width="280" height="14" rx="7" fill="url(#gs)"/><text x="20" y="42" class="tx l">단단함 (중심부)</text><text x="300" y="42" class="tx r">유연함 (끝)</text></svg>`,
  muscle: `<svg viewBox="0 0 320 140" class="fig"><defs><clipPath id="lens"><path d="M20 70 Q160 10 300 70 Q160 130 20 70Z"/></clipPath></defs>
    <g clip-path="url(#lens)"><rect width="320" height="52" class="m1"/><rect y="52" width="320" height="10" class="m2"/><rect y="62" width="320" height="16" class="fs"/><rect y="78" width="320" height="10" class="m2"/><rect y="88" width="320" height="52" class="m1"/></g>
    <path d="M20 70 Q160 10 300 70 Q160 130 20 70Z" class="ln"/>
    <g class="tx sm"><text x="160" y="49">등쪽 abductor 표층</text><text x="160" y="60">심층</text><text x="160" y="73">지느러미살</text><text x="160" y="86">심층</text><text x="160" y="98">배쪽 adductor 표층</text></g>
    <text x="160" y="128" class="tx">가슴지느러미 단면 모식도 · 계측은 표층만</text></svg>`,
  bend3: `<svg viewBox="0 0 320 140" class="fig">
    <path d="M40 60 Q160 84 280 60" class="ln2"/><line x1="40" y1="60" x2="280" y2="60" class="ln"/>
    <path d="M40 62 l-10 18 h20z M280 62 l-10 18 h20z" class="ln fs"/>
    <line x1="160" y1="22" x2="160" y2="50" class="ln"/><path d="M160 60 l-6 -11 h12z" class="fb"/>
    <text x="160" y="16" class="tx">F (가운데 하중)</text>
    <line x1="172" y1="60" x2="172" y2="72" class="ln"/><text x="178" y="72" class="tx l">y_max</text>
    <text x="160" y="98" class="tx">받침점 간격 l = 1.2 cm</text>
    <text x="160" y="124" class="tx big">EI = F l³ / 48 y_max</text></svg>`,
  ecross: `<svg viewBox="0 0 320 140" class="fig">
    <ellipse cx="110" cy="70" rx="62" ry="42" class="ln fs"/>
    <line x1="36" y1="70" x2="184" y2="70" class="ln2"/><text x="188" y="74" class="tx l">중립축</text>
    <rect x="80" y="38" width="60" height="5" class="fa"/><text x="70" y="44" class="tx r">dA</text>
    <line x1="146" y1="70" x2="146" y2="42" class="ln"/><text x="152" y="60" class="tx l">x</text>
    <text x="262" y="56" class="tx big">I = ∫ x² dA</text><text x="262" y="84" class="tx">E = EI / I</text></svg>`,
  hollow: `<svg viewBox="0 0 320 150" class="fig">
    <g transform="translate(78 64)"><ellipse rx="36" ry="26" class="ln fs"/><text y="50" class="tx">실제 단면 → Ip</text></g>
    <g transform="translate(222 64)"><circle r="32" class="ring"/><line x1="0" y1="0" x2="29" y2="0" class="ln"/><text x="13" y="-5" class="tx">R</text><text x="42" y="-26" class="tx l">t</text><text y="50" class="tx">같은 단면적의 중공 원 → Ih</text></g>
    <text x="160" y="132" class="tx">Ip : Ih &gt; 1 이면 굽힘에 더 강함</text>
    <text x="160" y="146" class="tx sm">함께 재는 값: CSA · R/t · tesserae 두께 · 길이</text></svg>`,
};
