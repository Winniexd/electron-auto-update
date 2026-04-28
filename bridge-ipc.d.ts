export {};

declare global {
  interface Window {
    bridgeIpc: {
      downloadUpdate: (channel: "latest" | "pre") => Promise<any>;
      onDownloadProgressUpdate: (cb: (data: any) => void) => void;
      onDownloadFinished: (cb: (data: any) => void) => void;
      onUpdateAvailable: (cb: (data: any) => void) => void;
      installUpdate: () => Promise<any>;
    };
  }
}
