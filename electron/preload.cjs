const { ipcRenderer } = require('electron')

window.windowAPI = {
    minimize: () => {
        ipcRenderer.send('window-min')
    },
    maximize: () => {
        ipcRenderer.send('window-max')
    },
    close: () => {
        ipcRenderer.send('window-close')
    }
}
