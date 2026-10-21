// 출처 서지와 논문 간 정의 차이·신빙성 판단 (parameter_zip.pdf 3장 + 사이트 조정안)
export const REFS = {
  'Rosenberger 2001': 'Pectoral fin locomotion in batoid fishes: undulation versus oscillation. J. Exp. Biol. 204, 379–394.',
  'Rosenberger & Westneat 1999': 'Functional morphology of undulatory pectoral fin locomotion in the stingray Taeniura lymma. J. Exp. Biol. 202.',
  'Blevins & Lauder 2012': 'Rajiform locomotion: three-dimensional kinematics of the pectoral fin surface in Potamotrygon orbignyi. J. Exp. Biol. 215, 3231–3241.',
  'Di Santo 2017': 'Di Santo, Blevins & Lauder. Batoid locomotion: effects of speed on pectoral fin deformation in the little skate. J. Exp. Biol. 220, 705–712.',
  'Di Santo & Kenaley 2016': 'Skating by: low energetic costs of swimming in a batoid fish. J. Exp. Biol. 219, 1804–1807.',
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
  // 사이트 조정안에서 새로 쓴 문헌 (parameter_zip.pdf 출처 목록에는 없음)
  'Francis 2006': 'Morphometric minefields—towards a measurement standard for chondrichthyan fishes. Environ. Biol. Fish. 77, 407–421. 길이 정의·측정 원칙의 근거.',
  'Deakos 2010': 'Paired-laser photogrammetry as a simple and accurate system for measuring the body size of free-ranging manta rays. Aquat. Biol. 10, 1–10. 만타 DW·DL 측정 정밀도.',
  'NASA Wing geometry': 'NASA Glenn Research Center. Wing geometry. 스팬·면적·AR·두께 표준 정의.',
  'Zurman-Nasution 2021': 'Zurman-Nasution, Ganapathisubramani & Weymouth. Fin sweep angle does not determine flapping propulsive performance. J. R. Soc. Interface 18, 20210174. 후퇴각 Λ와 AR = B²/S_p.',
  'Gabler-Smith 2023': 'Gabler-Smith, Coughlin & Fish. Morphological and histochemical characterization of the pectoral fin muscle of batoids. J. Morphol. 284, e21548. 근육층 이름, 근섬유 지표, DL_pel 정의.',
  'Gleiss 2015': 'Gleiss et al. Mechanical challenges to freshwater residency in sharks and rays. J. Exp. Biol. 218(7), 1099. 체밀도 측정과 상대 부력.',
  'Mulvany 2013': 'Evolution and functional morphology of the cephalic lobes in batoids. 박사학위논문, University of South Florida. 두부엽의 기원과 근육층.',
};

// verdict.level = 판단 확신도, ★ 표시는 논문에 적힌 내용이 아니라 조정안 작성자의 계산·추론
export const CONFLICTS = {
  '#2': { title: '파수의 기준 길이 (형태 카드 부분)', items: [
    'DL / λ: Rosenberger & Westneat 1999.',
    '지느러미 기부 길이 / λ: Rosenberger 2001. 주둥이 연골·두부엽이 있는 종은 DL과 다릅니다.',
    'DL과 DP 둘 다: Blevins & Lauder 2012. 같은 데이터가 DL 기준 1.10, DP 기준 1.65입니다. DL 값은 경계 1을 겨우 넘으므로 DP가 실제 파 경로를 더 잘 반영한다고 주장합니다.',
    '코드 / λ: Zhu 2025 (프리프린트).',
  ], verdict: { level: '중간', head: '기준 길이 후보 셋(ℓ_fb, DL, P_d) 중 ℓ_fb의 해부학적 정의가 가장 분명하고, P_d는 원문에 측정법이 없어 값을 재현할 수 없습니다.', points: [
    'Rosenberger 2001은 radial이 붙는 구간이라는 근거와 종별 차이를 제시합니다(p.382).',
    'Blevins & Lauder 2012의 “파가 실제로 지나는 경로” 논리는 타당하지만 P_d를 어떻게 재는지 적지 않았습니다.',
    '★ 같은 종·같은 데이터를 쓴 Bottom 2016의 파수 7.57은 각파수라 2π로 나누면 약 1.2로, Blevins & Lauder의 DL 기준 1.10과 비슷합니다.',
    '유영 지표를 사이트에 넣을 때 파수 정의와 함께 다시 다룹니다.',
  ] } },
  '#4': { title: '가로세로비(AR) 정의', items: [
    '스팬 / 코드: Moored 2011a, Fish 2016·2018. 만타 AR 3.5.',
    'S² / A: Fontanella 2013 (진동형·파동형 경계 2.60), Moored 2011b (b²/S).',
    '(최대 코드 폭)² / 지느러미 면적, 한쪽 값 ×2: Martinez 2016.',
    'DW² / (DW × 코드 / 2): Chaumel 2025. Mobula birostris AR 5.8.',
    'López-Romero 2025: AR을 “plesodic radial이 지지하는 면적”으로 설명하며 Martinez 2016을 인용하는데, Martinez의 정의와 다릅니다.',
    '영향: 같은 만타가 3.5와 5.8로 보고됩니다. Chaumel 식은 산술적으로 2 × DW / 코드라서 스팬/코드 정의와 약 2배 차이가 납니다. Fontanella의 2.60 경계는 S²/A에만 적용됩니다.',
  ], verdict: { level: '정의는 높음 · 수치 비교는 중간', head: '표준식은 AR = DW²/S입니다. 같은 만타가 3.5와 5.8로 보고된 것은 정의 차이로 설명되고, 3.5는 정의가 불완전해 비교에 쓰기 어렵습니다.', points: [
    'NASA 날개 기하 정의와 Zurman-Nasution 2021은 스팬²/평면 면적을 일반식으로, 스팬/코드를 직사각형 날개 전용으로 씁니다.',
    'Fish 2016·2018은 3.5를 “스팬 대 코드의 비”로만 적고, 어떤 코드인지와 측정 출처를 밝히지 않습니다.',
    '★ 만타처럼 마름모에 가까운 평면에서 코드를 루트 코드로 잡으면 DW²/S ≈ 2·DW/c_r이라 두 정의는 약 2배 차이 납니다.',
    'Chaumel 2025의 5.8은 M. birostris 2개체(표본 사진 포함) 측정값이지만, 면적을 마름모로 근사하고 머리·두부엽·배지느러미를 뺀 값입니다. ★ 실제 윤곽 면적보다 작게 잡혀 AR이 커지는 쪽으로 치우칠 수 있습니다. 실제로 소가오리가 Chaumel에서 3.9 ± 0.2인데, 실제 윤곽 면적을 쓴 Fontanella 2013에서는 94개 표본의 최대가 3.78(Aetobatus flagellum)입니다.',
    '다음 확인: Fish 2016 서론의 3.5가 인용한 원출처에서 코드 정의 찾기, Martinez 2016 부록 Fig. S1에서 제곱한 길이가 b인지 확인.',
  ] } },
  '#5': { title: '몸길이·체반 길이 정의', items: [
    'DL = 주둥이 끝~꼬리 기부: Rosenberger & Westneat 1999.',
    'DL = 주둥이 끝~체반 뒷가장자리: Blevins & Lauder 2012.',
    'L = 주둥이 끝~배지느러미 뒷가장자리: Fontanella 2013.',
    'L = 눈~꼬리 기부: Fish 2018.',
    'BL = 주둥이~꼬리 기부(배지느러미 사이): Chaumel 2025.',
    'BL = DL: Di Santo & Kenaley 2016, Di Santo 2017.',
    '영향: BL/s로 적은 속도, R/L, St, Re는 기준 길이가 다르면 값이 달라집니다.',
  ], verdict: { level: '높음', head: '사이트 기준 길이는 DL_pel(주둥이 끝~배지느러미 뒷끝)이 가장 타당합니다. 어느 논문이 틀렸다기보다 뒷 기준점을 밝히지 않은 것이 문제입니다.', points: [
    'Francis 2006은 연골어류 계측법을 검토한 논문으로, DL의 뒷 기준점이 모호하다고 지적하고 DL_pec·DL_pel을 따로 정의합니다. 만타·소가오리류에는 DL_pel을 권하는데, 더 길고 가슴지느러미 뒷끝이 배지느러미 위로 겹쳐 위치가 흔들리기 때문입니다(p.409, p.418).',
    '같은 논문은 DW가 측정 오차가 커서 기준으로 권하지 않고, 만타 레이저 사진측량 연구도 DL이 DW보다 정밀하다고 보고했습니다(Deakos 2010).',
    'Fish 연구실의 형태 연구 두 편(Fontanella 2013, Gabler-Smith 2023)이 모두 DL_pel을 씁니다. ★ 같은 연구실의 Fish 2018이 눈~꼬리 기부를 쓴 것은 야외 영상에서 추적한 점(눈, 꼬리 기부)에 맞춘 것으로 보입니다.',
    '한계: 서로 다른 길이로 잰 값은 같은 개체를 두 방식으로 잰 회귀식이 있어야 환산할 수 있습니다(Francis 2006 p.419).',
  ] } },
  '#7': { title: 'Fontanella 2013 초록과 본문 불일치', items: [
    '초록: 파동형이 두께비(TR)가 더 크고, 진동형이 최대 두께 위치(SP)가 더 뒤라고 씁니다.',
    '본문 결과: TR은 진동형 0.12 ± 0.03, 파동형 0.08 ± 0.04(유의, P = 0.003). SP는 파동형 0.37 ± 0.07, 진동형 0.34 ± 0.02(유의하지 않음).',
    '같은 연구진의 SICB 학회 초록: 파동형 지느러미가 코드 대비 더 얇다고 써서 본문과 일치합니다. 단, AR 경계는 2.7로 논문(2.60)과 다릅니다.',
    '논문 Fig. 8 그래프로 직접 확인해 보시는 것을 권합니다.',
  ], verdict: { level: '높음', head: '본문이 맞고 초록 문장이 잘못되었습니다. 두께비는 진동형이 더 크고(0.12 vs 0.08), 최대 두께 위치는 유의한 차이가 없습니다.', points: [
    '결과 본문(p.276~277), Fig. 8(p.279, y축 T/C, 진동형 검은 점이 대부분 위치에서 위), 고찰(p.280, 진동형 단면이 더 유선형이며 Breder 1926의 소가오리 단면 TR 0.18 인용), 같은 연구진의 SICB 초록(파동형이 코드 대비 더 얇음)이 모두 같은 방향입니다. 초록만 반대입니다.',
    '이번 검색에서 정오표는 확인하지 못했습니다.',
    'AR 경계 2.7(SICB 초록)과 2.60(논문)은 동료심사를 거친 논문 값을 따릅니다.',
  ] } },
  '#10': { title: '무게중심 “몸길이의 47%” (새로 찾은 불일치)', items: [
    'Fontanella 2013: COM을 L = DL_pel(주둥이 끝~배지느러미 뒷끝) 기준으로 보고합니다.',
    'Fish 2018: “몸길이의 약 47%”를 Fontanella 2013에서 인용하지만, Fish 2018 자신의 L은 눈~꼬리 기부(L_eye)입니다.',
  ], verdict: { level: '높음', head: '같은 47%가 몸의 서로 다른 지점을 가리킵니다. 사이트는 Fontanella 기준(DL_pel)으로만 표시합니다.', points: [
    'Fish 2018의 값은 기준 길이가 다른데도 인용만 이어졌습니다. 재사용하려면 DL_pel로 다시 환산해야 하고, 그러려면 두 길이의 회귀식이 필요합니다(Francis 2006 p.419).',
  ] } },
};
