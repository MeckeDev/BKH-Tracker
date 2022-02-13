const { app, BrowserWindow } = require('electron')


// creating the Window where the UI of the Tool will be shown
function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 920,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
    })
  
    win.removeMenu()
    win.loadFile('Views/index.html')
  }

  app.whenReady().then(() => {
    createWindow()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })