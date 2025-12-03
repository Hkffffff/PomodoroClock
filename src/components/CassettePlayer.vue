<script setup lang="ts">
import { appStore } from '@/stores/appStore';
import {computed} from "vue";

const store=appStore();

const radius = 178 // 半径 (容器380/2 - 边框一半12)
const circumference = 2 * Math.PI * radius // 周长 ≈ 1118

// 计算进度条的偏移量 (核心逻辑)
const dashOffset = computed(() => {
  // 1. 如果没有任务在跑，显示完整的圆环 (偏移量为 0)
  if (!store.activeTimer) return 0

  // 2. 计算剩余时间的比例 (0.0 ~ 1.0)
  const total = store.activeTimer.initial
  const current = store.activeTimer.duration
  const percentage = current / total

  // 3. 计算偏移量
  // 原理：总长是 C。
  // 我们想要显示的长度是 C * percentage。
  // SVG 的 dashoffset 是指“隐藏掉多少”。
  // 所以需要隐藏的长度 = 总长 * (1 - 比例)
  return circumference * (1 - percentage)
})

const formattedTime=computed(() => {
  if(!store.activeTimer) return '00:00'
  const m = Math.floor(store.activeTimer.duration / 60).toString().padStart(2, '0')
  const s = (store.activeTimer.duration % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

function onDrop(event,slotType){
  const payloadStr=event.dataTransfer.getData('application/json');
  if(payloadStr){
    const payload = JSON.parse(payloadStr);
    // console.log('received',payload);
    if(slotType==='top'&&payload.type==='timer'){
      store.insertTimer(payload.data)
    }
    if(slotType==='bottom'&&payload.type==='todo'){
      store.insertTodo(payload.data.id)
    }
  }
}

const activeTab = computed(()=>{
  if(!store.activeTimer) return null
  if(store.activeTimer.type==='focus') return 'focus'
  if(store.activeTimer.type==='rest' ) return 'rest'
  return null
})
</script>

<template>
  <div class="glass-player" :class="{ 'dark': store.isDark }">

    <div class="segment-control">
      <div class="segment" :class="{active: activeTab === 'focus'}">专注</div>
      <div class="segment" :class="{active: activeTab === 'rest'}">休息</div>
    </div>

    <div class="clock-face">
      <svg class="progress-ring" width="380" height="380" viewBox="0 0 380 380">
        <circle
            class="ring-circle"
            cx="190"
            cy="190"
            r="178"
            fill="none"
            stroke-width="24"
            stroke-linecap="round"
            :style="{
        strokeDasharray: circumference,
        strokeDashoffset: dashOffset
      }"
        />
      </svg>

      <div class="inner-content">
        <div
            class="drop-zone top"
            @dragover.prevent
            @drop="onDrop($event, 'top')"
            @click="store.activeTimer && store.eject('timer')"
        >
          <div class="time-display">{{ formattedTime }}</div>
          <div v-if="!store.activeTimer" class="placeholder">拖入时间</div>
        </div>

        <div
            class="drop-zone bottom"
            @dragover.prevent
            @drop="onDrop($event, 'bottom')"
            @click="store.currentTodo && store.eject('todo')"
        >
          <div class="task-pill" :class="{active: store.currentTodo}">
            {{ store.currentTodo ? store.currentTodo.title : '拖入任务' }}
          </div>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <button
          class="circle-btn play"
          @click="store.isPlaying ? store.pause() : store.start()"
          :disabled="!store.activeTimer"
      >
        <span v-if="store.isPlaying">❚❚</span>
        <span v-else>▶</span>
      </button>

      <button
          class="circle-btn stop"
          @click="store.stop()"
          :disabled="!store.activeTimer"
      >
        ■
      </button>
    </div>

  </div>
</template>

<style scoped>
/* 外壳：智能背景切换 */
.glass-player {
  /* 默认（浅色模式）：保留清新的蓝橙渐变 */
  background: linear-gradient(
      to right,
      rgba(212, 234, 255, 0.6),
      rgba(255, 228, 204, 0.6)
  );

  backdrop-filter: blur(20px);
  border-radius: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;

  /* 浅色模式下的阴影和边框 */
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.6);

  box-sizing: border-box;
  justify-content: space-between;
  /* 添加 transition 让切换更丝滑 */
  transition: all 0.3s ease;
}

/* 👇👇👇 新增：深色模式覆盖样式 (写在 scoped 内部) 👇👇👇 */
.glass-player {
  /* 默认（浅色模式）：保留清新的蓝橙渐变 */
  background: linear-gradient(
      to right,
      rgba(212, 234, 255, 0.6),
      rgba(255, 228, 204, 0.6)
  );

  backdrop-filter: blur(20px);
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;

  /* 浅色模式下的阴影和边框 */
  box-shadow: var(--shadow-md);
  border: 1px rgba(255, 255, 255, 0.6);

  box-sizing: border-box;
  justify-content: space-between;
  /* 添加 transition 让切换更丝滑 */
  transition: all 0.3s ease;
}

/* 👇👇👇 深色模式适配：匹配左右侧面板风格 👇👇👇 */
:global(.dark) .glass-player {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  background: linear-gradient(
      to right,
      rgba(212, 234, 255),
      rgba(255, 228, 204)
  ) !important;


  border-color: black;

  /* 稍微加重阴影，制造悬浮感 */

}

/* ... 这里的 svg 圆环颜色适配保持不变 ... */
:global(.dark) .ring-circle {
  stroke: rgba(255, 255, 255, 0.15) !important;
}
/* 分段控制器 */
.segment-control {
  background: rgba(118, 118, 128, 0.12);
  padding: 4px;
  border-radius: 12px;
  display: flex;
  flex-shrink: 0;
}
.segment {
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  color: var(--ios-text);
  opacity: 0.5;
  transition: all 0.3s;
  cursor: pointer;
}
.segment.active {
  background: var(--ios-white);
  opacity: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

/* --- 表盘区域 --- */
.clock-face {
  position: relative;
  width: 380px;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto 0;
}

/* SVG 进度条相关 */
.progress-ring {
  position: absolute;
  top: 0; left: 0;
  transform: rotate(-90deg);
  pointer-events: none;
  filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));
}

.ring-circle {
  transition: stroke-dashoffset 1s linear;
  stroke: rgba(255, 255, 255, 0.6);
}

.inner-content {
  z-index: 10;
  text-align: center;
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  padding-top: 70px;
  box-sizing: border-box;
}

/* 插槽区域 */
.drop-zone {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; cursor: pointer; transition: transform 0.2s;
}
.drop-zone:hover { transform: scale(1.02); }

.top { justify-content: flex-end; padding-bottom: 10px; }
.bottom { justify-content: flex-start; padding-top: 10px; }

/* 时间字体 */
.time-display {
  font-size: 110px;
  font-weight: 600;
  font-feature-settings: "tnum";
  color: var(--ios-text);
  line-height: 1;
  letter-spacing: -2px;
  text-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.placeholder {
  font-size: 16px;
  color: var(--ios-text-secondary);
  font-weight: 500;
  margin-bottom: 20px;
}

/* 任务胶囊 */
.task-pill {
  font-size: 16px;
  color: var(--ios-text-secondary);
  background: rgba(118, 118, 128, 0.12);
  padding: 10px 24px;
  border-radius: 20px;
  max-width: 240px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: all 0.3s;
  margin-top: 5px;
}
.task-pill.active {
  background: rgba(0, 122, 255, 0.15);
  color: var(--ios-blue);
  font-weight: 600;
  box-shadow: none;
}

/* 底部按钮 */
.action-bar { display: flex; gap: 40px; margin-bottom: 10px; flex-shrink: 0; }

.circle-btn {
  width: 80px; height: 80px; border-radius: 50%; font-size: 28px;
  display: flex; justify-content: center; align-items: center;
  transition: all 0.2s; border: none; cursor: pointer;
}

.play {
  background: var(--ios-orange);
  color: #fff;
  box-shadow: 0 10px 25px rgba(255, 149, 0, 0.4);
}
.play:active { transform: scale(0.9); }

.stop {
  background: var(--ios-white);
  color: var(--ios-text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.stop:active { transform: scale(0.9); opacity: 0.8; }

.circle-btn:disabled {
  opacity: 0.3; cursor: not-allowed; box-shadow: none;
  background: rgba(118, 118, 128, 0.12);
}


</style>

<style>
body.dark .glass-player {
  /* 1. 强制覆盖背景为深色变量 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;

    background: linear-gradient(
        to right,
        rgba(15, 35, 65, 0.85),
        rgba(65, 25, 15, 0.85)
    ) !important;

    /* 边框调暗，融入黑底 */
    border-color: rgba(255, 255, 255, 0.15);

    /* 稍微加重阴影，制造悬浮感 */

}
</style>

