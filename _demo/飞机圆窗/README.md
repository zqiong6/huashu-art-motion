# 演示：为什么飞机窗户是圆的

无声预览片，验证 huashu-art-motion 画面链路（镜头表 → scenes → 渲染 → film_gate → deliver）。

## 产物

- `output/成片.mp4` — 28s，1920×1080@30，`deliver.py` 绿灯
- `output/交付说明.md`
- `文稿.txt` / `镜头表.md`
- `film/` — 本片 eras 与 scenes（不整包拷贝引擎）

## 重渲

```sh
# 在 skill 仓库根目录
cp _demo/飞机圆窗/film/eras.js scripts/engine/eras.js
cp _demo/飞机圆窗/film/scenes/_chalk.js _demo/飞机圆窗/film/scenes/_all.js scripts/engine/scenes/
cd scripts/engine
uv run --with playwright python render.py --out ../../_demo/飞机圆窗/成片/成片.mp4 --fps 30
cd ../..
uv run scripts/deliver.py _demo/飞机圆窗/成片/成片.mp4 --root _demo/飞机圆窗 --out _demo/飞机圆窗/output
```

画风：黑板粉笔（色板 `chalk`）；角色只出手；未配音。
