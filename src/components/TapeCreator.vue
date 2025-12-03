<script setup lang="ts">
import {nextTick, onMounted, onUpdated, ref} from "vue";

const emit = defineEmits(['create'])

const step = ref(0)
const selectedType = ref<'focus'|'rest'>('focus')
const inputDuration = ref<number | null>(null) // 改为 null 以显示 placeholder
const inputRef = ref<HTMLInputElement | null>(null)

function startCreate(){
  step.value = 1;
}

function selectType(type: 'focus' | 'rest'){
  selectedType.value = type
  step.value = 2;
  nextTick(() => inputRef.value?.focus())
}

function reset(){
  step.value = 0;
  inputDuration.value = null;
  selectedType.value = "focus"
}

function confirm(){
  const minutes = inputDuration.value;
  if(!minutes || minutes <= 0){
    reset()
    return
  }


  const labelText = selectedType.value === 'focus' ? 'Focus' : 'Rest'

  emit('create', {
    type: selectedType.value,
    duration: minutes * 60,
    label: `${minutes}:00 ${labelText}` // 保持和 DraggableTape 显示一致
  })
  reset()
}


</script>

<template>
  <div class="creator-shell" :class="{ 'active': step > 0 }" >

    <div v-if="step === 0" class="step-idle" @click="startCreate">
      <div class="plus-circle">
        <span class="plus-icon">+</span>
      </div>
      <span class="hint">New Timer</span>
    </div>

    <div v-else-if="step === 1" class="step-split">
      <div class="split-btn focus-side" @click="selectType('focus')">
        <span class="icon">⚡</span>
        <span>Focus</span>
      </div>
      <div class="split-btn rest-side" @click="selectType('rest')">
        <span class="icon">☕</span>
        <span>Rest</span>
      </div>
    </div>

    <div v-else-if="step === 2" class="step-input">
      <div class="input-label">
        {{ selectedType === 'focus' ? '专注时长 (min)' : '休息时长 (min)' }}
      </div>

      <div class="input-row">
        <input
            ref="inputRef"
            v-model="inputDuration"
            type="number"
            placeholder="0"
            @keyup.enter="confirm"
            @blur="reset"
        >
        <button class="ok-btn" @mousedown.prevent @click.stop="confirm">Add</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
*{
  box-sizing: border-box;

}
/* 外壳：浅色虚线框，模拟“空位” */
.creator-shell {
  background: rgba(255, 255, 255, 0.4);
  border: 2px dashed #C7C7CC; /* iOS 系统灰 */
  border-radius: 16px;
  min-height: 80px;
  margin-bottom: 15px;
  display: flex;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  user-select: none;
  -webkit-user-select: none;

}

.creator-shell:hover, .creator-shell.active {
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--ios-blue);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 阶段 0: 待机 */
.step-idle {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--ios-blue);
  width: 100%; /* 确保填满 */
}

.plus-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 122, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止图标被压扁 */
}

.plus-icon {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  color: var(--ios-blue);
}

.hint {
  font-size: 15px;
  font-weight: 500;
}

/* 阶段 1: 分裂按钮 */
.step-split {
  flex: 1;
  display: flex;
}

.split-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  gap: 4px;
  /* 防止文字换行撑开 */
  white-space: nowrap;
  overflow: hidden;
}

/* 左侧 Focus - 蓝色调 */
.focus-side {
  background: #EAF2FF;
  color: var(--ios-blue);
  border-right: 1px solid rgba(0,0,0,0.05);
}
.focus-side:hover {
  background: #D4E5FF;
}

/* 右侧 Rest - 绿色调 (iOS 风格通常用绿色代表休息/健康) */
.rest-side {
  background: #E8F8ED;
  color: var(--ios-green);
}
.rest-side:hover {
  background: #D1F0DA;
}

.icon { font-size: 20px; }

/* 阶段 2: 输入界面 */
.step-input {
  flex: 1;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%; /* 确保宽度正确 */
}

.input-label {
  font-size: 12px;
  color: var(--ios-text-secondary);
  margin-bottom: 8px;
  text-align: center;
}

.input-row {
  display: flex;
  gap: 8px;
  width: 100%; /* 占满容器宽度 */
}

input {
  flex: 1;
  background: #E5E5EA; /* 系统输入框灰 */
  border: none;
  color: #000;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 16px;
  text-align: center;
  outline: none;
  min-width: 0;
  user-select: text;
  -webkit-user-select: text;
}

input:focus {
  background: #D1D1D6;
}

/* 隐藏 input type=number 的上下箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.ok-btn {
  background: var(--ios-blue);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  padding: 0 16px;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.ok-btn:active {
  opacity: 0.7;
}
</style>

<style>
/* --- 深色模式适配 (Dark Mode) --- */

/* 1. 外壳：变暗，边框变淡 */
body.dark .creator-shell {
  background: rgba(0, 0, 0, 0.2); /* 深色半透明背景 */
  border-color: rgba(255, 255, 255, 0.15); /* 浅色虚线 */
}
body.dark .creator-shell:hover,
body.dark .creator-shell.active {
  background: rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
}

/* 2. 待机状态：图标和文字变亮 */
body.dark .plus-circle {
  background: rgba(255, 255, 255, 0.1); /* 圆圈变浅白 */
}
body.dark .plus-icon {
  color: rgba(255, 255, 255, 0.8); /* 加号变白 */
}
body.dark .step-idle .hint {
  color: rgba(255, 255, 255, 0.6); /* 提示文字变白 */
}

/* 3. 分裂按钮：调整背景色，使其在深底色上更协调 */
body.dark .focus-side {
  background: rgba(10, 132, 255, 0.15); /* 深空蓝背景 */
  color: #5E5CE6; /* 亮蓝色文字 */
  border-right-color: rgba(255, 255, 255, 0.1);
}
body.dark .focus-side:hover { background: rgba(10, 132, 255, 0.25); }

body.dark .rest-side {
  background: rgba(48, 209, 88, 0.15); /* 深林绿背景 */
  color: #30D158; /* 亮绿色文字 */
}
body.dark .rest-side:hover { background: rgba(48, 209, 88, 0.25); }

/* 4. 输入界面：文字变白，输入框变深 */
body.dark .input-label {
  color: rgba(255, 255, 255, 0.6);
}

body.dark .step-input input {
  background: rgba(0, 0, 0, 0.3); /* 输入框深黑背景 */
  color: #FFFFFF; /* 文字纯白 */
}
body.dark .step-input input:focus {
  background: rgba(0, 0, 0, 0.5);
}
</style>