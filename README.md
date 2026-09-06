# PomodoroClock

一个基于 `Vue 3 + Vite + Electron` 的番茄钟桌面应用，界面采用卡带播放器风格，支持番茄钟计时、任务管理、统计和主题切换。

## 项目结构

- `src/main.js`：前端入口，挂载 `Vue` 应用和 `Pinia`
- `src/App.vue`：主布局，组合顶部栏、计时器、统计和待办区域
- `src/components/`：界面组件目录
  - `CassettePlayer.vue`：番茄钟主计时器
  - `TapeRack.vue`、`DraggableTape.vue`、`TapeCreator.vue`：任务/计时器卡带交互
  - `TodoList.vue`、`TodoItem.vue`：待办任务列表
  - `TotalStats.vue`：统计面板
  - `AppTitleBar.vue`：自定义窗口标题栏
- `src/stores/appStore.js`：应用状态管理，包含计时、任务、主题和本地存储逻辑
- `src/assets/`：提示音等静态资源
- `public/`：应用图标等静态文件
- `electron/`：Electron 主进程与预加载脚本
- `dist/`：前端构建输出
- `release/`：Electron 打包产物输出目录

## 技术栈

- `Vue 3`
- `Pinia`
- `Vite`
- `Electron`

## 常用脚本

```bash
npm install
npm run dev
npm run build
npm run preview
npm run electron:dev
npm run electron:build
```

## 开发说明

- 前端开发模式使用 Vite 本地服务。
- Electron 开发模式会连接本地开发服务器。
- 任务和部分状态会持久化到 `localStorage`。

