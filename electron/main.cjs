const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
let win = null

const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 1000,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false,
            backgroundThrottling: false,
        }
    })

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173')
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

ipcMain.on('window-min', () => {
    if (win) win.minimize();
})

ipcMain.on('window-max', () => {
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
})

ipcMain.on('window-close', () => {
    if (win) win.close();
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
