import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { buildModel, V } from './models.js';
import { DRAW, tools, sectionSVG } from './viz.js';
import { PARAMS } from './data.js';
import { NAMES, ALL, listHTML, detailHTML, symbolsHTML } from './panel.js';
import { CONTROLS, MODES } from './swim-data.js';
import { swimListHTML, swimDetailHTML, derivedHTML, MODE, METRIC, num } from './swim-panel.js';
import { createSwim, derive } from './swim.js';

const $ = s => document.querySelector(s);
const BY_ID = Object.fromEntries(PARAMS.map(p => [p.id, p]));
const DIRS = { top: [0, 1, 1e-4], bottom: [0, -1, -1e-4], side: [1, 0.15, 0], front: [0, 0.3, -1], iso: [1, 0.9, -1] };
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const state = { tab: 'body', model: 'manta', id: 'dw', v: 0, st: 0.5, skel: false };
// 유영 탭: 슬라이더 값 p는 방식을 고를 때 기본값으로 채움 (움직임 줄이기 설정이면 멈춘 채 시작)
const BASE = { U: 1, f: 0, a: 0, W: 0, har: 1, lag: 0, down: 0.5, bank: 0, ratio: 1, R: 1, dihedral: 0, fTail: 0, aTail: 0, Tp: 1, duty: 50, dPunt: 0, d: 1, L: 30 };
const swimState = { mode: 'oscillatory', p: {}, playing: !calm.matches, speed: 1, metric: null, time: 0 };
let fly = null; // 카메라 이동 상태

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
controls.addEventListener('start', () => (fly = null)); // 사용자가 잡으면 카메라 이동을 즉시 멈춤
scene.add(new THREE.HemisphereLight(0xc8f4ff, 0x06243a, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(2, 6, -3);
const under = new THREE.DirectionalLight(0x5fc8e8, 1.3);
under.position.set(-1, -4, 1);
const snow = new THREE.Points( // 바다 부유물
  new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1800 }, () => (Math.random() - 0.5) * 14), 3)),
  new THREE.PointsMaterial({ color: 0x9fdcec, size: 0.02, transparent: true, opacity: 0.45, depthWrite: false, map: dotTexture() }));
scene.add(sun, under, snow);

function dotTexture() { // 부유 입자를 네모 대신 부드러운 원으로
  const c = Object.assign(document.createElement('canvas'), { width: 32, height: 32 }), g = c.getContext('2d');
  const r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, '#fff'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

const models = Object.fromEntries(ALL.map(k => [k, buildModel(k)]));
Object.values(models).forEach(m => scene.add(m.group));
const swim = createSwim(scene, snow);

const resize = () => {
  const { clientWidth: w, clientHeight: h } = box;
  renderer.setSize(w, h);
  labels.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
resize();
new ResizeObserver(resize).observe(box);

let last = 0;
renderer.setAnimationLoop(t => {
  const dt = Math.min(0.05, (t - (last || t)) / 1000);
  last = t;
  if (fly) { // 화면 안에서 움직이는 이동이라 ease-in-out
    const k = calm.matches ? 1 : Math.min(1, (t - fly.t) / 600), e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
    camera.position.lerpVectors(fly.p0, fly.p1, e);
    controls.target.lerpVectors(fly.c0, fly.c1, e);
    if (k === 1) fly = null;
  }
  if (state.tab === 'swim') {
    const sdt = swimState.playing ? dt * swimState.speed : 0;
    swimState.time += sdt;
    swim.update(models[state.model], MODE[swimState.mode], swimState.p, swimState.time, sdt);
  } else if (!calm.matches) snow.rotation.y = t * 0.00002;
  controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

// world = true면 at을 장면 좌표로 그대로 씀
function view(v, world) {
  const m = models[state.model];
  let s = typeof v === 'function' ? v(m, state.st, state.v) : v;
  if (typeof s === 'string') s = { dir: DIRS[s], at: V(0, 0, m.sp.center), dist: m.size * 1.6 / Math.min(1, camera.aspect) }; // 1.6 ≈ 1 / (2·tan(35°/2))
  const at = world ? s.at.clone() : s.at.clone().add(V(0, 0, -m.sp.center));
  fly = { t: performance.now(), p0: camera.position.clone(), c0: controls.target.clone(), c1: at,
    p1: at.clone().add(V(...s.dir).normalize().multiplyScalar(s.dist)) };
}
function swimView() {
  const m = models[state.model], p = swimState.p;
  if (swimState.mode !== 'turning') return view({ dir: [1, 0.45, -0.75], at: V(0, 0, m.sp.center), dist: m.size * 1.45 / Math.min(1, camera.aspect) }); // 위아래 움직임이 잘 보이게 옆쪽 낮게
  const R = p.R * m.lm.pelvicPost.z; // 선회 원 전체가 보이도록 원의 중심을 위에서 비스듬히
  view({ dir: [0.3, 1, 0.7], at: V(-R, 0, 0), dist: (2 * R + m.size) * 1.4 / Math.min(1, camera.aspect) }, true);
}

// ── 그리기
const avail = p => (p.models ?? ALL).includes(state.model);
function syncChrome() {
  const m = models[state.model];
  $('#caption').textContent = m.sp.label;
  document.querySelectorAll('.seg [data-model]').forEach(b => {
    b.classList.toggle('on', b.dataset.model === state.model);
    b.setAttribute('aria-pressed', b.dataset.model === state.model);
  });
  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('on', b.dataset.tab === state.tab);
    b.setAttribute('aria-pressed', b.dataset.tab === state.tab);
  });
  $('#skel').classList.toggle('on', state.skel);
  $('#skel').setAttribute('aria-pressed', state.skel);
  $('#skel').hidden = state.tab === 'swim';
}
function draw() {
  const m = models[state.model], swimming = state.tab === 'swim';
  for (const x of Object.values(models)) {
    x.group.visible = x === m;
    for (const o of [...x.anno.children]) { x.anno.remove(o); o.traverse(c => c.geometry?.dispose()); } // 라벨 DOM은 'removed' 이벤트로 제거됨
    x.reset();
    x.setClip(null);
    x.setSkeleton(false);
    if (x !== m || !swimming) swim.exit(x);
  }
  syncChrome();
  if (swimming) {
    $('#note').hidden = true;
    return swim.enter(m);
  }
  const p = BY_ID[state.id], d = DRAW[state.id], ok = avail(p);
  m.setSkeleton(state.skel);
  if (ok) {
    d.draw(tools(m), m, state.v, state.st);
    if (d.mode === 'section') m.setClip(state.st);
  }
  $('#note').hidden = ok;
  if (!ok) $('#note').innerHTML = `<p>${p.why}</p><button data-model="${p.models[0]}">${NAMES[p.models[0]]} 모델로 보기</button>`;
}

let toastTimer;
function toast(msg) {
  $('#toast').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
}

// 내용 교체는 자주 일어나므로 위치 이동 없이 짧은 페이드만
const fade = () => !calm.matches && $('#detail').animate({ opacity: [0, 1] }, { duration: 160, easing: 'cubic-bezier(.23, 1, .32, 1)' });
const markList = (key, val) => {
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset[key] === val));
  if (matchMedia('(min-width: 961px)').matches) document.querySelector('.item.on')?.scrollIntoView({ block: 'nearest' }); // 목록이 자체 스크롤일 때만
};
const writeHash = () => history.replaceState(null, '', '#' + (state.tab === 'swim'
  ? ['swim', swimState.mode, swimState.metric].filter(Boolean).join('/')
  : [state.id, state.model !== 'manta' && state.model, state.v && 'v' + state.v].filter(Boolean).join('/')));

// ── 신체 특징 탭
function select(id, v = 0) {
  const p = BY_ID[id];
  if (!p) return;
  Object.assign(state, { id, v: p.variants?.[v] ? v : 0, skel: DRAW[id].mode === 'skeleton' });
  if (!avail(p)) { state.model = p.models[0]; toast(`${NAMES[state.model]} 모델로 전환했습니다`); }
  const first = !$('#detail').childElementCount;
  refresh();
  markList('id', id);
  $('#detail').scrollTop = 0;
  if (!first) fade();
}
function refresh() {
  draw();
  if (state.tab === 'swim') { renderSwim(); swimView(); }
  else { $('#detail').innerHTML = detailHTML(BY_ID[state.id], DRAW[state.id], state, models[state.model]); view(DRAW[state.id].view); }
  writeHash();
}

// ── 유영 지표 탭
const swimDerived = () => derive(swimState.p, models[state.model], swimState.mode);
function renderSwim() { $('#detail').innerHTML = swimDetailHTML(swimState, state.model, swimDerived()); }
function selectMode(id, metric = null) {
  const mode = MODE[id];
  if (!mode) return;
  Object.assign(swimState, { mode: id, p: { ...BASE, ...mode.defaults }, metric, time: 0 });
  state.model = mode.model; // 방식마다 맞는 모델로 (펀팅은 표준 가오리만)
  refresh();
  markList('swim', id);
  $('#detail').scrollTop = 0;
  fade();
}
function showMetric(id) {
  if (!METRIC[id]) return;
  swimState.metric = id;
  renderSwim();
  writeHash();
  markList('metric', id);
  $('#metric')?.scrollIntoView({ block: 'start', behavior: calm.matches ? 'auto' : 'smooth' });
  $('#metric')?.focus({ preventScroll: true });
}

function setTab(tab) {
  if (state.tab === tab) return;
  state.tab = tab;
  $('#q').value = '';
  $('#groups').innerHTML = tab === 'swim' ? swimListHTML() : listHTML();
  if (tab === 'swim') selectMode(swimState.mode);
  else select(state.id, state.v);
}

// ── 목록과 검색
$('#groups').innerHTML = listHTML();
$('#symbols-body').innerHTML = symbolsHTML();
$('#q').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.item').forEach(b => (b.hidden = !!q && !b.textContent.toLowerCase().includes(q)));
  document.querySelectorAll('#groups details').forEach(d => (d.hidden = !d.querySelector('.item:not([hidden])')));
});

// ── 이벤트
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.id) select(d.id);
  else if (d.tab) setTab(d.tab);
  else if (d.swim) selectMode(d.swim, b.closest('#metric') ? swimState.metric : null); // 지표 상세에서 바꾸면 보던 지표 유지
  else if (d.metric) showMetric(d.metric);
  else if (d.model) {
    const mode = MODE[swimState.mode];
    if (state.tab === 'swim' && mode.models && !mode.models.includes(d.model)) return toast(`${mode.name}은 ${NAMES[mode.models[0]]} 모델에서만 볼 수 있습니다`);
    state.model = d.model;
    refresh();
  }
  else if (d.v) { state.v = +d.v; refresh(); }
  else if (d.view) view(d.view, state.tab === 'swim');
  else if (d.act === 'play') { swimState.playing = !swimState.playing; b.textContent = swimState.playing ? '일시정지' : '재생'; b.setAttribute('aria-pressed', swimState.playing); }
  else if (d.act === 'speed') { swimState.speed = +d.speed; renderSwim(); }
  else if (d.act === 'reset') { swimState.p = { ...BASE, ...MODE[swimState.mode].defaults }; renderSwim(); swimView(); }
  else if (b.id === 'sym') $('#symbols').showModal();
  else if (b.id === 'skel') { state.skel = !state.skel; draw(); }
  else if (b.id === 'lbl') {
    const on = !(labels.domElement.hidden = !labels.domElement.hidden);
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  }
});
$('#detail').addEventListener('input', e => {
  const key = e.target.dataset.ctrl;
  if (key) { // 슬라이더: 값·계산 지표만 바꾸고 패널은 다시 그리지 않음(포커스 유지)
    swimState.p[key] = +e.target.value;
    $(`#o-${key}`).innerHTML = `${num(swimState.p[key])} <small>${CONTROLS[key].unit}</small>`;
    $('#derived').innerHTML = derivedHTML(MODE[swimState.mode], swimDerived());
    return;
  }
  if (e.target.id !== 'st') return;
  state.st = +e.target.value;
  $('#sto').textContent = `${Math.round(state.st * 100)}% 반스팬`;
  $('#svg').innerHTML = sectionSVG(models[state.model], state.st, state.id);
  draw();
});
$('#detail').addEventListener('change', e => {
  if (e.target.id === 'st') view(DRAW[state.id].view);
  if (e.target.dataset.ctrl === 'R') swimView();
});
$('#symbols').addEventListener('click', e => { // 대화상자 바깥(배경) 클릭으로 닫기
  const r = e.currentTarget.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close();
});

// ── 시작: #파라미터[/모델][/v정의] 또는 #swim/방식[/지표]
const [hid, ...opt] = location.hash.slice(1).split('/');
if (hid === 'swim') {
  state.tab = 'swim';
  $('#groups').innerHTML = swimListHTML();
  selectMode(MODES.some(m => m.id === opt[0]) ? opt[0] : swimState.mode);
  if (METRIC[opt[1]]) showMetric(opt[1]);
} else {
  if (opt.includes('standard')) state.model = 'standard';
  select(hid in BY_ID ? hid : 'dw', +(opt.find(x => /^v\d+$/.test(x)) ?? 'v0').slice(1));
}
