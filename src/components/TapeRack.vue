<script setup lang="ts">
import DraggableTape from "@/components/DraggableTape.vue";
import TapeCreator from "@/components/TapeCreator.vue";
import {ref,watch} from "vue";

const defaultTapes=[
  { id: 'd1', label: '25:00 Focus', type: 'focus', duration: 25 * 60 },
  { id: 'd2', label: '05:00 Rest', type: 'rest', duration: 5 * 60 },

]
const saved = localStorage.getItem('my-custom-tapes')
const initialData = saved ? JSON.parse(saved) : []
const customTapes = ref<{id: number, label: string, type: string, duration: number}[]>(initialData)

watch(customTapes,(newVal) => {
  localStorage.setItem('my-custom-tapes',JSON.stringify(newVal))
},{deep:true})



function handleCreate(newTape:any){
  customTapes.value.push({
    id:Date.now(),
    ...newTape
  })
}

// 删除逻辑
function handleDelete(id: number) {
  console.log('正在请求删除 ID:', id, '类型:', typeof id)
  customTapes.value = customTapes.value.filter(tape => tape.id !== id)
}
</script>

<template>
  <div class="ios-rack-panel">
    <div class="panel-head">Timer Chips</div>

    <div class="scroll-area">
      <div class="section-header">System Presets</div>
      <div class="tape-list">
        <DraggableTape
            v-for="tape in defaultTapes"
            :key="tape.id"
            :id="tape.id"
            :label="tape.label"
            :type="'timer'"
            :data="{ type: tape.type, duration: tape.duration, id: tape.id }"
        />
      </div>

      <div v-if="customTapes.length > 0" class="section-header mt-4">
        My Chips
      </div>
      <div class="tape-list">
        <DraggableTape
            v-for="tape in customTapes"
            :key="tape.id"
            :id="tape.id"
            :label="tape.label"
            :type="'timer'"
            :data="{ type: tape.type, duration: tape.duration, id: tape.id }"
            @delete="handleDelete"
        />
      </div>

<!--      <div class="divider"></div>-->

    </div>
    <div class="createTape">
      <TapeCreator @create="handleCreate" />
    </div>

  </div>
</template>

<style scoped>
/* 容器样式：去除内边距，让内容撑满，从而能够被 overflow:hidden 切割圆角 */
.ios-rack-panel {
  background: var(--ios-card);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0; /* 👈 修改：改为 0 */
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  box-sizing: border-box;
  overflow: hidden; /* 关键：切割圆角 */

}

/* 标题样式：内容自己负责内边距 */
.panel-head {
  font-size: 22px;
  font-weight: 700;
  /* margin-bottom: 20px; */ /* 建议去掉 margin，用 padding 控制间距更精准 */
  padding: 24px 24px 20px 24px; /* 👈 新增：上、右、下、左 */
  color: var(--ios-blue);
  flex-shrink: 0;
}

/* 滚动区域：内容自己负责内边距 */
.scroll-area {


  /* 👇 核心关键：必须是 auto，不能是 hidden 或 visible */
  overflow-y: auto;

  /* 👇 增加右侧内边距，防止滚动条挡住卡片内容 */
  padding: 0 14px 24px 24px; /* 右侧从 24 改为 14，留出空间给滚动条 */

  /* 优化滚动体验，增加平滑滚动 */
  scroll-behavior: smooth;
}

.createTape{


  /* 👇 核心关键：必须是 auto，不能是 hidden 或 visible */


  /* 👇 增加右侧内边距，防止滚动条挡住卡片内容 */
  padding: 0 14px 24px 24px; /* 右侧从 24 改为 14，留出空间给滚动条 */

  /* 优化滚动体验，增加平滑滚动 */
  scroll-behavior: smooth;
}

/* ... 其他样式 (section-header, mt-4, tape-list, divider) 保持不变 ... */
.section-header {
  font-size: 13px;
  color: var(--ios-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-left: 4px;
}

.mt-4 { margin-top: 24px; }

.tape-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.divider {
  height: 1px;
  background: rgba(0,0,0,0.05);
  margin: 24px 0;
}
</style>

<style>
/* 深色模式下：TapeRack 变为深海蓝 */
body.dark .ios-rack-panel {
  /* 深邃的蓝调，带一点透明度 */
  background: rgba(15, 35, 65, 0.85) !important;

  /* 边框微调，泛一点蓝光 */
  border: 1px solid rgba(100, 150, 255, 0.1) !important;

  /* 可选：加一点蓝色系的阴影 */
  box-shadow: 0 10px 30px rgba(0, 20, 40, 0.4) !important;
}
</style>