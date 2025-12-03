import {defineStore} from "pinia";
import {ref,computed,watch } from "vue";

import audioFocus from '@/assets/focus-end.mp3'
import audioRest from '@/assets/rest-end.mp3'

function getTodayDate() {
    return new Date().toLocaleDateString()
}
let currentAudio = null

export const appStore = defineStore('appStore', ()=>{
    //State
    const activeTimer=ref(null)
    const currentTodo=ref(null)
    const isPlaying=ref(false)

    const totalFocus = ref(parseInt(localStorage.getItem('total-focus') || '0'))
    const totalRest = ref(parseInt(localStorage.getItem('total-rest') || '0'))
    const savedHistory = localStorage.getItem('focus-history')
    const history = ref(savedHistory ? JSON.parse(savedHistory) : [])
    //Data
    const savedTodos=localStorage.getItem('my-custom-todos')
    const todos=ref(savedTodos?JSON.parse(savedTodos):[])

    let timerID=null
    const today = getTodayDate()
    let lastRecordDate = localStorage.getItem('last-record-date') || getTodayDate()
    let savedDate = localStorage.getItem('last-record-date')

    if (lastRecordDate !== today) {
        console.log('📅 跨天检测：正在归档旧数据...')

        // A. 如果昨天有数据，先存进历史记录
        if (totalFocus.value > 0 || totalRest.value > 0) {
            history.value.push({
                date: lastRecordDate, // 存的是旧日期（昨天）
                focus: totalFocus.value,
                rest: totalRest.value
            })
            // 存入硬盘
            localStorage.setItem('focus-history', JSON.stringify(history.value))
        }

        // B. 然后再清零
        totalFocus.value = 0
        totalRest.value = 0

        // C. 更新日期
        lastRecordDate = today
        localStorage.setItem('last-record-date', today)
        localStorage.setItem('total-focus', '0')
        localStorage.setItem('total-rest', '0')
    }

    watch([totalFocus, totalRest], () => {
        localStorage.setItem('total-focus', totalFocus.value.toString())
        localStorage.setItem('total-rest', totalRest.value.toString())
        // 顺手更新一下日期，保持同步
        localStorage.setItem('last-record-date', getTodayDate())
    })

    function checkDailyReset() {
        const currentToday = getTodayDate()
        if (currentToday !== lastRecordDate) {
            // 1. 归档
            if (totalFocus.value > 0 || totalRest.value > 0) {
                history.value.push({
                    date: lastRecordDate,
                    focus: totalFocus.value,
                    rest: totalRest.value
                })
                localStorage.setItem('focus-history', JSON.stringify(history.value))
            }
            // 2. 清零
            totalFocus.value = 0
            totalRest.value = 0
            // 3. 更新日期
            lastRecordDate = currentToday
            localStorage.setItem('last-record-date', currentToday)
        }
    }

    const isDark = ref(localStorage.getItem('theme') === 'dark')

    function toggleTheme() {
        isDark.value = !isDark.value
        applyTheme()
    }

    // 3. 【新增】应用主题到 body 标签
    function applyTheme() {
        if (isDark.value) {
            document.body.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.body.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }
    applyTheme()

    // src/stores/appStore.js

    function tick() {
        // 1. 防御：如果没有 activeTimer，直接停止
        if (!activeTimer.value) {
            pause()
            return
        }

        checkDailyReset()

        // 2. 先减时间
        activeTimer.value.duration--

        // 3. 核心判断：是否结束？
        if (activeTimer.value.duration <= 0) {
            console.log('⏰ 时间到！准备播放声音...') // 👈 埋点 1

            playAlarm() // 调用播放

            stop() // 停止并重置
            return // 结束本次 tick
        }

        // 4. 统计逻辑 (保持不变)
        if (activeTimer.value.type === 'focus') {
            totalFocus.value++
        } else {
            totalRest.value++
        }

        if (currentTodo.value) {
            const todo = todos.value.find(t => t.id === currentTodo.value.id)
            if (todo) {
                if (activeTimer.value.type === 'focus') todo.focusTime++
                else todo.restTime++
            }
        }
    }

    // src/stores/appStore.js

    function playAlarm() {
        if (!activeTimer.value) return

        const audioSrc = activeTimer.value.type === 'focus' ? audioFocus : audioRest

        // 1. 如果之前有声音在放，先停掉，防止重音
        if (currentAudio) {
            currentAudio.pause()
            currentAudio.currentTime = 0
        }

        // 2. 赋值给外部变量 (关键步骤！)
        currentAudio = new Audio(audioSrc)

        // 3. 播放
        currentAudio.play()
            .then(() => console.log('✅ 播放指令已发送'))
            .catch(e => console.error('❌ 播放失败:', e))
    }

    function start(){
        if(isPlaying.value) return
        if(!activeTimer.value) return

        isPlaying.value = true
        timerID=setInterval(tick,1000)
    }

    function pause(){
        isPlaying.value = false
        clearInterval(timerID)
    }

    function stop(){
        pause()
        if(activeTimer.value){
            activeTimer.value=null
        }
    }

    function insertTimer(data){
        pause()
        activeTimer.value={
            ...data,
            initial:data.duration
        }
    }

    function insertTodo(todoID){
        const todo=todos.value.find(t=>t.id===todoID)
        if(todo){
            currentTodo.value=todo
        }
    }

    function updateTodo(payload){
        const todo = todos.value.find(t => t.id === payload.id)
        if (todo) {
            todo.title = payload.title
            // 允许手动修改统计时间
            todo.focusTime = payload.focusTime
            todo.restTime = payload.restTime
            // 新增：目标时长 (如果 payload 里有的话)
            if (payload.targetMinutes !== undefined) {
                todo.targetMinutes = payload.targetMinutes
            }
        }
    }

    function deleteTodo(id){
        todos.value = todos.value.filter(t => t.id !== id)
        // 如果正在执行这个任务，也把播放器里的清空
        if (currentTodo.value && currentTodo.value.id === id) {
            currentTodo.value = null
        }
    }

    function eject(type){
        if(type==='timer'){
            stop()
            activeTimer.value=null
        }
        if(type==='todo'){
            currentTodo.value=null
        }
    }

    watch(todos,(newValue)=>{
        localStorage.setItem('my-custom-todos',JSON.stringify(newValue))
    },{deep:true})

    return {
        activeTimer,
        currentTodo,
        isPlaying,
        todos,
        totalFocus, totalRest,history,
        isDark, toggleTheme,
        insertTimer,
        insertTodo,
        updateTodo,
        deleteTodo,
        start,
        stop,
        pause,
        tick,
        eject
    }

})