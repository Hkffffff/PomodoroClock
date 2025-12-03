<script setup lang="ts">
import {ref} from "vue";
import { appStore } from "@/stores/appStore";
import TodoItem from "@/components/TodoItem.vue";

const store=appStore();
const newTodo=ref('')

function add(){
  if(!newTodo.value.trim()) return
  store.todos.push({
    id:Date.now(),
    title:newTodo.value,
    focusTime:0,
    restTime:0
  })
  newTodo.value=""
}

</script>

<template>
  <div class="ios-list-panel">
    <div class="panel-head">Tasks</div>

    <div class="input-wrapper">
      <input
          class="task-input"
          v-model="newTodo"
          placeholder="Add a new task..."
          @keyup.enter="add"
      >
      <button class="add-btn-solid" @click="add" :disabled="!newTodo.trim()">
        ＋
      </button>
    </div>
    <div class="list-area">
      <TodoItem
          v-for="todo in store.todos"
          :key="todo.id"
          :todo="todo"
      />
    </div>
  </div>
</template>

<style scoped>
.list-area {
  flex: 1;

  /* 👇 核心关键 */
  overflow-y: auto;

  /* 👇 调整右侧内边距 */
  padding: 0 14px 24px 24px;

  scroll-behavior: smooth;
}

.ios-list-panel {
  background: var(--ios-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  padding: 0; /* 👈 修改：改为 0 */
  height: 100%;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-sm);
  overflow: hidden; /* 关键 */
}

.panel-head {
  font-size: 22px;
  font-weight: 700;
  /* margin-bottom: 20px; */
  padding: 24px 24px 20px 24px; /* 👈 新增 */
  color: var(--ios-blue);
}

.ios-list-panel {

  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  padding: 24px;
  height: 100%;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-sm);
}
.panel-head { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: var(--ios-blue); }

/* 👇👇👇 全新设计的输入栏样式 👇👇👇 */

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  /* 👇 修改 1: 浅色模式下保留浅灰背景 (可选，或者也改成 transparent) */
  background: rgba(0, 0, 0, 0.05);

  padding: 6px;
  padding-left: 16px;
  border-radius: 24px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

/* 聚焦时的动效：背景变亮，出现蓝色边框 */
.input-wrapper:focus-within {
  background: var(--ios-white);
  border-color: var(--ios-blue);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15);
}

/* 输入框本体 */
.task-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 15px;
  outline: none;
  color: var(--ios-text);
  padding: 4px 0;
}
.task-input::placeholder { color: var(--ios-text-secondary); opacity: 0.7; }

/* 实心添加按钮 */
.add-btn-solid {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  /* 默认灰色，输入内容后变蓝 */
  background: rgba(120, 120, 128, 0.3);
  color: white;
  font-size: 20px;
  font-weight: 300;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

/* 当输入框有内容时（未禁用状态），按钮变蓝 */
.add-btn-solid:not(:disabled) {
  background: var(--ios-blue);
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
}

.add-btn-solid:not(:disabled):hover { transform: scale(1.05); }
.add-btn-solid:not(:disabled):active { transform: scale(0.95); }

/* 👆👆👆 新样式结束 👆👆👆 */

.list-area { flex: 1; overflow-y: auto; padding-right: 4px; }
</style>

<style>
/* 深色模式下：TodoList 变为熔岩暗橙 */
body.dark .ios-list-panel {
  /* 深邃的红橙调，带一点透明度 */
  background: rgba(65, 25, 15, 0.85) !important;

  /* 边框微调，泛一点红光 */
  border: 1px solid rgba(255, 100, 50, 0.1) !important;

  /* 可选：加一点暖色系的阴影 */
  box-shadow: 0 10px 30px rgba(40, 10, 5, 0.4) !important;
}
body.dark .input-wrapper {
  /* 使用深色半透明黑，让底下的熔岩橙色透出来 */
  background: rgba(0, 0, 0, 0.25);
  /* 边框微调，增加一点点光泽感 */
  border-color: rgba(255, 255, 255, 0.05);
}
body.dark .task-input{
  background: rgba(0, 0, 0, 0) !important;
}
</style>