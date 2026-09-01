# dsh-f1-skin 🏁

F1 Race Control Workspace —— DeepSeek Harness Web UI 的四车队设计系统皮肤。

四套车队主题（红牛 / 法拉利 / 迈凯伦 / 梅奔），每队使用对应的 2024 F1 赛车动态摄影背景。皮肤把背景场景、阅读材质、工作组件、真实运行状态和车队性格拆成独立层级，并继续跟随 DSH 的浅色 / 深色 / 跟随系统三档。

| 车队 | 品牌主色 | 辅助色 |
|---|---|---|
| 🔴 Red Bull 红牛 | `#FFC800` 红牛黄 | `#D90F0F` 红牛红 |
| 🟥 Ferrari 法拉利 | `#DC0000` 法拉利红 | `#FFF200` 摩德纳黄 |
| 🟠 McLaren 迈凯伦 | `#FF8000` 木瓜橙 | `#47C7FC` 迈凯伦蓝 |
| 🟢 Mercedes 梅奔 | `#00D2BE` 石油绿 | `#B4B5B7` 梅奔银 |

## 特性

- **照片优先**：赛车摄影是独立场景层；导航、输入、代码和工具结果分别使用局部材质，不再以全局暗幕牺牲背景。
- **主题 token**：覆盖 DSH 全部 79 个 `--dsw-alias-*` / `--dsw-specific-sidebar-fill` 设计变量，通过 `theme.overrideTokens` 叠加——官方外观三档开关照常工作。
- **组件语言**：输入框、消息、推理、工具调用、代码块、菜单和弹层共用精密边线、数据字体和局部状态条。
- **真实状态**：直接使用 DSH 的 `data-state` 表现运行、完成和错误，不显示虚假的 `LIVE` 或 `TEAM RADIO`。
- **原生 F1 设置页**：通过 DSH 官方 `settings.section` slot 切换车队，并调整照片强度、文字衬底、模糊和动效；不会悬浮遮挡对话或宿主功能。
- **记忆**：车队和视觉参数保存在本机 `localStorage`，刷新后保持。

## 安装

### 方式一：npm（推荐，发布后可用）

```bash
dsh plugin --profile web add dsh-f1-skin
```

### 方式二：GitHub 仓库

```bash
dsh plugin --profile web add github:<owner>/dsh-f1-skin
```

> 仓库已提交构建产物 `lib/client.js`，无需安装步骤里的 build 脚本。

### 方式三：下载源码 / ZIP 后本地链接

```bash
# 在解压后的仓库目录执行
dsh plugin --profile web add link:.
# Windows 且路径含空格时，dsh 转发器会拆词，改用 pnpm 直装 + 手动 reconcile：
#   cd $DSH_HOME/profiles/web
#   pnpm add "link:D:\path\to\dsh-f1-skin"
#   node D:\path\to\dsh-f1-skin\scripts\reconcile-profile.mjs
```

安装后**重启 `dsh web`**，打开 http://127.0.0.1:3080；前往「设置 → Formula One 车队」切换车队和调节视觉强度。

## 卸载

```bash
dsh plugin --profile web remove dsh-f1-skin
```

## 发布（维护者）

```bash
npm publish            # 发布前会自动执行 build + check（prepublishOnly）
```

- npm 包只携带运行所需文件（`lib/` + `cordis.patch.yml`），图片已内嵌进 bundle。
- 仓库内嵌的车队 logo 为官方商标素材，仅用于标识主题、不暗示隶属（见 `assets/team-logos/CREDITS.md`）；公开发布前请自行评估商标风险。
- 背景图为 Wikimedia Commons 的 CC BY-SA 4.0 摄影（署名见 `assets/cockpits/CREDITS.md`），构建时以 data URL 内嵌，运行时无外网依赖。

## 开发

```bash
node scripts/build.mjs    # 组装 lib/client.js（内嵌赛车图 + 插件逻辑）
node scripts/check.mjs    # 校验 token 完整性 / CSS / bundle 格式
```

当前组件增强选择器针对 DSH Web `0.1.1-rc.2` 验证。升级 DSH 后请先运行 `npm run check`；安装了 DSH 开发包的机器会自动核对关键 CSS Module 选择器，失配时保留 Token 与背景并报告需要更新的组件契约。

- 改主题配色：编辑 `src/teams.mjs`（每队 `dark`/`light` palette seed、构图与性格参数），重新 build 后**刷新页面**即可。
- 改视觉系统：编辑 `src/styles/` 下按职责拆分的 CSS。
- 改交互逻辑：`src/plugin-fragment.js`。
- 换背景图：把新图片放到 `assets/cockpits/<team>-broadcast.jpg`（也支持 jpeg/png/webp/svg；没有 broadcast 文件时回退到 `<team>.<ext>`），重新 build。

> 说明：赛车图为 Wikimedia Commons 的 CC 授权照片（署名清单见 [assets/cockpits/CREDITS.md](assets/cockpits/CREDITS.md)），构建时以 data URL 内嵌。

## 结构

```
cordis.patch.yml        # bundle patch：插入 dsh.client 行
lib/index.js            # Node 半边（空插件）
lib/client.js           # 客户端 bundle（构建产物，web2 惰性 CJS 格式）
src/teams.mjs           # 79 token 生成器 + 四队配色与构图数据
src/styles/*.css        # 背景 / 安全材质 / 对话点缀 / 原生设置页 / 车队 / 响应式
src/plugin-fragment.js  # 客户端生命周期、settings.section、设置与深浅同步
scripts/build.mjs       # 组装 lib/client.js
scripts/check.mjs       # 校验
```
