import { Button } from "@nephroflow/design-system/components/button";
import { ModalDialog } from "@nephroflow/design-system/components/modal-dialog";
import { useState } from "react";
import versionInfo from "../package.json";

export function App() {
  enum eChannel {
    STABLE = "stable",
    PREVIEW = "pre",
  }

  type UpdateInfoType = {
    version: string;
    channel: eChannel;
    releaseDate: string;
  };

  const [updateInfo, setUpdateInfo] = useState<
    Record<eChannel, UpdateInfoType | null>
  >({ [eChannel.STABLE]: null, [eChannel.PREVIEW]: null });
  const [stableUpdateAvailable, setStableUpdateAvailable] = useState(false);
  const [previewUpdateAvailable, setPreviewUpdateAvailable] = useState(false);
  const [downloadState, setDownloadState] = useState<
    "idle" | "downloading" | "finished" | "error"
  >("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [channel, setChannel] = useState<eChannel>(eChannel.STABLE);

  window.bridgeIpc.onUpdateAvailable(
    (data: Record<eChannel, UpdateInfoType>) => {
      console.log(data);
      console.log(updateInfo);
      if (
        data[eChannel.PREVIEW].version &&
        (!updateInfo || !updateInfo[eChannel.PREVIEW])
      ) {
        setPreviewUpdateAvailable(true);
        setUpdateInfo((prev) => ({
          ...prev,
          [eChannel.PREVIEW]: data[eChannel.PREVIEW],
        }));
      }
      if (
        data[eChannel.STABLE].version &&
        (!updateInfo || !updateInfo[eChannel.STABLE])
      ) {
        setStableUpdateAvailable(true);
        setUpdateInfo((prev) => ({
          ...prev,
          [eChannel.STABLE]: data[eChannel.STABLE],
        }));
      }
    },
  );

  window.bridgeIpc.onDownloadProgressUpdate((downloadPercent: number) => {
    setDownloadState("downloading");
    setDownloadProgress(downloadPercent);
  });

  window.bridgeIpc.onDownloadFinished(() => {
    setDownloadState("finished");
  });

  return (
    <>
      <div className="w-screen h-screen">
        <div className="flex flex-col h-full justify-center items-center gap-10">
          <h1>Current version: {versionInfo.version}</h1>

          <ModalDialog>
            <ModalDialog.Trigger>
              <div className="flex gap-2">
                <Button
                  disabled={!previewUpdateAvailable}
                  onClick={() => setChannel(eChannel.PREVIEW)}
                >
                  Pre
                </Button>
                <Button
                  disabled={!stableUpdateAvailable}
                  importance="secondary"
                  onClick={() => setChannel(eChannel.STABLE)}
                >
                  Stable
                </Button>
              </div>
            </ModalDialog.Trigger>
            <ModalDialog.Content size="default">
              <ModalDialog.Header actions={null}>
                <ModalDialog.Title>Update confirmation</ModalDialog.Title>
              </ModalDialog.Header>
              <ModalDialog.Body>
                You're about to update from version {versionInfo.version} to{" "}
                {updateInfo[channel]?.version || "N/A"}. Download update?
              </ModalDialog.Body>
              <ModalDialog.Footer>
                <ModalDialog.FooterButtons>
                  <ModalDialog.Close>
                    <Button importance="secondary" meaning="neutral">
                      Cancel
                    </Button>
                  </ModalDialog.Close>
                  <ModalDialog.Close>
                    <Button
                      onClick={() =>
                        window.bridgeIpc.downloadUpdate(
                          channel === "stable" ? "latest" : "pre",
                        )
                      }
                      importance="primary"
                      meaning="neutral"
                    >
                      Confirm
                    </Button>
                  </ModalDialog.Close>
                </ModalDialog.FooterButtons>
              </ModalDialog.Footer>
            </ModalDialog.Content>
          </ModalDialog>
          <div>
            {downloadState === "downloading" && (
              <div>
                <progress className="pr-2" value={downloadProgress}></progress>
                <span>{downloadProgress}</span>
              </div>
            )}
            {downloadState === "finished" && (
              <div className="flex flex-col">
                <span>Download complete! Restart the app and install?</span>
                <div className="flex justify-center gap-2 pt-2">
                  <Button importance="secondary">Later</Button>
                  <Button onClick={() => window.bridgeIpc.installUpdate()} importance="primary">Restart</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
