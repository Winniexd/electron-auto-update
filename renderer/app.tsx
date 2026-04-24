import { Button } from "@nephroflow/design-system/components/button";
import { ModalDialog } from "@nephroflow/design-system/components/modal-dialog";
import { useState } from "react";

export function App() {
  const [version, setVersion] = useState("1.0.0");
  const [stableUpdateAvailable, setStableUpdateAvailable] = useState(true);
  const [previewUpdateAvailable, setPreviewUpdateAvailable] = useState(true);

  return (
    <>
      <div className="w-screen h-screen">
        <div className="flex flex-col h-full justify-center items-center gap-10">
          <h1>Current version: {version}</h1>

          <ModalDialog>
            <ModalDialog.Trigger>
              <div className="flex gap-2">
                <Button disabled={!stableUpdateAvailable}>Pre</Button>
                <Button
                  disabled={!previewUpdateAvailable}
                  importance="secondary"
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
                You're about to update from version {version} to 1.1.0. Download
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
