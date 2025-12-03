<script setup lang="ts">
import TapeRack from "./components/TapeRack.vue";
import CassettePlayer from "./components/CassettePlayer.vue";
import TodoList from "./components/TodoList.vue";
import TotalStats from "@/components/TotalStats.vue";
import { appStore } from '@/stores/appStore';
import AppTitleBar from "./components/AppTitleBar.vue";

const store = appStore()
</script>

<template>
  <div class="ios-desktop">
    <AppTitleBar />
    <div class="app-container">
      <header class="header">
        <h1>Pomodoro<span class="bold">Clock</span></h1>
        <button class="theme-btn" @click="store.toggleTheme()" title="切换模式">
          {{ store.isDark ? '🌙' : '☀️' }}
        </button>
      </header>

      <div class="layout-grid">
        <aside class="panel left" >
          <TapeRack />
        </aside>

        <main class="panel center">
          <CassettePlayer />
        </main>

        <aside class="panel right" >
          <div class="right-top">
            <TotalStats />
          </div>
          <div class="divide"></div>



          <div class="todo-wrapper">
            <TodoList />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 让标题和按钮分居左右 */
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  /* 去掉原来的 margin-bottom，因为父容器 flex 已经处理了布局 */
  margin: 0;
}

/* 切换按钮样式 */
.theme-btn {
  background: var(--ios-card); /* 使用毛玻璃背景 */
  backdrop-filter: blur(10px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.theme-btn:hover {
  transform: scale(1.1);
  background: var(--ios-white); /* 这里的变量会自动随主题变化 */
}

.ios-desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--ios-bg);

  /* 👇👇👇 新增：改为垂直 Flex 布局 👇👇👇 */
  display: flex;
  flex-direction: column;
}

.divide{
  height:20px;
}

/* 模拟 iOS 壁纸的光斑效果 */
.wallpaper-blur {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  z-index: 0;
}

/* 👇👇👇 修改这里：增加类名前缀，防止污染 panel 👇👇👇 */
.left {
  top: -100px;
  left: -100px;
  background: #d4eaff;
  border-radius: var(--radius-lg);
}



.right-top{
  background: #ffe4cc;
  border-radius: var(--radius-lg);
  height:100px;
}

.right {
  bottom: -100px;
  right: -100px;
  border:none;
}

.center{
  background: linear-gradient(
      to right,
      rgba(212, 234, 255),
      rgba(255, 228, 204)
  );
  border:none;
  border-radius: var(--radius-lg);
}

.app-container {
  position: relative;
  z-index: 1;

  /* ❌ 删除这一行: height: 100%; */

  /* ✅ 新增这一行：让它占满剩余垂直空间 */
  flex: 1;

  display: flex;
  flex-direction: column;

  /* 👇 确保 padding 设置正确：上0，左右40，下20 */
  padding: 0 40px 20px 40px;

  box-sizing: border-box;
  /* 确保溢出隐藏，交给内部容器滚动 */
  overflow: hidden;
}

.header h1 {
  font-size: 24px;
  font-weight: 300;
  margin: 0 0 20px 0;
  color: var(--ios-text);
}
.bold { font-weight: 700; }

.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 24px;
  /* 👇 确保 Grid 本身占满剩余高度，不要超过屏幕 */
  flex: 1;
  height: 100%;
  min-height: 0; /* 关键：防止 grid item 溢出 */
}

.panel {
  display: flex;
  flex-direction: column;
  /* 👇👇👇 新增这两行：核心修复 👇👇👇 */
  height: 100%;      /* 强制高度填满 Grid 单元格 */
  overflow: hidden;  /* 防止容器被子元素撑大，强制子元素内部滚动 */
}

/* 👇 3. 确保 TodoList 能够正确滚动 */
.todo-wrapper {
  flex: 1;
  min-height: 0; /* 关键：允许 flex 子项内部滚动 */
  display: flex;
  flex-direction: column;
  background: #ffe4cc;
  border-radius: var(--radius-lg);
}
</style>

