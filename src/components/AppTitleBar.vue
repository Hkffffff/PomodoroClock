<script setup lang="ts">
type WindowAPI = {
  minimize: () => void
  maximize: () => void
  close: () => void
}

const windowWithAPI = window as Window & { windowAPI?: WindowAPI }

function minimize() {
  if (windowWithAPI.windowAPI) {
    windowWithAPI.windowAPI.minimize()
  }
}

function maximize() {
  windowWithAPI.windowAPI?.maximize()
}

function closeApp() {
  windowWithAPI.windowAPI?.close()
}

</script>

<template>
  <div class="custom-title-bar">
    <div class="title-drag-region"></div>

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
.custom-title-bar {
  height: 40px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 9999;
  color: var(--ios-text);
}

.title-drag-region {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  -webkit-app-region: drag;
}

.window-controls {
  display: flex;
  height: 100%;
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

.control-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--ios-text);
}

:global(.dark) .control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.close-btn:hover {
  background: #E81123 !important;
  color: white !important;
}
</style>
