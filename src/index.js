const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const expressApp = express()
const port = 4269;
const fs = require('fs').promises;
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Homecat',
    icon: path.join(__dirname, 'favicon.ico')
    // icon: "https://hub.koneko.link/cdn/icons/black.png"
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

expressApp.get('/api', (req,res) => {
  res.send({
    paths: ["/api/getPath"]
  })
})

expressApp.get('/api/getMusic', async (req,res) => {
  // let path = stringify(req.params.path)
  res.send(await getMusic(req.query.path))
  // console.log(getMusic(req.query.path))
})

expressApp.listen(port, () => console.log('backend api listening on localhost:4269/api'))

module.exports = app;