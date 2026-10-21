import * as THREE from 'three';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const poly = pts => {
  const p = new THREE.CurvePath();
  for (let i = 1; i < pts.length; i++) p.add(new THREE.LineCurve3(pts[i - 1], pts[i]));
  return p;
};
const clamp01 = x => Math.min(1, Math.max(0, x));
const naca = c => 5 * (0.2969 * Math.sqrt(c) - 0.126 * c - 0.3516 * c ** 2 + 0.2843 * c ** 3 - 0.1036 * c ** 4);

// 단위: 반스팬 = 1 (DW = 2). x 오른쪽, y 등쪽, z 몸축(0 = 머리 앞 끝, + = 꼬리 쪽).
// le/teFin: 반스팬 위치 s에서 앞전·뒷전의 z, tr: 두께비, camber: 0 대칭 ~ 1 배면 평평.
// sb 몸통 반폭(= 지느러미 기부), uFinO·uIns 기부 앞·뒤 끝, uTb 꼬리 기부, uG 가슴띠, uCom 무게중심.
// 모든 형상·위치는 시각화용 예시이며 실측값이 아니다.
export const SPECS = {
  manta: {
    label: '만타 (Mobula birostris) · 예시 형상',
    sb: 0.13, uFinO: 0.07, uIns: 0.8, uTb: 0.95, uG: 0.3, uCom: 0.42, tailLen: 0.75,
    camber: 0.08, center: 0.55, size: 2.3, lift: 0.14, mobulid: true,
    colors: [0x1b2a3a, 0xe3ecf0],
    le: s => 0.32 * s ** 1.3 + 0.3 * s ** 4,
    teFin: s => { const t = (1 - s) / 0.87; return 0.62 + 0.18 * t - 0.1 * Math.sin(Math.PI * t); },
    tr: s => 0.08 + 0.04 * (1 - s) + 0.05 * Math.exp(-((s / 0.15) ** 2)),
    pelvic: [[0.05, 0.76], [0.12, 0.79], [0.17, 0.9], [0.12, 0.97], [0.05, 0.95]],
    eye: [0.16, 0.06],
    gills: { z: 0.3, x: [0.05, 0.11] },
    basal: {
      pro: [[0.124, 0.3], [0.13, 0.18], [0.127, 0.07], [0.12, -0.02], [0.12, -0.13]],
      meso: [[0.136, 0.28], [0.17, 0.34]],
      meta: [[0.124, 0.32], [0.13, 0.5], [0.124, 0.76]],
    },
  },
  standard: {
    label: '표준 가오리 (저서성 일반형) · 예시 형상',
    sb: 0.1, uFinO: 0.16, uIns: 1.5, uTb: 1.65, uG: 0.55, uCom: 0.62, tailLen: 1.5,
    camber: 0.7, center: 1.0, size: 3.4, lift: 0.18,
    colors: [0x55777a, 0xdde8ea],
    le: s => 0.7 * (0.55 * s ** 0.8 + 0.45 * (1 - Math.sqrt(1 - s))),
    teFin: s => 0.7 + 0.8 * Math.sin(Math.PI / 2 * (1 - s) / 0.9) ** 0.7,
    tr: s => 0.05 + 0.03 * (1 - s) + 0.04 * Math.exp(-((s / 0.18) ** 2)),
    pelvic: [[0.05, 1.4], [0.15, 1.44], [0.27, 1.52], [0.21, 1.56], [0.23, 1.63], [0.17, 1.72], [0.08, 1.7], [0.05, 1.63]],
    eye: [0.07, 0.32],
    gills: { z: 0.6, x: [0.07, 0.12] },
    basal: {
      pro: [[0.095, 0.55], [0.1, 0.35], [0.08, 0.18], [0.04, 0.06]],
      meso: [[0.105, 0.53], [0.13, 0.6]],
      meta: [[0.095, 0.57], [0.1, 0.9], [0.095, 1.45]],
    },
    rostral: [[0, 0.3], [0, 0.015]],
    pelvicPro: [[0.06, 1.44], [0.16, 1.47], [0.255, 1.52]],
  },
};

export function buildModel(key) {
  const sp = SPECS[key], { sb, le, teFin, tr, camber: k } = sp;
  const L = s => le(Math.abs(s));
  const te = s => { s = Math.abs(s); return s >= sb ? teFin(s) : sp.uIns + (sp.uTb - sp.uIns) * Math.sqrt(1 - (s / sb) ** 2); };
  const chord = s => te(s) - L(s);
  const yt = (s, c) => chord(s) * tr(Math.abs(s)) * naca(clamp01(c));
  const F = { top: 1 + k, mid: k, bot: -(1 - k) }; // yt에 곱하면 등면·중립면·배면 높이
  const onSurf = (p, f = F.mid) => (p.y = f * yt(p.x, clamp01((p.z - L(p.x)) / Math.max(chord(p.x), 1e-6))), p);

  const group = new THREE.Group(), anno = new THREE.Group(), mats = [];
  group.position.z = -sp.center;
  const mat = (color, o) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, side: THREE.DoubleSide, ...o });
    m.userData.base = color; mats.push(m); return m;
  };

  // 체반: 반스팬 × 코드 격자로 등면·배면을 만들고 가장자리에서 두께 0으로 닫음
  const half = [...new Set([...Array(41)].map((_, i) => Math.sin(i / 40 * Math.PI / 2))
    .concat([0.85, 0.93, 0.97, 0.995].map(f => f * sb)))].sort((a, b) => a - b);
  const ss = [...half.slice(1).map(s => -s).reverse(), ...half];
  const cs = [...Array(33)].map((_, j) => (1 - Math.cos(j / 32 * Math.PI)) / 2);
  const pos = [], meta = [], idx = [], ns = ss.length, nc = cs.length;
  for (const f of [F.top, F.bot]) for (const s of ss) for (const c of cs) {
    const z = L(s) + c * chord(s);
    pos.push(s, f * yt(s, c), z);
    meta.push({ s, c, z, top: f > 0 });
  }
  for (let h = 0; h < 2; h++) for (let i = 0; i < ns - 1; i++) for (let j = 0; j < nc - 1; j++) {
    const a = (h * ns + i) * nc + j, b = a + nc;
    idx.push(...(h ? [a, b, a + 1, b, b + 1, a + 1] : [a, a + 1, b, b, a + 1, b + 1]));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const body = new THREE.Mesh(geo, mat(0xffffff, { vertexColors: true }));
  const base = sp.colors.map(c => new THREE.Color(c));
  const paint = fn => {
    const col = geo.attributes.color;
    meta.forEach((v, i) => col.setXYZ(i, ...(fn?.(v) ?? base[v.top ? 0 : 1]).toArray()));
    col.needsUpdate = true;
  };

  // 부속 구조: 얇은 판(윤곽 스플라인을 압출)
  const plate = (pts, depth, color) => {
    const sh = new THREE.Shape();
    sh.moveTo(...pts[0]);
    sh.splineThru([...pts.slice(1), pts[0]].map(([a, b]) => new THREE.Vector2(a, b)));
    return new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 24 }), mat(color));
  };
  const parts = {};
  parts.pelvic = [1, -1].map(side => {
    const m = plate(sp.pelvic.map(([x, z]) => [x * side, z]), 0.012, sp.colors[0]);
    m.geometry.rotateX(Math.PI / 2); // (x, z) 윤곽 → 수평판, y ∈ [-0.012, 0]
    return m;
  });
  const tg = new THREE.ConeGeometry(0.018, sp.tailLen, 10);
  tg.rotateX(Math.PI / 2);
  parts.tail = new THREE.Mesh(tg, mat(sp.colors[0]));
  parts.tail.position.z = sp.uTb + sp.tailLen / 2;
  if (sp.mobulid) {
    parts.ceph = [1, -1].map(side => {
      const m = plate([[0.04, -0.028], [-0.1, -0.034], [-0.165, -0.012], [-0.165, 0.018], [-0.1, 0.032], [0.04, 0.028]], 0.018, sp.colors[0]);
      m.geometry.rotateY(-Math.PI / 2); // (z, y) 윤곽 → 세로판
      m.position.set(side * 0.12 + 0.009, 0, 0.02);
      return m;
    });
    parts.dorsal = plate([[0.84, 0], [0.91, 0.06], [0.95, 0]], 0.006, sp.colors[0]);
    parts.dorsal.geometry.rotateY(-Math.PI / 2);
    parts.dorsal.position.set(0.003, 0.004, 0);
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.018, 0.012), mat(0x050b10));
    mouth.position.set(0, 0, 0.004);
    group.add(mouth);
  }
  const dark = mat(0x050b10);
  for (const side of [1, -1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), dark);
    e.position.copy(onSurf(V(side * sp.eye[0], 0, sp.eye[1]), F.top));
    group.add(e);
  }
  const gills = [];
  for (const side of [1, -1]) for (let i = 0; i < 5; i++)
    gills.push(...sp.gills.x.map(x => onSurf(V(side * x, 0, sp.gills.z + i * 0.04), F.bot).add(V(0, -0.002, 0))));
  group.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gills), new THREE.LineBasicMaterial({ color: 0x0a1a24 })));

  // 오른쪽 가슴지느러미 바깥 가장자리: 기부 앞 → 끝 → 기부 뒤
  const sFin = [...Array(61)].map((_, i) => sb + (1 - sb) * Math.sin(i / 60 * Math.PI / 2));
  const finEdge = [...sFin.map(s => V(s, 0, le(s))), ...sFin.slice(0, -1).reverse().map(s => V(s, 0, teFin(s)))];

  // 골격: 기부에서 가장자리로 뻗는 지느러미살(관절·분지), 교차 보강, 기저 연골
  const skel = new THREE.Group();
  skel.visible = false;
  const N = 30, J = 14, FORK = 0.85;
  const margin = poly(finEdge).getSpacedPoints(N * 4);
  const flip = side => p => onSurf(p.clone().multiply(V(side, 1, 1)));
  const radials = [];
  for (const side of [1, -1]) for (let k = 0; k < N; k++) {
    const b = V(sb, 0, sp.uFinO + 0.02 + (k + 0.5) / N * (sp.uIns - sp.uFinO - 0.04)), tip = margin[4 * k + 2];
    const cv = new THREE.QuadraticBezierCurve3(b, V(sb + 0.5 * (tip.x - sb), 0, b.z + 0.15 * (tip.z - b.z)), tip);
    const at = t => flip(side)(cv.getPoint(t));
    radials.push({ k, side,
      pts: [...Array(21)].map((_, i) => at(FORK * i / 20)),
      fork: [margin[4 * k + 1], margin[4 * k + 3]].map(flip(side)),
      joints: [...Array(J - 1)].map((_, j) => at(FORK * ((j + 1 + (k % 2) / 2) / J) ** 0.85)) }); // 홀수 줄은 반 마디 엇갈림
  }
  const seg = [], brace = [];
  for (const r of radials) {
    r.pts.forEach((p, i) => i && seg.push(r.pts[i - 1], p));
    r.fork.forEach(f => seg.push(r.pts[20], f));
  }
  radials.forEach((r, i) => {
    const n = radials[i + 1];
    if (n?.side === r.side && r.k >= N * 0.35 && r.k < N * 0.7) for (let j = 3; j < 9; j++) brace.push(r.joints[j], n.joints[j]);
  });
  const lines = pts => new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xbfeaf5, transparent: true, opacity: 0.75 }));
  const braceObj = lines(brace);
  skel.add(lines(seg), braceObj, new THREE.Points(new THREE.BufferGeometry().setFromPoints(radials.flatMap(r => r.joints)),
    new THREE.PointsMaterial({ color: 0xe6fbff, size: 2.5, sizeAttenuation: false })));

  const path = pts => pts.map(([x, z]) => onSurf(V(x, 0, z)));
  const paths = {};
  for (const [name, p] of Object.entries(sp.basal)) paths[name] = [1, -1].map(side => path(p.map(([x, z]) => [x * side, z])));
  paths.cora = [path([[-sb * 0.9, sp.uG], [0, sp.uG - 0.015], [sb * 0.9, sp.uG]])];
  paths.axis = [path([[0, 0.05], [0, sp.uTb]])];
  if (sp.rostral) paths.rostral = [path(sp.rostral)];
  if (sp.pelvicPro) {
    const z0 = sp.pelvicPro[0][1];
    paths.pelvicPro = [1, -1].map(side => sp.pelvicPro.map(([x, z]) => V(x * side, -0.006, z)));
    paths.pelvicGirdle = [[V(-0.06, -0.006, z0), V(0.06, -0.006, z0)]];
  }
  const cart = new THREE.MeshStandardMaterial({ color: 0xd6f1f6, roughness: 0.5 });
  for (const list of Object.values(paths)) for (const p of list) skel.add(new THREE.Mesh(new THREE.TubeGeometry(poly(p), 24, 0.01, 6), cart));

  group.add(body, ...Object.values(parts).flat(), skel, anno);

  const profile = (s, n = 60) => { // 반스팬 s의 앞뒤 방향 단면
    const P = { top: [], bot: [], mid: [], le: L(s), C: chord(s), T: 0, cT: 0 };
    for (let i = 0; i <= n; i++) {
      const c = (1 - Math.cos(i / n * Math.PI)) / 2, z = L(s) + c * chord(s), y = yt(s, c);
      P.top.push(V(s, F.top * y, z)); P.bot.push(V(s, F.bot * y, z)); P.mid.push(V(s, F.mid * y, z));
      if (2 * y > P.T) { P.T = 2 * y; P.cT = c; }
    }
    return P;
  };

  const avg = i => sp.pelvic.reduce((a, p) => a + p[i], 0) / sp.pelvic.length;
  return {
    key, sp, group, anno, size: sp.size, lift: sp.lift, N,
    fn: { L, te, chord, F, onSurf },
    lm: {
      snout: V(0, 0, 0), tipR: V(1, 0, le(1)), tipL: V(-1, 0, le(1)),
      discPost: V(0, 0, sp.uIns), tailBase: V(0, 0, sp.uTb), tailTip: V(0, 0, sp.uTb + sp.tailLen),
      eyeR: onSurf(V(sp.eye[0], 0, sp.eye[1]), F.top), eyeL: onSurf(V(-sp.eye[0], 0, sp.eye[1]), F.top),
      finO: V(sb, 0, sp.uFinO), finI: V(sb, 0, sp.uIns), rootLE: V(sb, 0, le(sb)),
      pelvicPost: V(0, 0, Math.max(...sp.pelvic.map(p => p[1]))),
      pelvic: V(avg(0), -0.01, avg(1)),
      com: onSurf(V(0, 0, sp.uCom)),
    },
    finEdge, radials, brace, paths, profile, paint,
    tint: (names, color) => names.flatMap(n => parts[n] ?? []).forEach(p => p.material.color.set(color)),
    reset() { paint(null); mats.forEach(m => m.color.setHex(m.userData.base)); braceObj.visible = key === 'manta'; },
    showBraces: on => (braceObj.visible = on),
    setSkeleton(on) { skel.visible = on; mats.forEach(m => Object.assign(m, { transparent: on, opacity: on ? 0.18 : 1, depthWrite: !on })); },
    setClip(s0) { const planes = s0 == null ? [] : [new THREE.Plane(V(1, 0, 0), -s0)]; mats.forEach(m => (m.clippingPlanes = planes)); }, // x ≥ s0만 남김
  };
}
