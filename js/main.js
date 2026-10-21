import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { buildModel, V } from './models.js';
import { DRAW, tools, sectionSVG } from './viz.js';
import { PARAMS } from './data.js';
import { NAMES, ALL, listHTML, detailHTML, symbolsHTML } from './panel.js';

const $ = s => document.querySelector(s);
const BY_ID = Object.fromEntries(PARAMS.map(p => [p.id, p]));
const DIRS = { top: [0, 1, 1e-4], bottom: [0, -1, -1e-4], side: [1, 0.15, 0], front: [0, 0.3, -1], iso: [1, 0.9, -1] };
const state = { model: 'manta', id: 'dw', v: 0, st: 0.5, skel: false };
const calm = matchMedia('(prefers-reduced-motion: reduce)');
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

const resize = () => {
  const { clientWidth: w, clientHeight: h } = box;
  renderer.setSize(w, h);
  labels.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
resize();
new ResizeObserver(resize).observe(box);

renderer.setAnimationLoop(t => {
  if (fly) { // 화면 안에서 움직이는 이동이라 ease-in-out
    const k = calm.matches ? 1 : Math.min(1, (t - fly.t) / 600), e = k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2;
    camera.position.lerpVectors(fly.p0, fly.p1, e);
    controls.target.lerpVectors(fly.c0, fly.c1, e);
    if (k === 1) fly = null;
  }
  if (!calm.matches) snow.rotation.y = t * 0.00002;
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
  document.querySelectorAll('.seg [data-model]').forEach(b => {
    b.classList.toggle('on', b.dataset.model === state.model);
    b.setAttribute('aria-pressed', b.dataset.model === state.model);
  });
  $('#skel').classList.toggle('on', state.skel);
  $('#skel').setAttribute('aria-pressed', state.skel);
}

let toastTimer;
function toast(msg) {
  $('#toast').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500);
}

function select(id, v = 0) {
  const p = BY_ID[id];
  if (!p) return;
  Object.assign(state, { id, v: p.variants?.[v] ? v : 0, skel: DRAW[id].mode === 'skeleton' });
  if (!avail(p)) { state.model = p.models[0]; toast(`${NAMES[state.model]} 모델로 전환했습니다`); }
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  const first = !$('#detail').childElementCount;
  refresh();
  $('#detail').scrollTop = 0;
  // 내용 교체는 자주 일어나므로 위치 이동 없이 짧은 페이드만, 첫 로드는 생략
  if (!first && !calm.matches) $('#detail').animate({ opacity: [0, 1] }, { duration: 160, easing: 'cubic-bezier(.23, 1, .32, 1)' });
  if (matchMedia('(min-width: 961px)').matches) document.querySelector('.item.on')?.scrollIntoView({ block: 'nearest' }); // 목록이 자체 스크롤일 때만
}
function refresh() {
  draw(); renderDetail(); view(DRAW[state.id].view);
  // 공유 링크가 같은 화면을 열도록: #파라미터[/모델][/v정의번호]
  history.replaceState(null, '', '#' + [state.id, state.model !== 'manta' && state.model, state.v && 'v' + state.v].filter(Boolean).join('/'));
}

// ── 설명 패널
function renderDetail() {
  const p = BY_ID[state.id];
  $('#detail').innerHTML = detailHTML(p, DRAW[state.id], state, models[state.model]);
}

// ── 파라미터 목록 (정의 모아보기)
$('#groups').innerHTML = listHTML();
$('#symbols-body').innerHTML = symbolsHTML();

$('#q').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.item').forEach(b => {
    const p = BY_ID[b.dataset.id];
    b.hidden = !!q && !(p.name + p.orig + p.sym + p.def + (p.std ?? '')).toLowerCase().includes(q);
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
  else if (b.id === 'sym') $('#symbols').showModal();
  else if (b.id === 'skel') { state.skel = !state.skel; draw(); }
  else if (b.id === 'lbl') {
    const on = !(labels.domElement.hidden = !labels.domElement.hidden);
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on);
  }
});
$('#detail').addEventListener('input', e => {
  if (e.target.id !== 'st') return;
  state.st = +e.target.value;
  $('#sto').textContent = `${Math.round(state.st * 100)}% 반스팬`;
  $('#svg').innerHTML = sectionSVG(models[state.model], state.st, state.id);
  draw();
});
$('#symbols').addEventListener('click', e => { // 대화상자 바깥(배경) 클릭으로 닫기
  const r = e.currentTarget.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close();
});
$('#detail').addEventListener('change', e => e.target.id === 'st' && view(DRAW[state.id].view));

const [hid, ...opt] = location.hash.slice(1).split('/');
if (opt.includes('standard')) state.model = 'standard';
select(hid in BY_ID ? hid : 'dw', +(opt.find(x => /^v\d+$/.test(x)) ?? 'v0').slice(1));
