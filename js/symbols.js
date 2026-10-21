// 사이트 조정안: 기호표와 단위 규칙. 한 기호는 한 뜻만 갖고, A는 2장 유영 지표의 진폭용으로 비워 둔다.
export const KINDS = {
  abs: '절대값', norm: '정규화값', ratio: '고유 비', cat: '범주', count: '개수',
};

export const BASIS = {
  measured: '실측', model: '모델 가정', 'pers. obs.': '저자 개인 관찰', qualitative: '정성적 기술',
  preserved: '보존 표본 근사', 'n=1': '표본 1개체',
};

export const KIND_TABLE = [
  ['절대값', '물리 단위가 붙은 실제 크기. 개체가 크면 값도 큼', 'DW = 3.4 m', '한 개체·모델의 실치수, 로봇 설계값'],
  ['정규화값', '절대값을 기준 크기로 나눈 값. 단위는 없지만 기준이 바뀌면 값도 바뀜', 'x_COM = 0.47 DL_pel, y/b = 0.75', '크기가 다른 개체·종 비교'],
  ['고유 비', '정의 자체가 비율이라 절대값이 없음', 'AR = 5.8, t/c = 0.12', '형상 비교'],
  ['범주·개수', '단위 없음', 'crustal / catenated, 분지 2회', '구조 기술'],
];

export const UNIT_RULE = '길이 cm(만타는 m), 면적 cm², 각도 °, 질량 kg(작은 표본은 g), 밀도 kg m⁻³(1 g mL⁻¹ = 1000 kg m⁻³), 힘 N, 굽힘 강성 N·mm², 재료 강성 MPa(= N mm⁻²), 단면2차모멘트 mm⁴.';

// [기호, 뜻, 원문 기호, 메모]
export const SYMBOLS = [
  ['DW', '체반 폭, 좌우 가슴지느러미 끝 사이 직선거리', 'DW; S (Fontanella 2013); 2b (Fish 2016)', 'Fontanella의 S는 면적이 아니라 스팬'],
  ['b', '반스팬, 정중선~한쪽 끝 = DW/2', 'b (Fish 2016), semispan', 'Moored 2011b의 b는 벽에 고정한 로봇 핀 한 장의 길이'],
  ['ℓ_pf', '지느러미 길이, 지느러미 기부~끝', 'pectoral fin length (Gabler-Smith 2023)', '몸통 반폭만큼 b보다 짧음'],
  ['y', '스팬 방향 위치(정중선 0)', '% semispan', 'y/b로 표기'],
  ['DL_pec', '주둥이 끝~가슴지느러미 뒷끝', 'DL (Blevins & Lauder 2012)', 'Francis 2006 표준 이름'],
  ['DL_pel', '주둥이 끝~배지느러미 뒷끝', 'L (Fontanella 2013), total body length (Gabler-Smith 2023)', '사이트 기준 길이'],
  ['DL_tb', '주둥이 끝~꼬리 기부', 'DL (Rosenberger & Westneat 1999), BL (Chaumel 2025)', '표준 이름이 아니라 사이트용 구분'],
  ['L_eye', '눈~꼬리 기부', 'L (Fish 2018)', '야외 영상에서 쓴 길이'],
  ['TL', '전장, 주둥이 끝~꼬리 끝', 'TL', '꼬리 손상이 잦아 만타·소가오리류엔 비권장'],
  ['ℓ_fb', '가슴지느러미 기부 길이', 'fin base', ''],
  ['P_d', '체반 둘레', 'DP, circumferential length', ''],
  ['c_r, c(y), c_max, c̄', '루트 코드, 위치 y의 국소 코드, 최대 코드, 평균 코드(= S/DW)', 'c, C', 'c̄는 공기역학 정의'],
  ['S, S_fin', '평면 면적(전체, 한쪽 지느러미)', 'A (Fontanella 2013); S (Moored 2011b, Smits et al.); S_p (Zurman-Nasution 2021)', ''],
  ['AR', '가로세로비 DW²/S', 'AR', ''],
  ['Λ_LE', '앞전 후퇴각', 'Λ (Zurman-Nasution 2021)', '가오리 논문에는 수치 정의 없음'],
  ['t, x_t', '최대 두께, 앞전~최대 두께 거리', 'T, SR (Fontanella 2013)', 'T는 주기·추력과 겹침'],
  ['z_c, x_c', '최대 캠버, 앞전~최대 캠버 거리', 'MC, PMC (Fontanella 2013)', ''],
  ['M, m_tail', '체질량, 꼬리 질량', 'M; m (Bottom 2016)', ''],
  ['ρ_b, ρ_w', '체밀도, 물(주변 유체) 밀도', 'ρ', ''],
  ['M*', '환산 질량 M/(ρ_w L³)', 'M_red (Bottom 2016)', ''],
  ['x_COM', '주둥이 끝~무게중심 거리', 'COM', ''],
  ['ℓ_r', 'radial(한 마디) 길이', 'L (Schaefer & Summers 2005)', '몸길이 L과 겹침'],
  ['F, E, I, EI', '힘, 재료 강성, 단면2차모멘트, 굽힘 강성', '같음', ''],
  ['δ_max', '최대 처짐', 'Y_max (Schaefer & Summers 2005), y_max (Macesic & Summers 2012)', ''],
  ['ℓ_s', '3점 굽힘 받침점 간격', 'l (Macesic & Summers 2012)', ''],
  ['ℓ_p', 'propterygium 길이', '—', ''],
  ['t_tess', 'tesserae 두께', 't (Macesic & Summers 2012)', '지느러미 두께 t와 구분'],
  ['ℓ_tail', '꼬리 길이', 'tail length', ''],
  ['θ_ROM', 'radial 관절 가동 범위', '—', ''],
];
