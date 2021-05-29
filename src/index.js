const {
  app,
  BrowserWindow
} = require('electron');
const {
  ipcRenderer
} = require('electron')
const {
  dialog,
  ipcMain
} = require('electron')
const path = require('path');
const express = require('express');
const expressApp = express()
const port = 4269;
const fs = require('fs').promises;
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
let autoPath = null;
const {
  Webhook
} = require('simple-discord-webhooks');
// const express = require('express')
// const app = express()
// const port = process.env.PORT || 4000;
// const path = require('path')
const WebSocket = require('ws')
const wsserver = new WebSocket.Server({
  port: '8080'
})
var webhook = 'empty';
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.urlencoded({
//   extended: false
// }))

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Homecat',
    icon: path.join(__dirname, 'favicon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};
console.log(__dirname)
const getMusic = async (path) => {
  return await fs.readdir(path)
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

expressApp.get('/api', (req, res) => {
  res.send({
    paths: ["/api/getPath"]
  })
})

expressApp.get('/api/getMusic', async (req, res) => {
  if (autoPath == null) {
    res.send(await getMusic(req.query.path))
  } else {
    res.send(autoPath)
  }
})


let givesock = null

function setWebhook(thewebhook) {
  webhook = new Webhook(thewebhook);
}

wsserver.on('connection', socket => {
  console.log('Connection!')

  givesock = socket
  socket.on('message', (data) => {
    // console.log(data)
    if (data.includes('hookvalue')) {
      console.log(data)
      let hook = data.replace('hookvalue', '')
      setWebhook(hook)
      console.log(webhook)
    }
    if (data.includes('messagetosendforyoumydudebroskiahasfasdgasdf')) {
      let theactualmessage = data.replace('messagetosendforyoumydudebroskiahasfasdgasdf', '')
      webhook.send(theactualmessage)
    }
  })
})

function sendthingsocket(thingy) {
  console.log('i got called')
  givesock.send('socketdirectorypathisrighthereafiagsfhaofjgnagoa' + thingy + "\\\\")
}
expressApp.listen(port, () => console.log('backend api listening on localhost:4269/api'))

module.exports = app;

ipcMain.on('select-dirs', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  console.log('directories selected', result.filePaths)
  sendthingsocket(result.filePaths[0])
  autoPath = await getMusic(result.filePaths[0])
})