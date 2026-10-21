// 유영 지표 탭: 왼쪽 목록과 오른쪽 조절·설명 패널을 HTML 문자열로 만든다.
import { MODES, METRICS, SWIM_GROUPS, CONTROLS } from './swim-data.js';
import { REFS } from './refs.js';
import { conflictHTML, NAMES } from './panel.js';

const nf = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });
const num = x => (Number.isFinite(x) ? (Math.abs(x) >= 1000 ? nf0.format(x) : nf.format(x)) : '—');
const MODE = Object.fromEntries(MODES.map(m => [m.id, m]));
const METRIC = Object.fromEntries(METRICS.map(m => [m.id, m]));

// 계산 지표 카드: [이름, 기호, 단위, 식, 지표 id]
const CALC = {
  cls: ['파수로 본 방식', 'W', '', 'Rosenberger 2001 경계 0.5 · 1', 'W'],
  lambda: ['파장', 'λ', 'DL_pel', 'DL_pel / W', 'lambda'],
  c: ['파 속도', 'c', 'DL_pel/s', 'f · λ', 'c'],
  slip: ['슬립', 'U/c', '', '1 미만이면 파가 몸보다 빠름', 'slip'],
  stride: ['보폭', 'U/f', 'DL_pel/박동', '한 박동에 전진한 거리', 'stride'],
  St: ['스트루하레 수', 'St', '', 'f · 2a / U (피크-투-피크)', 'St'],
  k: ['환산 진동수', 'k', '', '2π f c_r / U', 'k'],
  Re: ['레이놀즈 수', 'Re', '', 'U L / ν, L = DL_pel', 'Re'],
  tiplag: ['끝 지연', 'δ_tip / b', '', '루트가 중립면을 지날 때 끝 처짐 ÷ 반스팬', 'tiplag'],
  omega: ['선회율', 'ω', '°/s', 'U / R', 'omega'],
  ac: ['구심 가속도', 'a_c', 'g', 'U² / R', 'ac'],
  puntU: ['펀팅 속도', 'd_p / T_p', 'DL_pel/s', '펀트당 거리 ÷ 펀트 주기', 'puntdist'],
  strideTail: ['꼬리 박동당 전진', 'U / f_tail', 'DL_pel/박동', '한 꼬리 박동에 전진한 거리', 'tailf'],
};

const classify = W => (W < 0.5 ? '진동형' : W <= 1 ? '중간형' : '파동형');

export const swimListHTML = () => `
  <details open><summary><span class="gid">2-0</span>유영 방식<span class="cnt">${MODES.length}</span></summary>
    ${MODES.map(m => `<button class="item" data-swim="${m.id}"><span class="nm">${m.name}${m.models ? '<i class="mk">표준 가오리</i>' : ''}</span><span class="df">${m.def}</span></button>`).join('')}
  </details>
  ${SWIM_GROUPS.map(([g, title]) => {
    const items = METRICS.filter(x => x.g === g);
    return `<details${g === '2-1' ? ' open' : ''}><summary><span class="gid">${g}</span>${title}<span class="cnt">${items.length}</span></summary>
      ${items.map(x => `<button class="item" data-metric="${x.id}"><span class="nm">${x.name}${x.ctrl ? '<i class="mk">조절</i>' : ''}${x.calc ? '<i class="mk calc">계산</i>' : ''}${x.conflict ? '<i class="mk warn">정의 차이</i>' : ''}</span><span class="df">${x.def}</span></button>`).join('')}
    </details>`;
  }).join('')}`;

const ctrlHTML = (key, v) => {
  const c = CONTROLS[key];
  return `<div class="ctrl">
    <div class="ctrl-head"><label for="c-${key}">${c.name} <i class="sym" translate="no">${c.sym}</i></label>
      <output id="o-${key}" for="c-${key}" aria-live="off">${num(v)} <small>${c.unit}</small></output>
      <button class="mini" data-metric="${c.metric}" aria-label="${c.name} 정의 보기">정의</button></div>
    <input id="c-${key}" name="${key}" type="range" data-ctrl="${key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${v}">
  </div>`;
};

export function derivedHTML(mode, d) {
  return mode.calc.map(k => {
    const [name, sym, unit, formula, metric] = CALC[k];
    const val = k === 'cls' ? `${classify(d.cls)}` : `${num(d[k])}${unit ? ` <small>${unit}</small>` : ''}`;
    const sub = k === 'cls' ? `W = ${num(d.cls)} · B&L 2012 경계 1이면 ${d.cls < 1 ? '진동형' : '파동형'}` : formula;
    return `<button class="card" data-metric="${metric}"><span class="card-k">${name} <i class="sym" translate="no">${sym}</i></span><span class="card-v">${val}</span><span class="card-f">${sub}</span></button>`;
  }).join('');
}

function metricHTML(x, mode) {
  const using = mode.controls.includes(x.ctrl) || mode.calc.includes(x.calc);
  const where = MODES.filter(m => m.controls.includes(x.ctrl) || m.calc.includes(x.calc));
  const status = using ? `<p class="why">현재 방식(${mode.name})에서 ${mode.controls.includes(x.ctrl) ? '위 슬라이더로 조절' : '계산 지표로 표시'}하고 있습니다.</p>`
    : where.length ? `<p class="why">이 지표는 다음 방식에서 다룹니다: ${where.map(m => `<button class="mini" data-swim="${m.id}">${m.name}</button>`).join(' ')}</p>`
    : '<p class="why">참고 지표입니다. 시뮬레이션에는 반영하지 않습니다.</p>';
  return `<section id="metric" class="metric" tabindex="-1">
    <p class="crumb">${x.g} ${x.modes ? `· 쓰이는 방식: ${x.modes}` : ''}</p>
    <h3 class="mh">${x.name}</h3><p class="orig">${x.orig}</p>
    <p>${x.def}</p>
    ${x.site ? `<p class="note site">${x.site}</p>` : ''}
    ${status}
    ${x.src.length ? `<ul class="refs">${x.src.map(k => `<li><b>${k}</b> ${REFS[k] ?? ''}</li>`).join('')}</ul>` : ''}
    ${(x.conflict ?? []).map(conflictHTML).join('')}
  </section>`;
}

// s = 탭 상태 { mode, p, playing, speed, metric }, model = 현재 3D 모델 키, d = derive 결과
export function swimDetailHTML(s, model, d) {
  const mode = MODE[s.mode], x = METRIC[s.metric];
  return `
    <p class="crumb">2-0 유영 방식</p>
    <h2>${mode.name}</h2><p class="orig">${mode.orig}</p>
    <div class="badges"><span class="badge">${NAMES[model]} 모델</span><span class="badge basis">기본값 = 사이트 예시</span>${(mode.conflict ?? []).map(c => `<span class="badge warn">정의 차이 ${c}</span>`).join('')}</div>
    <h3>정의 · 논문</h3><p>${mode.def}</p>
    <p class="dim src">${mode.src.join(' · ')}</p>
    <div class="playbar">
      <div class="seg" role="group" aria-label="재생">
        <button data-act="play" aria-pressed="${s.playing}">${s.playing ? '일시정지' : '재생'}</button>
      </div>
      <div class="seg" role="group" aria-label="재생 속도">
        ${[0.25, 0.5, 1].map(v => `<button data-act="speed" data-speed="${v}" class="${s.speed === v ? 'on' : ''}" aria-pressed="${s.speed === v}">${v}×</button>`).join('')}
      </div>
      <button class="link" data-act="reset">기본값으로</button>
    </div>
    <h3>조절 파라미터</h3>
    <div class="ctrls">${mode.controls.map(k => ctrlHTML(k, s.p[k])).join('')}</div>
    <p class="note basis-note">${mode.basis}</p>
    <h3>계산 지표</h3>
    <div class="cards" id="derived" aria-live="off">${derivedHTML(mode, d)}</div>
    <p class="dim">노란 선은 지느러미 끝(축 기반은 꼬리 끝)이 물에 대해 그리는 궤적입니다. 한 물결의 길이가 보폭(U/f)입니다.</p>
    ${x ? metricHTML(x, mode) : ''}
    ${(mode.conflict ?? []).map(conflictHTML).join('')}`;
}

export { MODE, METRIC, num };
