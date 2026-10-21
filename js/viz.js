import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { V, poly } from './models.js';

// 노랑 = 주 측정 대상, 산호 = 보조·비교, 민트 = 기준선·참고
export const COL = { a: 0xffd166, b: 0xff8c7a, c: 0x7ff5d0, gray: 0x9db4c0 };
const HL = new THREE.Color(0x2fd3e8), SOFT = new THREE.Color(0x1d6f8c);
const STIFF = new THREE.Color(0x0a3d6b), FLEX = new THREE.Color(0xa8f7ff);

// 주석 도구: 모두 m.anno에 추가하고 몸통에 가려지지 않게 depthTest를 끈다
export function tools(m) {
  const root = m.anno, R = m.size * 0.0026;
  const mat = (color, opacity = 0.95) => new THREE.MeshBasicMaterial({ color, opacity, transparent: true, depthTest: false, side: THREE.DoubleSide });
  const add = o => { o.traverse(c => { c.renderOrder = 10; }); root.add(o); return o; };
  const t = {
    R,
    tube: (pts, color = COL.a, r = R) => add(new THREE.Mesh(new THREE.TubeGeometry(poly(pts), pts.length * 4, r, 6), mat(color))),
    mesh: (tris, color, opacity) => add(new THREE.Mesh(new THREE.BufferGeometry().setFromPoints(tris), mat(color, opacity))),
    dot(p, color = COL.a, r = R * 2.6) { add(new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mat(color))).position.copy(p); },
    label(p, text, color = COL.a) {
      const el = document.createElement('div');
      el.className = 'tag';
      el.textContent = text;
      el.style.borderColor = '#' + new THREE.Color(color).getHexString();
      const o = new CSS2DObject(el);
      o.position.copy(p);
      o.center.set(0.5, 1.3);
      root.add(o);
    },
    pin(p, text, color = COL.c) { t.dot(p, color); t.label(p, text, color); },
    dim(a, b, text, color = COL.a, lift = m.lift, at = 0.5) { // 치수선: 들어 올린 선 + 보조선, at = 라벨 위치
      const A = up(a, lift), B = up(b, lift);
      t.tube([a, A], color, R * 0.45); t.tube([b, B], color, R * 0.45); t.tube([A, B], color);
      t.dot(A, color, R * 1.8); t.dot(B, color, R * 1.8);
      t.label(A.clone().lerp(B, at), text, color);
    },
    cone(p, dir, color = COL.a) {
      const o = add(new THREE.Mesh(new THREE.ConeGeometry(R * 4, R * 11, 10), mat(color)));
      o.position.copy(p);
      o.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().normalize());
    },
    arrow(from, dir, len, color, text) {
      const a = new THREE.ArrowHelper(dir, from, len, color, len * 0.22, len * 0.1);
      a.traverse(o => o.material && Object.assign(o.material, { depthTest: false, transparent: true }));
      add(a);
      t.label(from.clone().addScaledVector(dir, len), text, color);
    },
    box(center, size, color) {
      const o = add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
        new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true })));
      o.position.copy(center);
    },
  };
  return t;
}

const up = (p, h) => p.clone().add(V(0, h, 0));
const topLine = (m, x, z0, z1) => [...Array(20)].map((_, i) => up(m.fn.onSurf(V(x, 0, z0 + (z1 - z0) * i / 19), m.fn.F.top), 0.003));
const finMid = (m, s) => up(V(s, 0, (m.fn.L(s) + m.fn.te(s)) / 2), 0.02);
const midRadial = m => m.radials[m.N >> 1]; // 오른쪽 중앙 지느러미살
const kite = m => { // Chaumel 추정 면적: DW와 기부 길이를 대각선으로 하는 마름모
  const { tipL, tipR, finO, finI } = m.lm;
  return [tipL, V(0, 0, finO.z), tipR, V(0, 0, finI.z)].map(p => up(p, m.lift * 0.4));
};
const whole = (t, m, text) => {
  m.paint(() => HL);
  m.tint(['tail', 'pelvic', 'ceph', 'dorsal'], HL);
  t.label(up(m.lm.com, m.lift * 0.5), text, COL.c);
};
const fin = (t, m, color = COL.a) => {
  const r = midRadial(m);
  t.tube(r.pts, color);
  r.fork.forEach(f => t.tube([r.pts[20], f], color, t.R * 0.7));
  return r;
};
const pelvicPro = (t, m, text) => {
  m.paths.pelvicPro.forEach(p => t.tube(p, COL.a, t.R * 1.6));
  t.label(m.paths.pelvicPro[0].at(-1), text);
};

// 점 p에서 방향 n인 직선이 닫힌 다각형(xz 평면)과 만나는 매개변수 범위
function span(pts, p, n) {
  const ts = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], ex = b.x - a.x, ez = b.z - a.z, den = n.x * ez - n.z * ex;
    if (Math.abs(den) < 1e-9) return;
    const u = ((a.x - p.x) * n.z - (a.z - p.z) * n.x) / den;
    if (u >= 0 && u <= 1) ts.push(((a.x - p.x) * ez - (a.z - p.z) * ex) / den);
  });
  return ts.length ? [Math.min(...ts), Math.max(...ts)] : [0, 0];
}
function maxPerpChord(m) { // 중앙 지느러미살에 수직인 최대 코드 (R&W 1999)
  const r = midRadial(m), a = r.pts[0], b = r.pts[20];
  const d = V(b.x - a.x, 0, b.z - a.z).normalize(), n = V(-d.z, 0, d.x);
  let best = [0, 0, a];
  for (let i = 1; i <= 12; i++) {
    const p = a.clone().lerp(b, i / 20).setY(0), [t0, t1] = span(m.finEdge, p, n);
    if (t1 - t0 > best[1] - best[0]) best = [t0, t1, p];
  }
  return [best[2].clone().addScaledVector(n, best[0]), best[2].clone().addScaledVector(n, best[1])];
}

function section(t, m, s, keys) { // keys: C 코드, T 두께, S 최대 두께 위치, M 캠버
  const P = m.profile(s), { F } = m.fn, R = t.R * 0.5;
  t.mesh(P.top.flatMap((p, i) => i ? [P.top[i - 1], P.bot[i - 1], p, p, P.bot[i - 1], P.bot[i]] : []), 0x1d6f8c, 0.9);
  t.tube([...P.top, ...P.bot.slice(0, -1).reverse()], COL.c, R * 0.5);
  const le = P.top[0], te = P.top.at(-1), zT = P.le + P.cT * P.C, h = P.T / 2, o = -P.T * 1.3;
  const toT = () => { const a = up(le, o), b = V(s, o, zT); t.tube([a, b], COL.c, R * 0.6); return a.lerp(b, 0.5); };
  if (keys.includes('C')) { t.tube([le, te], COL.a, R * 0.7); t.label(up(le.clone().lerp(te, 0.75), P.T * 0.2), 'c', COL.a); }
  if (keys.includes('T')) { t.tube([V(s, F.top * h, zT), V(s, F.bot * h, zT)], COL.b, R); t.label(V(s, F.top * h, zT), 't', COL.b); }
  if (keys.includes('S')) t.label(toT(), 'x_t', COL.c);
  if (keys.includes('M')) {
    t.tube(P.mid, COL.b, R * 0.6);
    t.tube([V(s, 0, zT), V(s, F.mid * h, zT)], COL.c, R);
    t.label(V(s, F.mid * h, zT), 'z_c', COL.b);
    t.label(toT(), 'x_c', COL.c);
  }
}

// 단면 2D 그림(두께 3배 과장)과 이 모델 단면의 값
export function sectionSVG(m, s, id) {
  const P = m.profile(s, 80), k = m.fn.F.mid, W = 300, x0 = 20, y0 = 72, sc = W / P.C, ex = 3;
  const X = z => (x0 + (z - P.le) * sc).toFixed(1), Y = y => (y0 - y * sc * ex).toFixed(1);
  const pl = pts => pts.map(p => `${X(p.z)},${Y(p.y)}`).join(' ');
  const zT = P.le + P.cT * P.C, h = P.T / 2, xT = X(zT);
  const on = { tmax: 'T', tr: 'TC', sp: 'TCS', camber: 'CM' }[id];
  return `<svg viewBox="0 0 340 130" class="fig">
    <polygon points="${pl(P.top)} ${pl(P.bot.slice().reverse())}" class="ln fs"/>
    ${on.includes('C') ? `<line x1="${x0}" y1="${y0}" x2="${x0 + W}" y2="${y0}" class="ln2"/><text x="${x0 + W - 4}" y="${y0 - 5}" class="tx r">c</text>` : ''}
    ${on.includes('T') ? `<line x1="${xT}" y1="${Y((1 + k) * h)}" x2="${xT}" y2="${Y(-(1 - k) * h)}" class="lb"/><text x="${+xT + 6}" y="${+Y((1 + k) * h) - 4}" class="tx l">t</text>` : ''}
    ${on.includes('S') ? `<line x1="${x0}" y1="108" x2="${xT}" y2="108" class="lc"/><text x="${(x0 + +xT) / 2}" y="122" class="tx">x_t</text>` : ''}
    ${on.includes('M') ? `<polyline points="${pl(P.mid)}" class="lb"/><line x1="${xT}" y1="${y0}" x2="${xT}" y2="${Y(k * h)}" class="lc"/><text x="${+xT + 6}" y="${+Y(k * h) - 4}" class="tx l">z_c</text><line x1="${x0}" y1="108" x2="${xT}" y2="108" class="lc"/><text x="${(x0 + +xT) / 2}" y="122" class="tx">x_c</text>` : ''}
  </svg>
  <p class="figcap">이 모델 단면(y/b = ${s.toFixed(2)}): t/c ${(P.T / P.C).toFixed(3)} · x_t/c ${P.cT.toFixed(2)} · z_c/c ${(k * h / P.C).toFixed(3)} — 두께 3배 과장, 예시 형상이라 실측값이 아닙니다.</p>`;
}

const DIR_TOP = [0, 1, 1e-4], DIR_BOTTOM = [0, -1, -1e-4];
const focus = (dir, at, k) => m => ({ dir, at: at(m), dist: m.size * k });
// 안쪽(몸 중심)에서 바깥 날개의 잘린 면을 봄 → 화면 왼쪽이 앞전
const secView = (m, s) => ({ dir: [-1, 0.35, 0.25], at: V(s, 0, m.fn.L(s) + m.fn.chord(s) / 2), dist: Math.max(0.5, m.fn.chord(s) * 2.6) });
const sideOf = (m, at, k) => { const r = midRadial(m), d = r.pts[20].clone().sub(r.pts[0]); return { dir: [-d.z, 0.2, d.x], at, dist: m.size * k }; };
const pelvicView = dir => focus(dir, m => m.lm.pelvic, 0.5);
const SK = 'skeleton', SEC = 'section';

// 파라미터별: view(카메라), mode(골격/단면), draw(t 도구, m 모델, v 정의 번호, s 단면 위치)
export const DRAW = {
  dw: { view: 'top', draw: (t, m) => t.dim(m.lm.tipL, m.lm.tipR, 'DW · 체반 폭') },
  semispan: { view: 'top', draw(t, m) {
    t.dim(V(0, 0, m.lm.tipR.z), m.lm.tipR, 'b · 반스팬');
    [0, 0.25, 0.5, 0.75].forEach(s => { const l = topLine(m, s, m.fn.L(s), m.fn.te(s)); t.tube(l, COL.c, t.R * 0.6); t.label(l[0], `${s * 100}%`, COL.c); });
    t.label(m.lm.tipR, '100%', COL.c);
  } },
  dl: { view: 'top', draw(t, m, v) {
    const { snout, pelvicPost, discPost, tailBase } = m.lm;
    const [end, name, sym] = [[pelvicPost, '배지느러미 뒷끝', 'DL_pel'], [discPost, '가슴지느러미 뒷끝(체반 뒷가장자리)', 'DL_pec'], [tailBase, '꼬리 기부', 'DL_tb']][v];
    t.dim(snout, end, sym);
    t.pin(snout, '주둥이 끝');
    t.pin(end, name);
  } },
  bl: { view: 'top', draw(t, m, v) {
    const L = m.lm;
    const [a, b, na, nb, sym] = [
      [L.snout, L.pelvicPost, '주둥이 끝', '배지느러미 뒷끝', 'L = DL_pel'],
      [L.snout, L.tailBase, '주둥이 끝', '꼬리 기부', 'DL_tb'],
      [L.snout, L.discPost, '주둥이 끝', '가슴지느러미 뒷끝', 'DL_pec'],
      [V(0, 0, L.eyeR.z), L.tailBase, null, '꼬리 기부', 'L_eye'],
      [L.snout, L.discPost, '주둥이 끝', '뒷 기준점 미기재', 'DL (?)'],
    ][v];
    if (!na) { t.tube([L.eyeL, L.eyeR], COL.c, t.R * 0.5); t.pin(L.eyeR, '눈'); } else t.pin(a, na);
    t.dim(a, b, sym);
    t.pin(b, nb);
  } },
  finbase: { view: 'top', draw(t, m) {
    const L = m.lm;
    t.tube(topLine(m, m.sp.sb, L.finO.z, L.finI.z), COL.b);
    t.dim(L.finO, L.finI, 'ℓ_fb · 지느러미 기부', COL.b, m.lift, 0.7);
    t.dim(L.snout, L.pelvicPost, 'DL_pel (비교)', COL.a, m.lift * 1.6, 0.3);
  } },
  dp: { view: 'top', draw(t, m) {
    const e = m.finEdge.map(p => up(p, 0.004)), c = poly(e);
    t.tube(e, COL.a, t.R * 1.2);
    [0.15, 0.32, 0.5, 0.68, 0.85].forEach(u => t.cone(c.getPointAt(u), c.getTangentAt(u)));
    t.label(m.lm.tipR, 'P_d · 체반 둘레');
  } },
  chord: { view: 'top', draw(t, m, v) {
    const { fn, lm } = m;
    if (v === 0) t.dim(lm.rootLE, lm.finI, 'c_r · 루트 코드');
    if (v === 1) [0.25, 0.5, 0.75].forEach(s => { const l = topLine(m, s, fn.L(s), fn.te(s)); t.tube(l, COL.a); t.label(l[10], `c(y) (${s * 100}%)`); });
    if (v === 2) t.dim(lm.finO, lm.finI, 'c_r = 지느러미 기부 길이');
    if (v === 3) {
      const r = midRadial(m), [a, b] = maxPerpChord(m);
      t.tube(r.pts, COL.c, t.R * 0.6); t.label(r.pts[16], '중앙 지느러미살', COL.c);
      t.tube([a, b], COL.a); t.label(a.clone().lerp(b, 0.5), 'c_max ⊥ 지느러미살');
    }
  } },
  area: { view: 'top', draw(t, m, v) {
    if (v === 0) { m.paint(() => HL); t.label(finMid(m, 0.5), 'S · 투영 면적', COL.c); }
    if (v === 1) { m.paint(x => (x.s > m.sp.sb ? HL : null)); t.label(finMid(m, 0.5), 'S_fin · 한쪽 지느러미', COL.c); }
    if (v === 2) {
      const k = kite(m);
      t.mesh([k[0], k[1], k[2], k[0], k[2], k[3]], COL.a, 0.2);
      t.tube([...k, k[0]], COL.a);
      t.label(k[1].clone().lerp(k[3], 0.5), 'S ≈ DW × c_r / 2');
    }
  } },
  ar: { view: 'top', draw(t, m, v) {
    const L = m.lm;
    t.dim(v === 2 ? V(0, 0, L.tipR.z) : L.tipL, L.tipR, v === 2 ? 'b · 반스팬' : 'DW');
    if (v === 0) { m.paint(() => HL); t.label(finMid(m, 0.5), 'S · 평면 면적', COL.c); }
    if (v === 1) { t.dim(L.finO, L.finI, 'c_r', COL.b); const k = kite(m); t.tube([...k, k[0]], COL.c, t.R * 0.7); }
    if (v === 2) { m.paint(x => (x.s > m.sp.sb ? HL : null)); t.label(finMid(m, 0.55), 'S_fin · 한쪽 지느러미', COL.c); }
    if (v === 3) t.dim(L.rootLE, L.finI, 'c_r · 코드', COL.b);
  } },
  shape: { view: 'top', draw(t, m) {
    const pts = poly(m.finEdge).getSpacedPoints(34);
    t.tube(m.finEdge, COL.c, t.R * 0.5);
    pts.forEach((p, i) => (i % 34 ? t.dot(p, COL.a, t.R * 2) : t.dot(p, COL.b, t.R * 3.5)));
    t.label(pts[0], '고정 랜드마크', COL.b); t.label(pts[34], '고정 랜드마크', COL.b);
    t.label(pts[17], '세미랜드마크 33개');
  } },
  sweep: { view: 'top', draw(t, m) {
    const a = m.lm.rootLE, b = m.lm.tipR, ang = Math.atan2(b.z - a.z, b.x - a.x);
    t.tube([a, b], COL.a); t.tube([a, V(1.05, 0, a.z)], COL.c, t.R * 0.6);
    const arc = [...Array(17)].map((_, i) => V(a.x + 0.35 * Math.cos(ang * i / 16), 0, a.z + 0.35 * Math.sin(ang * i / 16)));
    t.tube(arc, COL.b, t.R * 0.7);
    t.label(arc[8], 'Λ_LE 후퇴각 (사이트 제안 정의)', COL.b);
  } },

  tmax: { mode: SEC, view: secView, draw: (t, m, v, s) => section(t, m, s, 'T') },
  tr: { mode: SEC, view: secView, draw: (t, m, v, s) => section(t, m, s, 'TC') },
  sp: { mode: SEC, view: secView, draw: (t, m, v, s) => section(t, m, s, 'TCS') },
  camber: { mode: SEC, view: secView, draw: (t, m, v, s) => section(t, m, s, 'CM') },

  mass: { view: 'iso', draw: (t, m) => whole(t, m, 'M · 몸 전체') },
  mred: { view: 'iso', draw(t, m) {
    whole(t, m, 'M · 몸 전체');
    const L = m.lm.discPost.z;
    t.box(V(0, 0, L / 2), L, COL.a);
    t.label(V(L / 2, L / 2, 0), 'ρ_w L³ (L = DL_pec로 예시)');
  } },
  density: { view: 'side', draw(t, m) {
    whole(t, m, '몸 전체');
    const c = m.lm.com, len = m.lift * 2.5;
    t.arrow(c.clone().add(V(0, 0, -0.06)), V(0, -1, 0), len, COL.b, 'W_air · 공기 중 무게');
    t.arrow(c.clone().add(V(0, 0, 0.06)), V(0, 1, 0), len, COL.c, '부력 = W_air − W_sub');
  } },
  com: { view: 'top', draw(t, m) {
    const { tipL, tipR, com } = m.lm;
    t.tube([tipL, tipR], COL.c, t.R * 0.6); t.label(V(-0.6, 0, tipR.z), '최대 스팬 축', COL.c);
    t.dot(com, COL.b, t.R * 4); t.label(com, 'COM (예시 위치)', COL.b);
    t.dim(V(0.25, 0, com.z), V(0.25, 0, tipR.z), 'Δx_COM · 앞 −, 뒤 +', COL.a, m.lift * 0.6);
    t.dim(m.lm.snout, V(0, 0, com.z), 'x_COM', COL.b, m.lift * 1.6, 0.35);
  } },
  tailmass: { view: 'iso', draw(t, m) {
    const { tailBase: b, tailTip } = m.lm;
    m.tint(['tail'], HL);
    t.tube([V(-0.07, 0, b.z), V(0.07, 0, b.z)], COL.b); t.label(V(0.07, 0, b.z), '꼬리 기부', COL.b);
    t.label(b.clone().lerp(tailTip, 0.5), 'm_tail / M', COL.c);
  } },

  radial: { mode: SK, view: 'top', draw(t, m) {
    const r = fin(t, m);
    r.joints.forEach(p => t.dot(p, COL.b, t.R * 1.8));
    t.label(r.pts[10], '지느러미살 = radial 마디의 연결');
    m.paths.cora.forEach(p => t.tube(p, COL.c, t.R * 1.4));
    t.label(m.paths.cora[0][2], '가슴띠 (coracoid bar)', COL.c);
  } },
  calc: { mode: SK, view: 'top', draw(t, m) { t.label(fin(t, m).pts[12], 'radial 단면 → 아래 모식도'); } },
  chains: { mode: SK, view: 'top', draw(t, m) {
    const r = midRadial(m);
    t.tube(r.pts.slice(0, 11), COL.c); t.tube(r.pts.slice(10), COL.b);
    t.label(r.pts[5], '근위 (2번째)', COL.c); t.label(r.pts[16], '원위 (분지 뒤 2번째)', COL.b);
  } },
  brace: { mode: SK, view: focus(DIR_TOP, m => midRadial(m).pts[10], 0.5), draw(t, m) {
    m.showBraces(true);
    const right = [];
    for (let i = 0; i < m.brace.length; i += 2) if (m.brace[i].x > 0) right.push([m.brace[i], m.brace[i + 1]]);
    right.forEach(p => t.tube(p, COL.a, t.R * 0.6));
    t.label(right[right.length >> 1][0], '교차 보강 (날개 중앙부)');
  } },
  stagger: { mode: SK, view: focus(DIR_TOP, m => midRadial(m).joints[5], 0.3), draw(t, m) {
    const k0 = m.N >> 1;
    for (let k = k0 - 2; k <= k0 + 2; k++) {
      const r = m.radials[k];
      t.tube(r.pts, COL.c, t.R * 0.35);
      r.joints.forEach(p => t.dot(p, k % 2 ? COL.b : COL.a, t.R * 1.1));
    }
    t.label(m.radials[k0].joints[4], '관절이 반 마디씩 엇갈림');
  } },
  radshape: { mode: SK, view: focus(DIR_TOP, m => midRadial(m).pts[10], 0.7), draw(t, m) {
    const r = midRadial(m), j = [r.pts[0], ...r.joints, r.pts[20]], a = new THREE.Color(COL.c), b = new THREE.Color(COL.b);
    j.forEach((p, i) => i && t.tube([j[i - 1], p], a.clone().lerp(b, i / j.length), t.R * 1.1));
    t.label(j[1], '근위', COL.c); t.label(j.at(-2), '원위', COL.b);
  } },
  bifurc: { mode: SK, view: focus(DIR_TOP, m => midRadial(m).pts[20], 0.5), draw(t, m) {
    m.radials.filter(r => r.side > 0).forEach(r => r.fork.forEach(f => t.tube([r.pts[20], f], COL.a, t.R * 0.35)));
    t.label(midRadial(m).pts[20], '원위부 분지 (Y자)');
  } },
  rom: { view: m => sideOf(m, midRadial(m).joints[6], 0.32), draw(t, m) {
    const r = midRadial(m), p = r.joints[6], d = r.joints[7].clone().sub(p).normalize();
    const ax = V(-d.z, 0, d.x).normalize(), len = m.size * 0.1, rad = THREE.MathUtils.degToRad(15);
    t.tube(r.pts, COL.c, t.R * 0.5);
    t.tube([p, p.clone().addScaledVector(d, len)], COL.c, t.R * 0.6);
    t.tube([p, p.clone().addScaledVector(d.clone().applyAxisAngle(ax, rad), len)], COL.a, t.R * 0.7);
    const arc = [...Array(9)].map((_, i) => p.clone().addScaledVector(d.clone().applyAxisAngle(ax, rad * i / 8), len * 0.6));
    t.tube(arc, COL.b, t.R * 0.6);
    t.dot(p, COL.b, t.R * 1.6);
    t.label(arc[4], '≈ 15°', COL.b);
  } },
  cantilever: { view: m => sideOf(m, midRadial(m).pts[10], 0.75), draw(t, m) {
    const r = midRadial(m), a = r.pts[0], b = r.pts[20], Y = a.distanceTo(b) * 0.12;
    const bent = [...Array(21)].map((_, i) => { const x = i / 20; return a.clone().lerp(b, x).add(V(0, -Y * x * x * (3 - x) / 2, 0)); });
    t.tube([a, b], COL.c);
    t.tube(bent, COL.a, t.R * 0.8);
    t.dot(a, COL.b, t.R * 4); t.label(a, '고정단', COL.b);
    t.arrow(up(bent[20], Y * 1.6), V(0, -1, 0), Y * 1.5, COL.b, 'F');
    t.label(b.clone().lerp(bent[20], 0.5), 'δ_max = F ℓ_r³ / 3EI');
  } },
  stiff: { view: 'iso', draw(t, m) {
    const sb = m.sp.sb;
    m.paint(x => FLEX.clone().lerp(STIFF, (1 - Math.max(0, (Math.abs(x.s) - sb) / (1 - sb))) ** 1.3 * (0.6 + 0.4 * Math.sin(Math.PI * x.c))));
    t.label(finMid(m, 0.25), '단단함', COL.c); t.label(m.lm.tipR, '유연함', COL.c);
  } },
  basal: { mode: SK, view: focus(DIR_TOP, m => V(0, 0, m.sp.uG), 0.55), draw(t, m) {
    const P = m.paths;
    [['pro', COL.a, 'propterygium'], ['meta', COL.b, 'metapterygium'], ['cora', COL.c, 'coracoid bar']].forEach(([k, c, n]) => {
      P[k].forEach(p => t.tube(p, c, t.R * 1.6));
      t.label(P[k][0][P[k][0].length >> 1], n, c);
    });
    P.meso.forEach(p => t.tube(p, COL.gray, t.R));
    t.label(P.meso[0][1], 'mesopterygium (비교 제외)', COL.gray);
  } },

  pmus: { view: (m, s, v) => (v ? 'bottom' : 'iso'), draw(t, m, v) {
    m.paint(x => (Math.abs(x.s) > m.sp.sb * 0.9 && x.top === !v ? HL : null));
    t.label(up(finMid(m, 0.55), v ? -0.05 : 0.03), v ? '배쪽 adductor (표층·심층)' : '등쪽 abductor (표층·심층)', COL.c);
  } },
  pelvmus: { view: (m, s, v) => pelvicView(v ? DIR_TOP : DIR_BOTTOM)(m), draw(t, m, v) {
    m.tint(['pelvic'], HL);
    pelvicPro(t, m, 'propterygium');
    t.label(m.lm.pelvic, v ? '등쪽: 거상근 · (전진근·후퇴근은 양면)' : '배쪽: 하강근 · propterygium 하강근 · (전진근·후퇴근은 양면)', COL.c);
  } },
  pelvarea: { view: 'bottom', draw(t, m) {
    m.paint(() => SOFT);
    m.tint(['pelvic'], HL);
    t.label(m.lm.pelvic, '배지느러미', COL.c);
    t.label(up(finMid(m, -0.5), -0.03), '전체 체반', COL.gray);
  } },
  pseg: { mode: SK, view: pelvicView(DIR_TOP), draw(t, m, v) {
    if (v) return pelvicPro(t, m, '단일 요소');
    m.paths.pelvicPro.forEach(p => {
      const c = poly(p), cuts = [[0, 0.3], [0.34, 0.6], [0.64, 0.84], [0.88, 1]];
      cuts.forEach(([a, b], i) => {
        t.tube([0, 0.5, 1].map(f => c.getPointAt(a + (b - a) * f)), i === 3 ? COL.b : COL.a, t.R * 1.6);
        if (i) t.dot(c.getPointAt(a - 0.02), COL.c, t.R * 1.8);
      });
    });
    t.label(m.paths.pelvicPro[0].at(-1), '원위 요소 (과상 관절)', COL.b);
    t.label(poly(m.paths.pelvicPro[0]).getPointAt(0.45), '분절', COL.a);
  } },
  pei: { mode: SK, view: pelvicView(DIR_TOP), draw: (t, m) => pelvicPro(t, m, 'propterygium → 3점 굽힘 시험') },
  pE: { mode: SK, view: pelvicView(DIR_TOP), draw: (t, m) => pelvicPro(t, m, 'propterygium 재료') },
  pshape: { mode: SK, view: pelvicView(DIR_TOP), draw: (t, m) => pelvicPro(t, m, 'propterygium 단면') },
  pcomp: { mode: SK, view: pelvicView(DIR_TOP), draw: (t, m) => pelvicPro(t, m, 'propterygium 조직') },
  tail: { view: m => ({ dir: DIR_TOP, at: V(0, 0, m.lm.tailTip.z / 2), dist: m.size * 1.55 }), draw(t, m, v) {
    const L = m.lm;
    t.dim(L.tailBase, L.tailTip, 'ℓ_tail · 꼬리 길이');
    if (v) t.dim(L.tipL, L.tipR, 'DW', COL.b);
    else t.dim(L.snout, L.tailBase, 'DL_tb', COL.b, m.lift * 1.5);
  } },
  cephalic: { view: 'top', draw(t, m) {
    const L = m.lm;
    if (m.paths.rostral) {
      m.paint(x => (Math.abs(x.s) < 0.08 && x.z < 0.25 ? HL : null));
      t.tube(m.paths.rostral[0], COL.a, t.R * 1.6);
      t.label(m.paths.rostral[0][1], '주둥이 연골');
    } else {
      m.tint(['ceph'], HL);
      t.label(V(0.12, 0.04, -0.12), '두부엽', COL.c);
    }
    t.dim(L.snout, L.pelvicPost, 'DL_pel', COL.a, m.lift, 0.3);
    t.dim(L.finO, L.finI, 'ℓ_fb', COL.b, m.lift, 0.7);
  } },
};
