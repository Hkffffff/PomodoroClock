<script setup lang="ts">
import {ref} from "vue";

const props = defineProps([
    'id',
    'label',
    'type',
    'data'
])

const emit = defineEmits(['delete'])


function onDragStart(event) {
  // 防御性编程：如果 event 没传进来，或者 dataTransfer 不存在，直接返回，防止报错
  if (!event || !event.dataTransfer) {
    console.error("拖拽事件异常：event 或 dataTransfer 为空", event);
    return;
  }

  const payload=JSON.stringify({
    type:props.type,
    data:props.data
  })
  event.dataTransfer.setData('application/json', payload)
  event.dataTransfer.effectAllowed = 'move'
}

function handleDelete() {
  if (confirm('Delete this chip?')) {
    emit('delete', props.id)
  }
}

</script>

<template>
  <div class="ios-widget" draggable="true" @dragstart="onDragStart($event)">
    <div class="icon-circle" :class="type">
      {{ type === 'timer' ? '⏳' : '📝' }}
    </div>
    <div class="content">
      <div class="title">{{ label }}</div>
      <div class="sub" v-if="data.duration">{{ Math.floor(data.duration/60) }} min</div>
    </div>

    <div class="actions" >
      <button class="icon-btn del" @click.stop="handleDelete">🗑</button>
    </div>


  </div>
</template>

<style scoped>
.ios-widget {
  background: var(--ios-card);
  backdrop-filter: blur(20px);
  padding: 16px;
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}
.ios-widget:hover {
  transform: translateY(-2px);
  background: var(--ios-white);
  box-shadow: var(--shadow-md);
}

.icon-circle {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  font-size: 20px;
}
.icon-circle.timer { background: #EAF2FF; color: var(--ios-blue); }
.icon-circle.todo { background: #FFF4E5; color: var(--ios-orange); }

.content { flex: 1; }
.title { font-weight: 600; font-size: 15px; }
.sub { font-size: 13px; color: var(--ios-text-secondary); margin-top: 2px; }
.arrow { color: #C7C7CC; font-size: 20px; font-weight: 300; }
.actions { display: none; gap: 4px; }
.ios-widget:hover .actions { display: flex; }

.icon-btn {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; justify-content: center; align-items: center;
  font-size: 14px; background: rgba(0,0,0,0.05); color: var(--ios-text-secondary);
}
.icon-btn:hover { background: rgba(0,0,0,0.1); color: var(--ios-text); }
.del:hover { background: #FF3B30; color: white; }

</style>