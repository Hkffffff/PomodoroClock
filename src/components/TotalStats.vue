<script setup lang="ts">
import { appStore } from '@/stores/appStore';
import { computed } from 'vue'

const store = appStore()

// 格式化函数：将秒转换为 "1h 20m" 或 "45m" 的格式
function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const focusText = computed(() => formatDuration(store.totalFocus))
const restText = computed(() => formatDuration(store.totalRest))
</script>

<template>
  <div class="stats-card">
    <div class="stat-item">
      <div class="icon-box focus">
        ⚡
      </div>
      <div class="info">
        <div class="label">Today Focus</div>
        <div class="value focus-color">{{ focusText }}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="stat-item">
      <div class="icon-box rest">
        ☕
      </div>
      <div class="info">
        <div class="label">Today &nbsp; &nbsp;&nbsp;Rest</div>
        <div class="value rest-color">{{ restText }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background: var(--ios-card);
  backdrop-filter: blur(20px);
  border-radius: 20px; /* 圆角稍微小一点，适配上方空间 */
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-around; /* 左右分布 */
  align-items: center;
  margin-bottom: 20px; /* 与下方的任务列表拉开距离 */
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.icon-box {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; justify-content: center; align-items: center;
  font-size: 20px;
}
.icon-box.focus { background: #FFF0E6; color: var(--ios-orange); }
.icon-box.rest { background: #E8F8ED; color: var(--ios-green); }

.info { display: flex; flex-direction: column; }
.label { font-size: 12px; color: var(--ios-text-secondary); font-weight: 500; text-transform: uppercase; }
.value { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }

.focus-color { color: var(--ios-text); }
.rest-color { color: var(--ios-text); }

.divider {
  width: 1px;
  height: 40px;
  background: rgba(0,0,0,0.05);
  margin: 0 10px;
}
</style>

<style>
body.dark .stats-card {
  /* 深邃的红橙调，带一点透明度 */
  background: rgba(65, 25, 15, 0.85) !important;

  /* 边框微调，泛一点红光 */
  border: 1px solid rgba(255, 100, 50, 0.1) !important;

  /* 可选：加一点暖色系的阴影 */
  box-shadow: 0 10px 30px rgba(40, 10, 5, 0.4) !important;
}
</style>