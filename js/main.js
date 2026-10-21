import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { buildModel, V } from './models.js';
import { DRAW, tools, sectionSVG } from './viz.js';
import { GROUPS, PARAMS, REFS, CONFLICTS, FIGS } from './data.js';

const $ = s => document.querySelector(s);
const BY_ID = Object.fromEntries(PARAMS.map(p => [p.id, p]));
const ALL = ['manta', 'standard'];
const NAMES = { manta: '만타', standard: '표준 가오리' };
const DIRS = { top: [0, 1, 1e-4], bottom: [0, -1, -1e-4], side: [1, 0.15, 0], front: [0, 0.3, -1], iso: [1, 0.9, -1] };
const state = { model: 'manta', id: 'dw', v: 0, st: 0.5, skel: false };

// ── 장면
const box = $('#canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.localClippingEnabled = true;
const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
box.append(renderer.domElement, labels.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
camera.position.set(2.5, 2.5, -2.5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
scene.add(new THREE.HemisphereLight(0xc8f4ff, 0x06243a, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(2, 6, -3);
const under = new THREE.DirectionalLight(0x5fc8e8, 1.3);
under.position.set(-1, -4, 1);
const snow = new THREE.Points( // 바다 부유물
  new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1800 }, () => (Math.random() - 0.5) * 14), 3)),
  new THREE.PointsMaterial({ color: 0x9fdcec, size: 0.02, transparent: true, opacity: 0.45, depthWrite: false }));
scene.add(sun, under, snow);

const models = Object.fromEntries(ALL.map(k => [k, buildModel(k)]));
Object.values(models).forEach(m => scene.add(m.group));

const resize = () => {
  const { clientWidth: w, clientHeight: h } = box;
  renderer.setSize(w, h);
  labels.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
resize();
new ResizeObserver(resize).observe(box);

let fly = null;
renderer.setAnimationLoop(t => {
  if (fly) {
    const k = Math.min(1, (t - fly.t) / 700), e = 1 - (1 - k) ** 3;
    camera.position.lerpVectors(fly.p0, fly.p1, e);
    controls.target.lerpVectors(fly.c0, fly.c1, e);
    if (k === 1) fly = null;
  }
  snow.rotation.y = t * 0.00002;
  controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

function view(v) {
  const m = models[state.model];
  let s = typeof v === 'function' ? v(m, state.st, state.v) : v;
  if (typeof s === 'string') s = { dir: DIRS[s], at: V(0, 0, m.sp.center), dist: m.size * 1.6 / Math.min(1, camera.aspect) }; // 1.6 ≈ 1 / (2·tan(35°/2))
  const at = s.at.clone().add(m.group.position);
  fly = { t: performance.now(), p0: camera.position.clone(), c0: controls.target.clone(), c1: at,
    p1: at.clone().add(V(...s.dir).normalize().multiplyScalar(s.dist)) };
}

// ── 그리기
const avail = p => (p.models ?? ALL).includes(state.model);
function draw() {
  const p = BY_ID[state.id], d = DRAW[state.id], m = models[state.model];
  for (const x of Object.values(models)) {
    x.group.visible = x === m;
    for (const o of [...x.anno.children]) { x.anno.remove(o); o.traverse(c => c.geometry?.dispose()); } // 라벨 DOM은 'removed' 이벤트로 제거됨
    x.reset();
    x.setClip(null);
    x.setSkeleton(false);
  }
  m.setSkeleton(state.skel);
  const ok = avail(p);
  if (ok) {
    d.draw(tools(m), m, state.v, state.st);
    if (d.mode === 'section') m.setClip(state.st);
  }
  $('#note').hidden = ok;
  if (!ok) $('#note').innerHTML = `<p>${p.why}</p><button data-model="${p.models[0]}">${NAMES[p.models[0]]} 모델로 보기</button>`;
  $('#caption').textContent = m.sp.label;
  document.querySelectorAll('[data-model]').forEach(b => b.classList.toggle('on', b.dataset.model === state.model));
  $('#skel').classList.toggle('on', state.skel);
}

let toastTimer;
function toast(msg) {
  $('#toast').textContent = msg;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($('#toast').hidden = true), 3500);
}

function select(id) {
  const p = BY_ID[id];
  if (!p) return;
  Object.assign(state, { id, v: 0, skel: DRAW[id].mode === 'skeleton' });
  if (!avail(p)) { state.model = p.models[0]; toast(`${NAMES[state.model]} 모델로 전환했습니다`); }
  history.replaceState(null, '', '#' + id);
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  refresh();
}
function refresh() { draw(); renderDetail(); view(DRAW[state.id].view); }

// ── 설명 패널
function renderDetail() {
  const p = BY_ID[state.id], d = DRAW[state.id], vr = p.variants?.[state.v];
  const g = GROUPS.find(x => x[0] === p.g);
  $('#detail').innerHTML = `
    <p class="crumb">${p.g} ${g[1]}</p>
    <h2>${p.name}</h2>${p.orig ? `<p class="orig">${p.orig}</p>` : ''}
    <div class="badges">${(p.models ?? ALL).map(k => `<span class="badge">${NAMES[k]}</span>`).join('')}${(p.conflict ?? []).map(c => `<span class="badge warn">정의 차이 ${c}</span>`).join('')}</div>
    <h3>정의 · 논문</h3><p>${p.def}</p>
    ${vr ? `<div class="seg wrap">${p.variants.map((x, i) => `<button data-v="${i}" class="${i === state.v ? 'on' : ''}">${x.label}</button>`).join('')}</div>
      <p class="vtext">${vr.text}${vr.src ? ` <cite>${vr.src}</cite>` : ''}</p>` : ''}
    <h3>3D에서 보는 범위</h3><p>${p.show}</p>
    ${d.mode === 'section' ? `<label class="slider">단면 위치 <output id="sto">${Math.round(state.st * 100)}% 반스팬</output>
      <input id="st" type="range" min="0" max="0.95" step="0.01" value="${state.st}"></label><div id="svg">${sectionSVG(models[state.model], state.st, state.id)}</div>` : ''}
    ${p.fig ? FIGS[p.fig] : ''}
    ${p.why ? `<p class="why">${p.why}</p>` : ''}
    <h3>출처</h3><ul class="refs">${p.src.map(k => `<li><b>${k}</b> ${REFS[k]}</li>`).join('')}</ul>
    ${(p.conflict ?? []).map(c => `<h3>논문 간 정의 차이 ${c} · ${CONFLICTS[c].title}</h3><ul class="conf">${CONFLICTS[c].items.map(x => `<li>${x}</li>`).join('')}</ul>`).join('')}`;
}

// ── 파라미터 목록 (정의 모아보기)
$('#groups').innerHTML = GROUPS.map(([g, title]) => {
  const items = PARAMS.filter(p => p.g === g);
  return `<details open><summary><span class="gid">${g}</span>${title}<span class="cnt">${items.length}</span></summary>
    ${items.map(p => `<button class="item" data-id="${p.id}"><span class="nm">${p.name}${p.models ? '<i class="mk">표준 가오리</i>' : ''}${p.conflict ? '<i class="mk warn">정의 차이</i>' : ''}</span><span class="df">${p.def}</span></button>`).join('')}
  </details>`;
}).join('');

$('#q').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.item').forEach(b => {
    const p = BY_ID[b.dataset.id];
    b.hidden = !!q && !(p.name + p.orig + p.def).toLowerCase().includes(q);
  });
  document.querySelectorAll('#groups details').forEach(d => (d.hidden = !d.querySelector('.item:not([hidden])')));
});

// ── 이벤트
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.id) select(b.dataset.id);
  else if (b.dataset.model) { state.model = b.dataset.model; refresh(); }
  else if (b.dataset.v) { state.v = +b.dataset.v; refresh(); }
  else if (b.dataset.view) view(b.dataset.view);
  else if (b.id === 'skel') { state.skel = !state.skel; draw(); }
  else if (b.id === 'lbl') b.classList.toggle('on', !(labels.domElement.hidden = !labels.domElement.hidden));
});
$('#detail').addEventListener('input', e => {
  if (e.target.id !== 'st') return;
  state.st = +e.target.value;
  $('#sto').textContent = `${Math.round(state.st * 100)}% 반스팬`;
  $('#svg').innerHTML = sectionSVG(models[state.model], state.st, state.id);
  draw();
});
$('#detail').addEventListener('change', e => e.target.id === 'st' && view(DRAW[state.id].view));

select(location.hash.slice(1) in BY_ID ? location.hash.slice(1) : 'dw');
