<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import { appStore } from '@/stores/appStore';

const store = appStore()
const props = defineProps<{ todo : any }>()

const isEditing = ref(false)

const editTitle = ref(null)
const editFocus = ref(0) // 单位：分钟
const editRest = ref(0)  // 单位：分钟
const editTarget = ref(0) // 单位：分钟



const isRunningMe = computed(() => {
  return store.currentTodo && store.currentTodo.id === props.todo.id && store.activeTimer
})

//进度控制
const progressPercent = computed(() => {
  if(!isRunningMe.value) return 0
  const total = store.activeTimer.initial
  const current = store.activeTimer.duration
  return ((total - current)/total) * 100
})

const fmt=(sec:number)=>Math.floor(sec/60) + 'm'

function startEdit(){
  editTitle.value = props.todo.title
  editTarget.value = props.todo.targetMinutes || 0
  isEditing.value = true
}

function save(){
  store.updateTodo({
    id: props.todo.id,
    title: editTitle.value,
    focusTime: editFocus.value * 60, // 转回秒存入
    restTime: editRest.value * 60,
    targetMinutes: editTarget.value
  })
  isEditing.value = false
}

function remove() {
  if(confirm('确认删除此任务？')) {
    store.deleteTodo(props.todo.id)
  }
}

function onDragStart(event: DragEvent) {
  if (isEditing.value) {
    event.preventDefault()
    return
  }
  const payload = JSON.stringify({ type: 'todo', data: { id: props.todo.id } })
  event.dataTransfer?.setData('application/json', payload)
}


</script>

<template>
<div
  class="todo-cell"
  :class="{ 'active-task': isRunningMe, 'editing': isEditing }"
  draggable="true"
  @dragstart="onDragStart"
>
  <div class="progress-bg" :style="{width:progressPercent + '%'}"></div>
  <div v-if="isEditing" class="edit-mode">
    <input v-model="editTitle" placeholder="Mission..." class="edit-title">
    <div class="edit-row">
      <label>专注(m):<input v-model="editTarget" type="number" class="mini-input"></label>
      <label>已做(m):<input v-model="editFocus" type="number" class="mini-input"></label>
    </div>
    <div class="edit-actions">
      <button class="save-btn" @click.stop="save">保存</button>
      <button class="cancel-btn" @click.stop="isEditing = false">取消</button>
      <button class="del-btn" @click.stop="remove">删除</button>
    </div>
  </div>

  <div class="view-mode">
    <div class="circle-check" :class="{running : isRunningMe}"></div>

    <div class="cell-content">
      <div class="cell-header">
        <span class="cell-title">{{todo.title}}</span>
        <button v-if="!isEditing" class="edit-icon" @click.stop="startEdit">✎</button>
      </div>

      <div class="cell-meta">
        <span class="tag target" v-if="todo.targetMinutes">
          🎯 目标 {{ todo.targetMinutes }}m
        </span>
        <span class="tag focus" v-if="todo.focusTime > 0">
          🔥 {{ fmt(todo.focusTime) }}
        </span>
        <span class="tag rest" v-if="todo.restTime > 0">
          ☕ {{ fmt(todo.restTime) }}
        </span>
      </div>
    </div>

<!--    <div class="drag-icon">≡</div>-->
  </div>
</div>
</template>

<style scoped>
.todo-cell {
  position: relative;
  /* 👇 修改 1: 使用变量，而不是死板的 #fff */
  background: var(--ios-card);
  backdrop-filter: blur(20px); /* 加上毛玻璃效果 */

  padding: 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  cursor: grab;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all 0.2s;

  /* 确保文字颜色跟随主题 */
  color: var(--ios-text);
}

.todo-cell:hover {
  transform: translateY(-1px);
  /* 👇 修改 2: 悬停时变为高亮背景色 */
  background: var(--ios-white);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.todo-cell.active-task {
  border-color: var(--ios-blue);
  /* 👇 修改 3: 激活背景色改为半透明，适配深色模式 */
  background: rgba(0, 122, 255, 0.1);
}

.todo-cell.editing {
  cursor: default;
  /* 编辑模式背景也跟随变量 */
  background: var(--ios-white);
  border-color: var(--ios-text-secondary);
}

/* 进度条 */
.progress-bg {
  position: absolute; left: 0; top: 0; bottom: 0;
  /* 进度条保持半透明蓝色即可，深色模式下依然清晰 */
  background: rgba(0, 122, 255, 0.15);
  transition: width 1s linear;
  pointer-events: none;
  z-index: 0;
}

/* 展示模式布局 */
.view-mode { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }

/* 圆圈打勾框 */
.circle-check {
  width: 20px; height: 20px;
  /* 边框颜色改为变量，或者是半透明 */
  border: 2px solid var(--ios-text-secondary);
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.5;
}
.circle-check.running {
  border-color: var(--ios-blue);
  border-width: 5px;
  opacity: 1;
}

.cell-content { flex: 1; min-width: 0; }
.cell-header { display: flex; justify-content: space-between; align-items: center; }
.cell-title {
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  color: var(--ios-text); /* 确保标题文字变色 */
}

/* 悬停按钮组 */
.actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
.todo-cell:hover .actions { opacity: 1; }

.icon-btn {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; justify-content: center; align-items: center;
  font-size: 14px;
  /* 按钮背景改为半透明，适配黑底 */
  background: rgba(120, 120, 128, 0.12);
  color: var(--ios-text-secondary);
  border: none; cursor: pointer; transition: all 0.2s;
}
.icon-btn:hover {
  background: rgba(120, 120, 128, 0.24);
  color: var(--ios-text);
}
.del:hover { background: #FF3B30; color: white; }

/* 标签样式适配 */
.cell-meta { display: flex; gap: 6px; margin-top: 4px; font-size: 11px; flex-wrap: wrap; }
.tag { padding: 2px 6px; border-radius: 4px; font-weight: 500; }

/* 使用半透明背景色，这样在深色模式下不会显得太突兀 */
.tag.focus { background: rgba(255, 149, 0, 0.15); color: var(--ios-orange); }
.tag.rest { background: rgba(52, 199, 89, 0.15); color: var(--ios-green); }
.tag.target { background: rgba(0, 122, 255, 0.15); color: var(--ios-blue); }

.drag-icon { color: var(--ios-text-secondary); font-size: 20px; opacity: 0.5; }

/* --- 编辑模式布局 --- */
.edit-mode { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 8px; }

/* 输入框适配 */
.edit-title {
  width: 100%;
  /* 输入框背景改为通用的半透明灰 */
  background: rgba(118, 118, 128, 0.12);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
  color: var(--ios-text);
  outline: none;
  box-sizing: border-box; /* 确保不撑破 */
}

.edit-row { display: flex; gap: 10px; font-size: 12px; color: var(--ios-text-secondary); align-items: center; }

.mini-input {
  width: 50px;
  background: rgba(118, 118, 128, 0.12);
  border: none;
  border-radius: 6px;
  padding: 4px;
  text-align: center;
  color: var(--ios-text);
  outline: none;
  margin-left: 4px;
}

.edit-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
button { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; }
.save-btn { background: var(--ios-blue); color: white; }
.cancel-btn { background: rgba(118, 118, 128, 0.12); color: var(--ios-text); }
.del-btn { background: rgba(255, 59, 48, 0.15); color: var(--ios-red); margin-left: auto; }
.del-btn:hover { background: var(--ios-red); color: white; }
</style>