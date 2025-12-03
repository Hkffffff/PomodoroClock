// electron/preload.cjs

const { ipcRenderer } = require('electron')

console.log('🚀 Preload script loaded (Direct Mode)!')

// 👇👇👇 直接挂载到 window 对象上 👇👇👇
// 因为 contextIsolation: false，这里挂载的 window 就是 Vue 里的 window
window.windowAPI = {
    minimize: () => {
        console.log('Preload: Sending minimize...')
        ipcRenderer.send('window-min')
    },
    maximize: () => {
        console.log('Preload: Sending maximize...')
        ipcRenderer.send('window-max')
    },
    close: () => {
        console.log('Preload: Sending close...')
        ipcRenderer.send('window-close')
    }
}