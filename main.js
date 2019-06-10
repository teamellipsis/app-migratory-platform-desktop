// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const {ipcMain} = require('electron')
// const path = require('path');
// const Positioner = require('electron-positioner');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let serverstart =false
const server = require('./demo-migratory-redux-app/server')
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')

//   server.server.on('listen',function(){
//     mainWindow.loadURL('http://localhost:3000')
//   })
// server.server.addListener("close",function(){
//   mainWindow = null
// })




  // and load the index.html of the app.

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('asynchronous-message-open', (event, arg) => {
  console.log("getmessage")
 
  server.server.on('listen',function(){
    serverstart=true
    mainWindow.loadURL('http://localhost:3000')
})
if(serverstart){
  mainWindow.loadURL('http://localhost:3000')
}
server.eventemmit.on('close',function(){
  console.log("server closed")
  mainWindow.loadFile('index.html')
})
  // Event emitter for sending asynchronous messages
  // event.sender.send('asynchronous-reply', 'async pong')
})

server.server.on('listen',function(){
  serverstart=true
  // mainWindow.loadURL('http://localhost:3000')
})



// server.server.addListener("close",function(){
//   console.log("server closed")
//   mainWindow.loadFile('index.html')
// })