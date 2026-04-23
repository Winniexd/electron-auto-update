const { app, BrowserWindow } = require("electron");
const { MacUpdater } = require("electron-updater");
const log = require("electron-log");

const options = {
  requestHeaders: {
    // Any request headers to include here
  },
  provider: "generic",
  url: "http://127.0.0.1:8080",
};

const autoUpdater = new MacUpdater(options);
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "debug";

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();
});

autoUpdater.on("error", () => {
  log.info("Error");
});

autoUpdater.on("update-available", () => {
  log.info("Update available");
});

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded");
  autoUpdater.quitAndInstall();
});
