import { Button } from "@nephroflow/design-system/components/button";
import { ModalDialog } from "@nephroflow/design-system/components/modal-dialog";
import { useState } from "react";

export function App() {
  enum EChannel {
    STABLE = "stable",
    PREVIEW = "preview",
  }

  type UpdateInfoType = {
    version: string;
    channel: EChannel;
    releaseDate: string;
  };

  const [version, setVersion] = useState("1.0.0");
  const [updateInfo, setUpdateInfo] = useState<
    Record<EChannel, UpdateInfoType | null>
  >({ [EChannel.STABLE]: null, [EChannel.PREVIEW]: null });
  const [stableUpdateAvailable, setStableUpdateAvailable] = useState(false);
  const [previewUpdateAvailable, setPreviewUpdateAvailable] = useState(false);
  const [channel, setChannel] = useState<EChannel>(EChannel.STABLE);

  window.bridgeIpc.onUpdateAvailable(
    (data: Record<EChannel, UpdateInfoType>) => {
      console.log(data);
      console.log(updateInfo)
      if (
        data.hasOwnProperty(EChannel.PREVIEW) &&
        (!updateInfo || !updateInfo[EChannel.PREVIEW])
      ) {
        setPreviewUpdateAvailable(true);
        setUpdateInfo((prev) => ({
          ...prev,
          [EChannel.PREVIEW]: data[EChannel.PREVIEW],
        }));
      }
      if (
        data.hasOwnProperty("stable") &&
        (!updateInfo || !updateInfo[EChannel.STABLE])
      ) {
        setStableUpdateAvailable(true);
        setUpdateInfo((prev) => ({
          ...prev,
          [EChannel.STABLE]: data[EChannel.STABLE],
        }));
      }
    },
  );

  return (
    <>
      <div className="w-screen h-screen">
        <div className="flex flex-col h-full justify-center items-center gap-10">
          <h1>Current version: {version}</h1>

          <ModalDialog>
            <ModalDialog.Trigger>
              <div className="flex gap-2">
                <Button
                  disabled={!previewUpdateAvailable}
                  onClick={() => setChannel(EChannel.PREVIEW)}
                >
                  Pre
                </Button>
                <Button
                  disabled={!stableUpdateAvailable}
                  importance="secondary"
                  onClick={() => setChannel(EChannel.STABLE)}
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
                You're about to update from version {version} to {updateInfo[channel]?.version || "N/A"}. Download
                update?
              </ModalDialog.Body>
              <ModalDialog.Footer>
                <ModalDialog.FooterButtons>
                  <ModalDialog.Close>
                    <Button importance="secondary" meaning="neutral">
                      Cancel
                    </Button>
                  </ModalDialog.Close>
                  <ModalDialog.Close>
                    <Button importance="primary" meaning="neutral">
                      Confirm
                    </Button>
                  </ModalDialog.Close>
                </ModalDialog.FooterButtons>
              </ModalDialog.Footer>
            </ModalDialog.Content>
          </ModalDialog>
        </div>
      </div>
    </>
  );
}
