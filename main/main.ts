import {
  ProgressInfo,
  UpdateDownloadedEvent,
} from "electron-updater";
import yaml from 'js-yaml'
import os from 'os'
import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";

const platform = os.platform() === "win32" ? "win32": "mac"
log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.channel = "pre";

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
      contextIsolation: true,
      sandbox: false,
    },
  });
  // In development, load from Vite dev server
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    win.loadURL("http://localhost:5173");
  } else {
    // In production, load from built files
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}

let interval: NodeJS.Timeout;

function switchChannels() {
  autoUpdater.channel = autoUpdater.channel === "pre" ? "latest": "pre"
}

let updates = {};
async function checkForUpdates() {
  const stableRes = await fetch(`http://127.0.0.1:8080/latest-${platform}.yml`).then(r => r.text())
  const previewRes = await fetch(`http://127.0.0.1:8080/pre-${platform}.yml`).then(r => r.text())
  if (stableRes || previewRes) {
    const stable = yaml.load(stableRes)
    const preview = yaml.load(previewRes)
    win.webContents.send("update-available", {stable, preview});
  }
}

function enable() {
  interval = setInterval(checkForUpdates, 10000);
}

function disable() {
  clearInterval(interval);
}

function downloadUpdate() {
}

app.whenReady().then(() => {
  enable();
  ipcMain.handle("check-for-updates", () => {return updates});
  ipcMain.handle("download-update", downloadUpdate);
  createWindow();
  win.webContents.openDevTools();
});

autoUpdater.on("error", () => {
  log.info("Error");
});

autoUpdater.on("update-downloaded", (e: UpdateDownloadedEvent) => {
  win.webContents.send("download-finished", e);
});

autoUpdater.on("download-progress", (e: ProgressInfo) => {
  win.webContents.send("download-progress-update", e);
});
