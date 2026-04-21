const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'debug';

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
}

autoUpdater.setFeedURL(process.env.UPDATE_SERVER_URL);
app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', () => {
  log.info('Update available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  autoUpdater.quitAndInstall();
});