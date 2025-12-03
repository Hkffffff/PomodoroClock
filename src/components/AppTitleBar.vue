<script setup lang="ts">
import {ref} from "vue";

const appLogo =ref('/PomodoroClock.png')
// 调用预加载脚本暴露的 API
function minimize() {
  console.log('Vue: 点击了最小化按钮'); // 👈 加这个日志
  // @ts-ignore
  if (window.windowAPI) {
    window.windowAPI.minimize()
      } else {
        console.error('Vue: windowAPI 未找到，预加载脚本可能加载失败');
      }
}

// 其他两个函数也加上类似的日志...
function maximize() {
  console.log('Vue: 点击了最大化按钮');
  // @ts-ignore
  window.windowAPI?.maximize()
}

function closeApp() {
  console.log('Vue: 点击了关闭按钮');
  // @ts-ignore
  window.windowAPI?.close()
}

</script>

<template>
  <div class="custom-title-bar">
    <div class="title-drag-region">
<!--      <img :src="appLogo" alt="App Logo" class="app-logo" />-->
    </div>

    <div class="window-controls no-drag">
      <button class="control-btn min-btn" @click="minimize" title="最小化">
        ─
      </button>
      <button class="control-btn max-btn" @click="maximize" title="最大化">
        ☐
      </button>
      <button class="control-btn close-btn" @click="closeApp" title="关闭">
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.app-logo {
  /* 设置合适的大小，标题栏高 40px，图标建议 24px-32px 之间 */
  width: 28px;
  height: 28px;
  /* 保持和原来文字一样的左边距 */
  margin-left: 16px;
  /* 防止图片变形 */
  object-fit: contain;
  /* 确保鼠标在图标上时也能拖动窗口 */
  -webkit-app-region: drag;
}

.custom-title-bar {
  height: 40px; /* 自定义标题栏高度 */
  background: transparent; /* 可以设置背景色，或者透明让它融入 header */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 9999;
  /* 适配深色模式的文字颜色 */
  color: var(--ios-text);
}

/* 👇👇👇 关键 CSS：设置可拖拽区域 👇👇👇 */
.title-drag-region {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  /* 告诉 Electron 这个区域可以用来拖动窗口 */
  -webkit-app-region: drag;
}

.window-controls {
  display: flex;
  height: 100%;
  /* 👇👇👇 关键 CSS：按钮区域不能拖拽，否则无法点击 👇👇👇 */
  -webkit-app-region: no-drag;
}

.control-btn {
  width: 46px;
  height: 100%;
  border: none;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--ios-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

/* 鼠标悬停效果 */
.control-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--ios-text);
}

/* 深色模式悬停适配 */
:global(.dark) .control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 关闭按钮特殊样式 */
.close-btn:hover {
  background: #E81123 !important;
  color: white !important;
}
</style>