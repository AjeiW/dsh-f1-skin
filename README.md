# dsh-f1-skin 🏁

*An F1 Race Control themed skin for the DeepSeek Harness Web UI.*

[![CI](https://github.com/frank-fan-818/dsh-f1-skin/actions/workflows/ci.yml/badge.svg)](https://github.com/frank-fan-818/dsh-f1-skin/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-15151a.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-0.1.1--rc.2-00a6a6.svg)](https://github.com/deepseek-ai/deepseek-harness)

> [!IMPORTANT]
> 这是一个**非官方、非商业的开源粉丝项目**，与 Formula 1、FIA、DeepSeek
> 或任何车队不存在隶属、赞助、认可或合作关系。Formula 1、F1、车队名称、
> 标志、赛车涂装及相关商业外观归各自权利人所有。代码采用 MIT；内嵌照片和
> 标志不因此转为 MIT，完整来源与再分发条件见
> [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

> **dsh-f1-skin 是给 DeepSeek Harness Web UI 写的一台「赛事控制中心」。**
>
> 它把 F1 的转播美学带进你的 AI 工作台：红牛、法拉利、迈凯伦、梅奔四支车队的完整主题，一键切换——每队拥有独立的品牌色、对比度文本、车队性格和专属赛车摄影背景，并完整跟随 DSH 的浅色 / 深色 / 跟随系统三档主题。
>
> 与普通换肤不同，它按「设计系统」而非「样式覆盖」来工作：背景场景、阅读材质、工作组件、真实运行状态、车队 DNA 被拆成五个独立层级——照片只负责气氛，文字可读性由局部材质保证，界面运行状态直接映射 DSH 真实的 `data-state`，**不做虚假的 LIVE 播报，也不遮挡任何宿主功能**。所有控制（车队选择、背景强度、文字衬底、模糊、动效）都住在 DSH 官方的「设置 → Formula One 车队」面板里，卸载即恢复原样。

仓库：[github.com/frank-fan-818/dsh-f1-skin](https://github.com/frank-fan-818/dsh-f1-skin)

## 实机画面

以下截图来自 DSH Web `0.1.1-rc.2`，背景强度 100%、文字衬底 84%、背景模糊
10px；图片没有脱离真实界面单独合成。

| Oracle Red Bull Racing | Scuderia Ferrari |
|---|---|
| ![Oracle Red Bull Racing 主题](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/redbull-desktop.png) | ![Scuderia Ferrari 主题](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/ferrari-desktop.png) |

| McLaren Racing | Mercedes-AMG Petronas Formula One Team |
|---|---|
| ![McLaren Racing 主题](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/mclaren-desktop.png) | ![Mercedes-AMG Petronas Formula One Team 主题](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/mercedes-desktop.png) |

原生设置页不会浮在输入框上方抢占宿主层级：

![Formula One 车队设置页](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/settings-panel.png)

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

### 0. 先安装 DSH CLI

本皮肤是 DSH Web 的插件，不能脱离 DSH 单独运行。请先安装 Node.js 20 或更高
版本，再全局安装与本皮肤兼容的 DSH CLI：

```powershell
npm install -g @deepseek-ai/dsh@0.1.1-rc.2
dsh --version
```

版本检查应输出 `0.1.1-rc.2`。如果 PowerShell 报错
`无法将“dsh”项识别为 cmdlet、函数、脚本文件或可运行程序的名称`，说明 CLI
尚未安装成功或 npm 全局目录不在 `PATH` 中。安装后请重新打开 PowerShell；仍然
无法识别时，运行 `npm config get prefix`，并把输出的目录加入用户 `PATH`。

> 如果 PowerShell 提示脚本执行策略禁止运行 `dsh.ps1`，可将下文命令中的
> `dsh` 临时改为 `dsh.cmd`。

### 方式一：npm（推荐）

```powershell
dsh plugin --profile web add dsh-f1-skin
```

### 方式二：GitHub 仓库

```powershell
dsh plugin --profile web add github:frank-fan-818/dsh-f1-skin
```

> 仓库已提交构建产物 `lib/client.js`，无需安装步骤里的 build 脚本。

### 方式三：下载源码 / ZIP 后本地链接

```powershell
# 在解压后的仓库目录执行
dsh plugin --profile web add link:.
# Windows 且路径含空格时，dsh 转发器会拆词，改用 pnpm 直装 + 手动 reconcile：
#   cd $DSH_HOME/profiles/web
#   pnpm add "link:D:\path\to\dsh-f1-skin"
#   node D:\path\to\dsh-f1-skin\scripts\reconcile-profile.mjs
```

安装后**重启 `dsh web`**，打开 http://127.0.0.1:3080；前往「设置 → Formula One 车队」切换车队和调节视觉强度。

### 更新

```bash
dsh plugin --profile web update dsh-f1-skin
```

## 卸载

```bash
dsh plugin --profile web remove dsh-f1-skin
```

## 发布（维护者）

### 第一次公开发布

npm 要求包已经存在，才能为它配置 Trusted Publisher。因此 `0.3.0` 首发需要
维护者在本机完成一次交互式发布（账号需开启 2FA）：

```bash
npm run quality
npm publish
```

确认 npm 页面出现 `dsh-f1-skin@0.3.0` 后，创建 `v0.3.0` 标签和同名 GitHub
Release。

### 后续版本

首发成功后，在 npm 包设置中添加 GitHub Actions Trusted Publisher：仓库
`frank-fan-818/dsh-f1-skin`、工作流 `release.yml`、Environment `npm`，并允许
`npm publish`。以后只需提升版本并发布对应 GitHub Release；工作流会验证标签，
通过 OIDC 发布且自动生成 provenance，不需要长期 `NPM_TOKEN`。如果该版本已经
由维护者手工发布，工作流会验证后安全跳过重复上传。

- npm 包只携带运行所需文件、README、LICENSE 和第三方声明；图片已内嵌进 bundle。
- 仓库内嵌的车队 logo 为官方商标素材，仅用于标识主题、不暗示隶属（见 `assets/team-logos/CREDITS.md`）；公开发布前请自行评估商标风险。
- 背景图为 Wikimedia Commons 的 CC BY-SA 4.0 摄影（署名见 `assets/cockpits/CREDITS.md`），构建时以 data URL 内嵌，运行时无外网依赖。

## 兼容性

| 项目 | 发布契约 |
|---|---|
| DeepSeek Harness Web | 针对 `0.1.1-rc.2` 的 CSS Module 选择器与设置 slot 验证 |
| Node.js | `>=20`；CI 覆盖 Node 20 / 22 / 24 |
| 浏览器 | Chromium 自动回归；无运行时网络字体、脚本或图片请求 |
| 视口 | 自动覆盖 1440 × 960 与 900 × 760；另含 760px / 480px 响应式降级 |
| 外观 | 浅色、深色、跟随系统；尊重 `prefers-reduced-motion` |

900px 紧凑模式会使用 DSH 原生折叠侧栏，并保留不拦截点击的竖排 HARNESS
铭牌：

![紧凑宽度下的 McLaren Racing 主题](https://raw.githubusercontent.com/frank-fan-818/dsh-f1-skin/master/docs/screenshots/compact-mclaren.png)

## 开发

```bash
npm install
npm run quality           # build + 结构契约 + npm tarball 内容/体积预算
npm run test:e2e          # 需要本机 http://127.0.0.1:3080 已运行 DSH Web
```

当前组件增强选择器针对 DSH Web `0.1.1-rc.2` 验证。升级 DSH 后请先运行 `npm run check`；安装了 DSH 开发包的机器会自动核对关键 CSS Module 选择器，失配时保留 Token 与背景并报告需要更新的组件契约。

- 改主题配色：编辑 `src/teams.mjs`（每队 `dark`/`light` palette seed、构图与性格参数），重新 build 后**刷新页面**即可。
- 改视觉系统：编辑 `src/styles/` 下按职责拆分的 CSS。
- 改交互逻辑：`src/plugin-fragment.js`。
- 换背景图：把新图片放到 `assets/cockpits/<team>-broadcast.jpg`（也支持 jpeg/png/webp/svg），补齐 `THIRD_PARTY_NOTICES.md` 后重新 build。

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
scripts/release-check.mjs # npm tarball 清单与体积预算
tests/e2e/              # 四队 × 桌面/紧凑视口浏览器回归
.github/workflows/      # CI 与 npm OIDC Release
```
