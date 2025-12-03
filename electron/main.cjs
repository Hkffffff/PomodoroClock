const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
let win = null;
// 定义创建窗口的函数
const createWindow = () => {
    // 🔴 修改前: const win = new BrowserWindow({
    // 🟢 修改后: 去掉 const，直接赋值给全局变量
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

    // 关键逻辑：区分开发环境和生产环境
    // 如果是开发环境 (npm run electron:dev)，加载本地服务
    // 如果是生产环境 (打包后)，加载 dist/index.html
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173') // 这里换成你 Vite 启动的端口
        // win.webContents.openDevTools() // 开发模式下自动打开控制台
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

const preloadPath = path.join(__dirname, 'preload.cjs')
console.log('🔍 Expecting preload at:', preloadPath)

ipcMain.on('window-min', () => {
    console.log('Main:received minimize command'); // 👈 加这个日志到终端
    if (win) win.minimize();
})

ipcMain.on('window-max', () => {
    console.log('Main:received maximize command'); // 👈 加这个日志到终端
    if (win) {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    }
})

ipcMain.on('window-close', () => {
    console.log('Main:received close command'); // 👈 加这个日志到终端
    if (win) win.close();
})

// 应用程序准备好后创建窗口
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})