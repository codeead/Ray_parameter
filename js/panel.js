// 왼쪽 목록·오른쪽 설명·기호표를 HTML 문자열로 만든다 (화면 조작은 main.js).
import { GROUPS, PARAMS } from './data.js';
import { REFS, CONFLICTS } from './refs.js';
import { EV } from './evidence.js';
import { FIGS } from './figs.js';
import { KINDS, BASIS, KIND_TABLE, UNIT_RULE, SYMBOLS } from './symbols.js';
import { sectionSVG } from './viz.js';

export const NAMES = { manta: '만타', standard: '표준 가오리' };
export const ALL = Object.keys(NAMES);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const list = x => (Array.isArray(x) ? x : [x]);
const sym = p => (p.sym && p.sym !== '—' ? p.sym : '');

export const listHTML = () => GROUPS.map(([g, title]) => {
  const items = PARAMS.filter(p => p.g === g);
  return `<details open><summary><span class="gid">${g}</span>${title}<span class="cnt">${items.length}</span></summary>
    ${items.map(p => `<button class="item" data-id="${p.id}"><span class="nm">${p.name}${sym(p) ? `<i class="sym">${esc(sym(p))}</i>` : ''}${p.models ? '<i class="mk">표준 가오리</i>' : ''}${p.conflict ? '<i class="mk warn">정의 차이</i>' : ''}</span><span class="df">${p.std ?? p.def}</span></button>`).join('')}
  </details>`;
}).join('');

const row = (k, v) => (v ? `<dt>${k}</dt><dd>${v}</dd>` : '');

const conflictHTML = c => {
  const { title, items, verdict: v } = CONFLICTS[c];
  return `<h3>논문 간 정의 차이 ${c} · ${title}</h3><ul class="conf">${items.map(x => `<li>${x}</li>`).join('')}</ul>
    <div class="verdict"><b>판단 (확신도 ${v.level})</b><p>${v.head}</p><ul>${v.points.map(x => `<li>${x}</li>`).join('')}</ul>
    <small>★ = 논문에 적힌 내용이 아니라 조정안 작성자의 계산·추론</small></div>`;
};

const evidenceHTML = id => (EV[id] ? `<h3>근거 상세 · 원문 위치와 설명</h3><div class="ev">${EV[id].map(([paper, loc, text]) =>
  `<div><b>${paper}</b><span class="loc">${loc}</span><p>${text}</p></div>`).join('')}</div>` : '');

// st = 단면 위치, model = 현재 3D 모델, v = 선택한 정의 번호
export function detailHTML(p, d, { v, st }, model) {
  const g = GROUPS.find(x => x[0] === p.g), vr = p.variants?.[v];
  const badges = [
    ...(p.models ?? ALL).map(k => `<span class="badge">${NAMES[k]}</span>`),
    `<span class="badge kind">${KINDS[p.kind]}</span>`,
    ...list(p.basis).map(b => `<span class="badge basis" title="근거의 종류">${BASIS[b]}</span>`),
    ...(p.conflict ?? []).map(c => `<span class="badge warn">정의 차이 ${c}</span>`),
  ].join('');
  const symOrig = p.symOrig?.length ? p.symOrig.map(x => (x.src ? `${esc(x.sym)} <cite>(${x.src})</cite>` : esc(x.sym))).join(' · ') : '';
  return `
    <p class="crumb">${p.g} ${g[1]}</p>
    <h2>${p.name}${sym(p) ? `<span class="symbig">${esc(sym(p))}</span>` : ''}</h2>${p.orig ? `<p class="orig">${p.orig}</p>` : ''}
    <div class="badges">${badges}</div>
    <h3>${p.std ? '사이트 정의' : '정의 · 논문'}</h3><p>${p.std ?? p.def}</p>
    ${p.std ? `<h3>논문 정의 (원문)</h3><p class="dim">${p.def}</p>` : ''}
    ${vr ? `<div class="seg wrap">${p.variants.map((x, i) => `<button data-v="${i}" class="${i === v ? 'on' : ''}">${x.label}</button>`).join('')}</div>
      <p class="vtext">${vr.text}${vr.src ? ` <cite>${vr.src}</cite>` : ''}</p>` : ''}
    <h3>기호 · 단위</h3>
    <dl class="units">${row('원문 기호', symOrig)}${row(p.kind === 'cat' || p.kind === 'count' ? '표기' : '절대 단위', p.unitAbs)}${row('정규화 · 기준', p.unitNorm)}</dl>
    ${p.note ? `<h3>바꾼 점 · 근거 메모</h3><p class="note">${p.note}</p>` : ''}
    <h3>3D에서 보는 범위</h3><p>${p.show}</p>
    ${d.mode === 'section' ? `<label class="slider">단면 위치 y/b <output id="sto">${Math.round(st * 100)}% 반스팬</output>
      <input id="st" type="range" min="0" max="0.95" step="0.01" value="${st}"></label><div id="svg">${sectionSVG(model, st, p.id)}</div>` : ''}
    ${p.fig ? FIGS[p.fig] : ''}
    ${p.why ? `<p class="why">${p.why}</p>` : ''}
    ${evidenceHTML(p.id)}
    <h3>출처</h3><ul class="refs">${p.src.map(k => `<li><b>${k}</b> ${REFS[k]}</li>`).join('')}</ul>
    ${(p.conflict ?? []).map(conflictHTML).join('')}`;
}

export const symbolsHTML = () => `
  <h2>기호표 · 단위 규칙</h2>
  <p class="dim">한 기호는 한 뜻만 갖습니다. A는 2장 유영 지표의 진폭에 쓰도록 비워 둡니다. 원문 기호는 따로 적습니다.</p>
  <h3>단위 표기: 네 종류</h3>
  <p>절대값은 몸 크기에 따라 커지고, 정규화값은 크기 효과를 지우는 대신 기준 길이를 무엇으로 잡느냐에 따라 달라집니다. 그래서 카드에는 두 칸을 따로 두고, 정규화값 옆에는 항상 기준 기호를 붙입니다.</p>
  <table><thead><tr><th>종류</th><th>무엇인가</th><th>표기 예</th><th>언제 쓰나</th></tr></thead>
  <tbody>${KIND_TABLE.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
  <p class="note">${UNIT_RULE}</p>
  <h3>근거의 종류 (카드의 파란 배지)</h3>
  <p>${Object.values(BASIS).join(' · ')}</p>
  <h3>기호표</h3>
  <table><thead><tr><th>기호</th><th>뜻</th><th>원문 기호</th><th>메모</th></tr></thead>
  <tbody>${SYMBOLS.map(r => `<tr>${r.map((c, i) => `<td${i ? '' : ' class="s"'}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
