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
    <text x="160" y="128" class="tx">가슴지느러미 단면 모식도 · 근전도는 표층에서만 기록</text></svg>`,
  bend3: `<svg viewBox="0 0 320 140" class="fig">
    <path d="M40 60 Q160 84 280 60" class="ln2"/><line x1="40" y1="60" x2="280" y2="60" class="ln"/>
    <path d="M40 62 l-10 18 h20z M280 62 l-10 18 h20z" class="ln fs"/>
    <line x1="160" y1="22" x2="160" y2="50" class="ln"/><path d="M160 60 l-6 -11 h12z" class="fb"/>
    <text x="160" y="16" class="tx">F (가운데 하중)</text>
    <line x1="172" y1="60" x2="172" y2="72" class="ln"/><text x="178" y="72" class="tx l">δ_max</text>
    <text x="160" y="98" class="tx">받침점 간격 ℓ_s = 1.2 cm</text>
    <text x="160" y="124" class="tx big">EI = F ℓ_s³ / 48 δ_max</text></svg>`,
  ecross: `<svg viewBox="0 0 320 140" class="fig">
    <ellipse cx="110" cy="70" rx="62" ry="42" class="ln fs"/>
    <line x1="36" y1="70" x2="184" y2="70" class="ln2"/><text x="188" y="74" class="tx l">중립축</text>
    <rect x="80" y="38" width="60" height="5" class="fa"/><text x="70" y="44" class="tx r">dA</text>
    <line x1="146" y1="70" x2="146" y2="42" class="ln"/><text x="152" y="60" class="tx l">x</text>
    <text x="262" y="56" class="tx big">I = ∫ x² dA</text><text x="262" y="84" class="tx">E = EI / I</text></svg>`,
  hollow: `<svg viewBox="0 0 320 150" class="fig">
    <g transform="translate(78 64)"><ellipse rx="36" ry="26" class="ln fs"/><text y="50" class="tx">실제 단면 → I_p</text></g>
    <g transform="translate(222 64)"><circle r="32" class="ring"/><line x1="0" y1="0" x2="29" y2="0" class="ln"/><text x="13" y="-5" class="tx">R</text><text x="42" y="-26" class="tx l">t_tess</text><text y="50" class="tx">같은 단면적의 중공 원 → I_h</text></g>
    <text x="160" y="132" class="tx">I_p : I_h &gt; 1 이면 굽힘에 더 강함</text>
    <text x="160" y="146" class="tx sm">함께 재는 값: CSA · R/t · tesserae 두께 · 길이</text></svg>`,
};
