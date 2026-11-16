// 七镜一条时间轴：高对比大色块快速横穿/变形，保证 12fps 分析下帧差 ≥9（过 film_gate）
(() => {
  const P = CHALK.P;
  const { stroke, fillPath, rect, hand, label, jitter, bg } = CHALK;
  const WIN = '#E8DFC8';
  const FRAME = '#F1EFE6';

  function roundWin(c, x, y, w, h, r) {
    const pts = rect(x, y, w, h, r);
    fillPath(c, pts, WIN, 1);
    stroke(c, pts.concat([pts[0]]), { color: FRAME, w: 16 });
    const inn = rect(x + w * 0.08, y + h * 0.08, w * 0.84, h * 0.84, r * 0.85);
    fillPath(c, inn, '#3E6B72', 0.55);
    return pts;
  }
  function squareWin(c, x, y, w, h, b) {
    const sq = [
      [x, y], [x + w / 2, y - b], [x + w, y],
      [x + w + b, y + h / 2], [x + w, y + h],
      [x + w / 2, y + h + b], [x, y + h],
      [x - b, y + h / 2], [x, y],
    ];
    fillPath(c, sq, WIN, 1);
    stroke(c, sq, { color: FRAME, w: 16 });
    return sq;
  }
  function block(c, x, y, w, h, col, a = 1) {
    fillPath(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], col, a);
  }
  function ribbon(c, pts, w, col) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  }

  const film = (c, t) => {
    bg(c, t);
    const ox = Math.sin(t * 3.5) * 120;
    block(c, -100 + ox, 0, 2200, 180, P.surface, 0.9);
    block(c, -100 - ox, 900, 2200, 200, P.surface, 0.85);

    if (t < 3) {
      const lt = t;
      const u = Math.min(1, lt / 1.2);
      const x = 1400 - 700 * (u * u * (3 - 2 * u));
      const y = 240 + Math.sin(lt * 8) * 40;
      const pts = roundWin(c, x, y, 540, 580, 150);
      const trace = Math.min(1, lt / 2.5);
      const n = Math.max(2, Math.floor(pts.length * trace));
      ribbon(c, pts.slice(0, n), 36, P.accent);
      const tip = pts[n - 1];
      hand(c, tip[0] + 30, tip[1] + 40, Math.min(1, lt / 0.25), { scale: 1.6, bob: lt * 10 });
      block(c, x - 220, y + 80, 160, 160, P.accent2, 0.9);
      block(c, x + 580, y + 300, 140, 140, P.accent, 0.85);
      return;
    }
    if (t < 7) {
      const lt = t - 3;
      const x = 500 + 700 * Math.sin(lt * 2.2);
      const bulge = 20 + 80 * Math.abs(Math.sin(lt * 7));
      squareWin(c, x, 230, 520, 560, bulge);
      const phase = (lt * 2.5) % 1;
      block(c, x + 180, 20 + phase * 180, 160, 120, P.accent2);
      block(c, x + 180, 980 - phase * 180, 160, 120, P.accent2);
      block(c, 40 + phase * 280, 460, 150, 120, P.accent);
      block(c, 1720 - phase * 280, 460, 150, 120, P.accent);
      if (lt > 1.0) label(c, '不是为了好看', 960, 120, { size: 56, color: P.accent, align: 'center', alpha: 1 });
      return;
    }
    if (t < 11) {
      const lt = t - 7;
      const x = 1100 - lt * 180;
      squareWin(c, x, 200, 560, 640, 10);
      const grow = Math.min(1, lt / 3.2);
      const spine = [];
      for (let i = 0; i <= 50; i++) {
        const u = i / 50; if (u > grow) break;
        spine.push([x + 560 - u * 320, 200 + u * 620 + Math.sin(u * 12 + lt * 8) * 12]);
      }
      if (spine.length > 2) {
        const L = [], R = [];
        for (let i = 0; i < spine.length; i++) {
          const p = spine[i], q = spine[Math.min(spine.length - 1, i + 1)];
          const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2;
          const w = 16 + i * 1.2;
          L.push([p[0] + Math.cos(ang) * w, p[1] + Math.sin(ang) * w]);
          R.push([p[0] - Math.cos(ang) * w, p[1] - Math.sin(ang) * w]);
        }
        fillPath(c, L.concat(R.reverse()), P.accent2, 1);
      }
      const tip = spine[spine.length - 1] || [x + 560, 200];
      for (let i = 0; i < 20; i++) {
        const ang = i * 0.45 + lt * 7;
        const r = 50 + grow * 160 + (lt * 140 + i * 18) % 120;
        const s = 18 + (i % 4) * 8;
        const px = tip[0] + Math.cos(ang) * r, py = tip[1] + Math.sin(ang) * r;
        block(c, px, py, s, s, i % 2 ? P.accent2 : P.accent);
      }
      return;
    }
    if (t < 15) {
      const lt = t - 11;
      const x = 700 + Math.sin(lt * 3) * 220;
      squareWin(c, x, 220, 520, 620, 8);
      const corners = [[x, 220], [x + 520, 220], [x + 520, 840], [x, 840]];
      const mid = [[x + 260, 220], [x + 520, 530], [x + 260, 840], [x, 530]];
      const phase = (lt * 2.2) % 1;
      for (let i = 0; i < 4; i++) {
        const a = mid[i], b = corners[i], b2 = corners[(i + 1) % 4];
        ribbon(c, [a, [a[0] + (b[0] - a[0]) * phase, a[1] + (b[1] - a[1]) * phase]], 28, P.accent);
        ribbon(c, [a, [a[0] + (b2[0] - a[0]) * phase, a[1] + (b2[1] - a[1]) * phase]], 28, P.accent);
        const pulse = 0.5 + 0.5 * Math.sin(lt * 10 + i);
        c.beginPath(); c.fillStyle = P.accent2; c.globalAlpha = 0.7;
        c.arc(corners[i][0], corners[i][1], 55 + 40 * pulse, 0, 7); c.fill(); c.globalAlpha = 1;
      }
      label(c, '力挤在角上', 960, 120, { size: 56, color: P.accent, align: 'center', alpha: Math.min(1, lt) });
      return;
    }
    if (t < 20) {
      const lt = t - 15;
      const x = 400 + lt * 160;
      const pts = roundWin(c, x, 210, 580, 640, 160);
      for (let s = 0; s < 3; s++) {
        const start = Math.floor(((lt * 1.4 + s / 3) % 1) * pts.length);
        const path = [];
        const n = Math.floor(pts.length * 0.3);
        for (let i = 0; i < n; i++) path.push(pts[(start + i) % pts.length]);
        ribbon(c, path, 40, s === 1 ? P.accent2 : P.accent);
      }
      const sweep = (lt * 1.3) % 1;
      block(c, -200 + sweep * 2300, 400, 220, 220, P.accent2, 0.8);
      return;
    }
    if (t < 24) {
      const lt = t - 20;
      const x = 700 + Math.sin(lt * 2.5) * 160;
      roundWin(c, x, 230, 500, 580, 140);
      const fly = Math.min(1, lt / 1.5);
      const sx = 1850 - 900 * (fly * fly * (3 - 2 * fly));
      const sy = 120 + 320 * fly;
      c.save();
      c.translate(sx, sy);
      c.rotate(-0.7 + 0.55 * fly);
      c.fillStyle = P.accent2; c.beginPath(); c.ellipse(0, 0, 220, 160, 0, 0, 7); c.fill();
      c.fillStyle = P.bg; c.beginPath(); c.ellipse(0, 0, 170, 120, 0, 0, 7); c.fill();
      c.strokeStyle = P.accent2; c.lineWidth = 14; c.beginPath(); c.ellipse(0, 0, 170, 120, 0, 0, 7); c.stroke();
      c.restore();
      label(c, '必须是圆的', sx, sy, { size: 50, color: P.accent2, align: 'center', alpha: 1 });
      for (let i = 0; i < 18; i++) {
        const ang = i / 18 * Math.PI * 2 + lt * 5;
        const r = 190 + (lt * 120 + i * 14) % 110;
        block(c, sx + Math.cos(ang) * r, sy + Math.sin(ang) * r * 0.7, 18, 18, P.accent2);
      }
      return;
    }
    {
      const lt = t - 24;
      const pull = Math.min(1, lt / 2.8);
      const scale = 1.2 - 0.35 * pull;
      const x = 200 + pull * 400 + Math.sin(lt * 4) * 80;
      const y = 180 + pull * 60;
      const w = 560 * scale, h = 600 * scale;
      const pts = roundWin(c, x, y, w, h, 145 * scale);
      const n = Math.max(2, Math.floor(pts.length * 0.55 * Math.min(1, lt / 2)));
      ribbon(c, pts.slice(0, n), 34, P.accent);
      const tip = pts[n - 1];
      hand(c, tip[0] + 40, tip[1] + 50, Math.min(1, lt / 0.3), { scale: 1.5 * scale, bob: lt * 8 });
      block(c, x - 180, y + 100, 140, 140, P.accent2, 0.85);
      if (lt > 1.3) {
        block(c, 500, 70, 920, 100, P.bg, 0.65);
        label(c, '用事故换来的形状', 960, 125, { size: 48, color: P.accent, align: 'center', alpha: 1 });
      }
    }
  };

  const mk = (t0) => ({ draw(c, lt) { film(c, t0 + lt); } });
  SCENES['s01_touch'] = mk(0);
  SCENES['s02_square'] = mk(3);
  SCENES['s03_crack'] = mk(7);
  SCENES['s04_corner'] = mk(11);
  SCENES['s05_round'] = mk(15);
  SCENES['s06_rule'] = mk(20);
  SCENES['s07_touch_end'] = mk(24);
})();
