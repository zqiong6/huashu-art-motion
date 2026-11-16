// 本片共用：chalk 色板工具、粉笔线、旅客的手（不出脸）
(() => {
  const P = {
    bg: '#23302B', surface: '#2E3D37', ink: '#F1EFE6', sub: '#A9B3AA',
    accent: '#F4D35E', accent2: '#E87D5A',
  };
  const jitter = (pts, amp = 1.6, seed = 1) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      const n = Math.sin((i + 1) * 12.9898 * seed) * 43758.5453;
      const f = n - Math.floor(n);
      out.push([x + (f - 0.5) * amp, y + (Math.sin(i * 1.7 + seed) * 0.5) * amp]);
    }
    return out;
  };
  const stroke = (c, pts, { color = P.ink, w = 5, alpha = 1, dash = null, join = 'round' } = {}) => {
    if (!pts || pts.length < 2) return;
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = color;
    c.lineWidth = w;
    c.lineJoin = join;
    c.lineCap = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.stroke();
    c.restore();
  };
  const fillPath = (c, pts, color, alpha = 1) => {
    if (!pts || pts.length < 3) return;
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
    c.fill();
    c.restore();
  };
  const rect = (x, y, w, h, r = 0, n = 64) => {
    if (r <= 0) {
      const pts = [];
      const steps = 16;
      for (let i = 0; i <= steps; i++) pts.push([x + (w * i) / steps, y]);
      for (let i = 1; i <= steps; i++) pts.push([x + w, y + (h * i) / steps]);
      for (let i = 1; i <= steps; i++) pts.push([x + w - (w * i) / steps, y + h]);
      for (let i = 1; i < steps; i++) pts.push([x, y + h - (h * i) / steps]);
      return pts;
    }
    const pts = [];
    const corners = [
      [x + r, y + r, Math.PI, Math.PI * 1.5],
      [x + w - r, y + r, Math.PI * 1.5, Math.PI * 2],
      [x + w - r, y + h - r, 0, Math.PI * 0.5],
      [x + r, y + h - r, Math.PI * 0.5, Math.PI],
    ];
    for (const [cx, cy, a0, a1] of corners) {
      for (let i = 0; i <= n / 4; i++) {
        const a = a0 + (a1 - a0) * (i / (n / 4));
        pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
    }
    return pts;
  };
  const label = (c, text, x, y, { size = 42, color = P.accent, align = 'left', alpha = 1 } = {}) => {
    if (!text) return;
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.font = `${size}px "LXGWWenKai-500", "PuHui-Medium", sans-serif`;
    c.textAlign = align;
    c.textBaseline = 'middle';
    c.fillText(text, x, y);
    c.restore();
  };
  const hand = (c, tx, ty, p = 1, { scale = 1, bob = 0 } = {}) => {
    const k = Math.max(0, Math.min(1, p));
    c.save();
    c.translate(tx + (1 - k) * 260 + Math.sin(bob) * 8, ty + (1 - k) * 200 + Math.cos(bob * 0.8) * 6);
    c.rotate(-0.55 + Math.sin(bob * 1.3) * 0.04);
    c.scale(scale, scale);
    fillPath(c, jitter([[40, 40], [240, 170], [205, 225], [5, 95]], 2.5, 2), '#D4B48A', 0.95);
    stroke(c, jitter([[40, 40], [240, 170], [205, 225], [5, 95], [40, 40]], 2.5, 2), { color: P.ink, w: 3.5, alpha: 0.55 });
    fillPath(c, jitter([[-10, -10], [60, -40], [105, 15], [75, 75], [15, 90], [-30, 50]], 2.5, 3), '#E2C49A', 0.98);
    stroke(c, jitter([[-10, -10], [60, -40], [105, 15], [75, 75], [15, 90], [-30, 50], [-10, -10]], 2.5, 3), { color: P.ink, w: 3.2, alpha: 0.65 });
    fillPath(c, jitter([[5, -5], [-70, -120], [-45, -138], [35, -25]], 2, 4), '#E2C49A', 0.98);
    stroke(c, jitter([[5, -5], [-70, -120], [-45, -138], [35, -25], [5, -5]], 2, 4), { color: P.ink, w: 3, alpha: 0.7 });
    c.beginPath();
    c.fillStyle = P.accent;
    c.arc(-62, -125, 9, 0, Math.PI * 2);
    c.fill();
    c.restore();
  };
  const arrow = (c, a, b, { color = P.accent2, w = 6, alpha = 1 } = {}) => {
    stroke(c, [a, b], { color, w, alpha });
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    stroke(c, [
      [b[0] - Math.cos(ang - 0.45) * 26, b[1] - Math.sin(ang - 0.45) * 26],
      b,
      [b[0] - Math.cos(ang + 0.45) * 26, b[1] - Math.sin(ang + 0.45) * 26],
    ], { color, w, alpha });
  };
  const bg = (c, t = 0) => {
    c.fillStyle = P.bg;
    c.fillRect(0, 0, 1920, 1080);
    c.save();
    c.fillStyle = P.ink;
    for (let i = 0; i < 80; i++) {
      const x = (i * 137 + t * 40) % 1920, y = (i * 89 + Math.sin(t + i) * 20) % 1080;
      c.globalAlpha = 0.05 + (i % 5) * 0.01;
      c.fillRect(x, y, 2 + (i % 3), 2);
    }
    c.restore();
  };
  const cam = (c, cx, cy, z, draw) => {
    c.save();
    c.translate(960, 540);
    c.scale(z, z);
    c.translate(-cx, -cy);
    draw();
    c.restore();
  };
  window.CHALK = { P, jitter, stroke, fillPath, rect, label, hand, arrow, bg, cam };
})();
