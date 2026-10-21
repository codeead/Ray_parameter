// 유영 애니메이션: 조절값(p)을 받아 매 프레임 3D 모델 정점을 움직인다. 운동 모델은 시각화용 단순화다.
// 지느러미 높이 = a·g(s)^e · 파형(f·t − W·z/L − φ_tip·g), g(s) = 기부(0)~끝(1), z = 몸축 위치, L = DL_pel.
import * as THREE from 'three';
import { V } from './models.js';

const TAU = Math.PI * 2;
const NU = 1.0e-6; // 물의 동점성계수 m²/s (약 20 °C)

// 다운스트로크가 주기의 D만큼 걸리는 파형: +1(위) → −1(아래) → +1
const stroke = (ph, D) => {
  const u = ph - Math.floor(ph);
  return Math.cos(u < D ? Math.PI * u / D : Math.PI + Math.PI * (u - D) / (1 - D));
};

// 조절값에서 계산하는 지표 (길이는 DL_pel 단위)
export function derive(p, m, modeId) {
  const L = m.lm.pelvicPost.z, cr = (m.lm.finI.z - m.lm.rootLE.z) / L, Lm = p.L / 100;
  const U = modeId === 'punting' ? p.dPunt / p.Tp : p.U;
  const lam = p.W > 0 ? 1 / p.W : Infinity, c = p.f * lam;
  return {
    cls: p.W, lambda: lam, c, slip: U / c, stride: U / p.f, St: p.f * 2 * p.a / U, k: TAU * p.f * cr / U,
    Re: U * Lm * Lm / NU, tiplag: p.a * L * Math.abs(Math.sin(TAU * (p.lag ?? 0))),
    omega: U / p.R * 180 / Math.PI, ac: U * U * Lm / p.R / 9.81, puntU: U, strideTail: U / p.fTail,
  };
}

export function createSwim(scene, snow) {
  const floor = new THREE.GridHelper(12, 48, 0x2f8aa6, 0x174a5e);
  Object.assign(floor.material, { transparent: true, opacity: 0.55 });
  const N = 240, trailGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.85 }));
  trail.frustumCulled = false;
  floor.visible = trail.visible = false;
  scene.add(floor, trail);
  const prepared = new Map();
  let filled = 0;

  const prep = m => {
    if (prepared.has(m)) return prepared.get(m);
    const meta = m.meta, sp = m.sp;
    const tip = meta.findIndex(v => v.s === 1 && v.top);
    const tailPos = m.parts.tail.geometry.attributes.position.array;
    let tailTip = 0;
    for (let i = 0; i < tailPos.length / 3; i++) if (tailPos[i * 3 + 2] > tailPos[tailTip * 3 + 2]) tailTip = i;
    const z0 = sp.pelvicPro?.[0][1] ?? sp.pelvic[0][1];
    const c = {
      base: m.body.geometry.attributes.position.array.slice(), tailBase: tailPos.slice(), tip, tailTip,
      L: m.lm.pelvicPost.z, cr: m.lm.finI.z - m.lm.rootLE.z,
      pivots: [1, -1].map(s => V(s * 0.06, -0.006, z0)),
    };
    prepared.set(m, c);
    return c;
  };

  function exit(m) {
    const c = prepared.get(m);
    floor.visible = trail.visible = false;
    if (!c) return;
    const pos = m.body.geometry.attributes.position;
    pos.array.set(c.base); pos.needsUpdate = true; m.body.geometry.computeVertexNormals();
    const tp = m.parts.tail.geometry.attributes.position;
    tp.array.set(c.tailBase); tp.needsUpdate = true;
    m.parts.pelvic.forEach(o => { o.position.set(0, 0, 0); o.quaternion.identity(); });
    m.group.rotation.set(0, 0, 0);
    m.group.position.set(0, 0, -m.sp.center);
  }

  function enter(m) { prep(m); filled = 0; trail.visible = true; }

  // t: 시뮬레이션 시간(s), dt: 지난 프레임 이후 시뮬레이션 시간(일시정지면 0)
  function update(m, mode, p, t, dt) {
    const c = prep(m), sb = m.sp.sb, L = c.L, id = mode.id;
    const glide = id === 'gliding', turn = id === 'turning', punt = id === 'punting';

    // 가슴지느러미
    const pos = m.body.geometry.attributes.position, arr = pos.array, base = c.base, meta = m.meta;
    const a = (p.a ?? 0) * L, W = p.W ?? 0, f = p.f ?? 0, D = p.down ?? 0.5, lag = p.lag ?? 0;
    const har = p.har ?? 1, up = 2 * har / (1 + har), dn = 2 / (1 + har);
    const r = turn ? p.ratio : 1, outer = 2 * r / (1 + r), inner = 2 / (1 + r);
    const e = 1 + 0.8 * Math.max(0, 1 - W); // 파수가 작을수록(진동형) 굽힘이 끝에 몰림
    const tanG = Math.tan((p.dihedral ?? 0) * Math.PI / 180);
    for (let i = 0; i < meta.length; i++) {
      const v = meta[i], s = Math.abs(v.s);
      let dy = 0;
      if (s > sb) {
        const g = ((s - sb) / (1 - sb)) ** e;
        if (glide) dy = (s - sb) * tanG;
        else if (a) {
          const w = stroke(f * t - W * v.z / L - lag * g, D);
          dy = a * g * w * (w > 0 ? up : dn) * (v.s > 0 ? outer : inner);
        }
      }
      arr[i * 3 + 1] = base[i * 3 + 1] + dy;
    }
    pos.needsUpdate = true;
    m.body.geometry.computeVertexNormals();

    // 꼬리 (축 기반): 기부 0 → 끝 1로 커지는 좌우 파동
    const tp = m.parts.tail.geometry.attributes.position, tb = c.tailBase, Lt = m.sp.tailLen;
    const aT = (p.aTail ?? 0) * L, fT = p.fTail ?? 0;
    for (let i = 0; i < tb.length / 3; i++) {
      const u = (tb[i * 3 + 2] + Lt / 2) / Lt;
      tp.array[i * 3] = tb[i * 3] + aT * u ** 1.5 * Math.sin(TAU * (fT * t - u));
    }
    tp.needsUpdate = true;

    // 펀팅: 닿아 있는 동안 배지느러미가 앞 → 뒤로 밀고, 떨어지면 들어서 되돌림
    let flow = turn ? 0 : (p.U ?? 0) * L; // 몸 대신 물·바닥이 뒤로 흐르게 해서 전진을 보여줌
    if (punt) {
      const df = p.duty / 100, ph = (t / p.Tp) % 1, on = ph < df;
      const sweep = on ? 1 - 2 * ph / df : -1 + 2 * (ph - df) / (1 - df);
      m.parts.pelvic.forEach((o, i) => {
        const side = i ? -1 : 1, q = new THREE.Quaternion().setFromEuler(new THREE.Euler(on ? 0.12 : -0.15, side * 0.45 * sweep, 0));
        o.quaternion.copy(q);
        o.position.copy(c.pivots[i]).sub(c.pivots[i].clone().applyQuaternion(q));
      });
      flow = on ? p.dPunt * L / (df * p.Tp) : 0;
    }
    else m.parts.pelvic.forEach(o => { o.position.set(0, 0, 0); o.quaternion.identity(); });

    // 선회: 왼쪽으로 반경 R의 원을 돌며 바깥 날개가 위로 가게 뱅크
    if (turn) {
      const R = p.R * L, th = (p.U / p.R) * t;
      m.group.rotation.set(0, th, p.bank * Math.PI / 180, 'YXZ');
      const centerAt = V(-R + R * Math.cos(th), 0, -R * Math.sin(th));
      m.group.position.copy(centerAt).sub(V(0, 0, m.sp.center).applyEuler(m.group.rotation));
    } else {
      m.group.rotation.set(0, 0, 0);
      m.group.position.set(0, 0, -m.sp.center);
    }

    // 바닥: 펀팅은 배지느러미 아래, 바닥 근접은 지느러미 평균 위치에서 d/c × c_r 아래
    floor.visible = punt || id === 'nearground';
    if (floor.visible) {
      floor.position.y = punt ? -0.035 : -p.d * c.cr;
      floor.position.z = (floor.position.z + flow * dt) % 0.25;
    }

    // 물(부유 입자)을 몸 반대 방향으로 흘림
    const sp = snow.geometry.attributes.position;
    if (flow * dt) {
      for (let i = 2; i < sp.array.length; i += 3) sp.array[i] = ((sp.array[i] + flow * dt + 7) % 14 + 14) % 14 - 7;
      sp.needsUpdate = true;
    }

    // 끝 궤적: 지느러미 끝(축 기반은 꼬리 끝)을 물에 대해 그린 선 → 보폭·스트로크 모양이 보임
    m.group.updateMatrixWorld();
    const src = id === 'axial' ? V(tp.array[c.tailTip * 3], tp.array[c.tailTip * 3 + 1], tp.array[c.tailTip * 3 + 2]).add(m.parts.tail.position)
      : V(arr[c.tip * 3], arr[c.tip * 3 + 1], arr[c.tip * 3 + 2]);
    const head = m.group.localToWorld(src), ta = trailGeo.attributes.position.array;
    if (dt || !filled) {
      for (let i = 2; i < ta.length; i += 3) ta[i] += flow * dt;
      ta.copyWithin(3, 0, ta.length - 3);
      ta.set([head.x, head.y, head.z], 0);
      if (!filled) for (let i = 3; i < ta.length; i += 3) ta.set([head.x, head.y, head.z], i);
      filled = 1;
      trailGeo.attributes.position.needsUpdate = true;
    }
  }

  return { enter, exit, update };
}
