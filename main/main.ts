import { UpdateInfo } from "electron-updater";

const { app, BrowserWindow } = require("electron");
const { NsisUpdater } = require("electron-updater");
const log = require("electron-log");
const path = require("path");

const options = {
  requestHeaders: {},
  provider: "generic",
  url: "http://127.0.0.1:8080",
};

const autoUpdater = new NsisUpdater(options);
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "debug";

function createWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  // In development, load from Vite dev server
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    // In production, load from built files
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow();

  setInterval(checkForUpdates, 10000);
});

autoUpdater.on("error", () => {
  log.info("Error");
});

autoUpdater.on("update-available", (e: UpdateInfo) => {
  log.info("Update available");
});

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded");
});
