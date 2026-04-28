import { contextBridge, ipcRenderer } from "electron";

console.log("IPC LOADED")
contextBridge.exposeInMainWorld("bridgeIpc", {
  downloadUpdate: (channel: "latest" | "pre") => ipcRenderer.invoke("download-update", channel),
  onDownloadProgressUpdate: (callback: any) => ipcRenderer.on("download-progress-update", (_, data) => callback(data)),
  onDownloadFinished: (callback: any) => ipcRenderer.on("download-finished", (_, data) => callback(data)),
  onUpdateAvailable: (callback: any) => ipcRenderer.on("update-available", (_, data) => callback(data)),
  installUpdate: () => ipcRenderer.invoke("install-update"),
});