# dsh-f1-skin 🏁

F1 四车队赛车皮肤 —— DeepSeek Harness Web UI 的主题插件。

四套车队主题（红牛 / 法拉利 / 迈凯伦 / 梅奔），每队独立涂装座舱俯瞰图背景、深浅色双模式（跟随 DSH 系统的 浅色 / 深色 / 跟随系统 三档）、页面右侧悬浮圆点一键换队。

| 车队 | 品牌主色 | 辅助色 |
|---|---|---|
| 🔴 Red Bull 红牛 | `#FFC800` 红牛黄 | `#D90F0F` 红牛红 |
| 🟥 Ferrari 法拉利 | `#DC0000` 法拉利红 | `#FFF200` 摩德纳黄 |
| 🟠 McLaren 迈凯伦 | `#FF8000` 木瓜橙 | `#47C7FC` 迈凯伦蓝 |
| 🟢 Mercedes 梅奔 | `#00D2BE` 石油绿 | `#B4B5B7` 梅奔银 |

## 特性

- **座舱背景**：全页固定座舱俯瞰图，深色模式=夜赛座舱（压暗渐变保证可读性），浅色模式=银石白天（提亮滤镜）；切换车队时 450ms 淡入淡出（`prefers-reduced-motion` 下关闭）。
- **主题 token**：覆盖 DSH 全部 79 个 `--dsw-alias-*` / `--dsw-specific-sidebar-fill` 设计变量，通过 `theme.overrideTokens` 叠加——官方外观三档开关照常工作。
- **赛车细节**：窗口顶缘格子旗条、碳纤维编织纹理、Titillium Web 标题字体、车队色 `::selection` 与焦点环、P 房指示灯风格的右缘换队 rail。
- **记忆**：车队选择存入 `localStorage`（键 `dsh-f1-skin:team`），刷新后保持。

## 安装

```bash
# 在插件仓库目录执行
dsh plugin --profile web add link:.
# 或（Windows 路径含空格时 dsh 转发器会拆词，改用 pnpm 直装 + 手动 reconcile）:
#   cd $DSH_HOME/profiles/web
#   pnpm add "link:D:\Programming Projects\dsh-f1-skin"
#   node D:\Programming Projects\dsh-f1-skin\scripts\reconcile-profile.mjs
```

重启 `dsh web` 后打开 http://127.0.0.1:3080 即可看到皮肤；右侧四个圆点切换车队。

## 卸载

```bash
dsh plugin --profile web remove dsh-f1-skin
```

## 开发

```bash
node scripts/build.mjs    # 组装 lib/client.js（内嵌座舱图 + 插件逻辑）
node scripts/check.mjs    # 校验 token 完整性 / CSS / bundle 格式
```

- 改主题配色：编辑 `src/teams.mjs`（每队 `dark`/`light` 两个 palette seed + `tint`/`onBrand`），重新 build 后**刷新页面**即可（bundle 内容无需重启服务）。
- 改特效 CSS：`src/teams.mjs` 里的 `F1_CSS`。
- 改交互逻辑：`src/plugin-fragment.js`。
- 换背景图：把新图片放到 `assets/cockpits/<team>.jpg`（任意 jpg/png/webp/svg 均可，按扩展名自动选择），重新 build。

> 说明：座舱图为 Wikimedia Commons 的 CC 授权照片（署名清单见 [assets/cockpits/CREDITS.md](assets/cockpits/CREDITS.md)），已压缩到 ≤420KB/张内嵌；`assets/cockpits/*.svg` 为程序绘制的备用占位图。

## 结构

```
cordis.patch.yml        # bundle patch：插入 dsh.client 行
lib/index.js            # Node 半边（空插件）
lib/client.js           # 客户端 bundle（构建产物，web2 惰性 CJS 格式）
src/teams.mjs           # 79 token 生成器 + 四队配色 + F1 CSS
src/plugin-fragment.js  # 客户端插件逻辑（切换器 / 背景 / 深浅同步）
scripts/build.mjs       # 组装 lib/client.js
scripts/check.mjs       # 校验
```
