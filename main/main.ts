import {
  ProgressInfo,
  UpdateDownloadedEvent,
  UpdateInfo,
} from "electron-updater";
import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import path from "path";

log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.allowPrerelease = false;
autoUpdater.allowDowngrade = false;
log.debug(autoUpdater.currentVersion)
log.debug(autoUpdater.getFeedURL())

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

let updates: Record<"pre" | "stable", any> = { pre: {}, stable: {} };
async function checkForUpdates() {
  autoUpdater.channel = "latest"
  autoUpdater.allowDowngrade = false
  await autoUpdater.checkForUpdates()
  //updates["stable"] = await autoUpdater.checkForUpdates().then(r => r?.updateInfo)

  autoUpdater.channel = "pre"
  autoUpdater.allowDowngrade = false
  await autoUpdater.checkForUpdates()
  //updates["pre"] = await autoUpdater.checkForUpdates().then(r => r?.updateInfo)
  win.webContents.send("update-available", updates)
}

function enable() {
  interval = setInterval(checkForUpdates, 10000);
}

function disable() {
  clearInterval(interval);
}

async function downloadUpdate(event: any, channel: "latest" | "pre") {
  autoUpdater.channel = channel
  autoUpdater.allowDowngrade = false;
  // autoUpdater.allowPrerelease = (channel === "pre");
  autoUpdater.checkForUpdates()
  autoUpdater.downloadUpdate()
}

function installUpdate() {
  autoUpdater.quitAndInstall();
}

app.whenReady().then(() => {
  enable();
  ipcMain.handle("check-for-updates", () => { return updates });
  ipcMain.handle("download-update", downloadUpdate);
  ipcMain.handle("install-update", installUpdate);
  createWindow();
  win.webContents.openDevTools();
});

autoUpdater.on("error", () => {
  log.info("Error");
});

autoUpdater.on("update-available", (e: UpdateInfo) => {
  log.error(`VERSION TO DOWNLOAD: ${e.version}`)
  const channel = e.version.includes("pre") ? "pre": "stable"
  updates[channel] = e;
})

autoUpdater.on("update-downloaded", (e: UpdateDownloadedEvent) => {
  win.webContents.send("download-finished", e);
});

autoUpdater.on("download-progress", (e: ProgressInfo) => {
  win.webContents.send("download-progress-update", e.percent);
});

autoUpdater.on("update-not-available", (e: UpdateInfo) => {
  log.debug("UPDATE NOT AVAILABLE")
  log.debug(e)
})
