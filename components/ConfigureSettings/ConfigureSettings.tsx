import React from "react";
import * as Video from "twilio-video";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
  Paragraph,
  Select,
  Option,
  Flex,
  Stack,
  Tooltip,
} from "@twilio-paste/core";
import { useUID } from "@twilio-paste/core/uid-library";
import { FiSettings } from "react-icons/fi";

import useDevices from "../../lib/hooks/useDevices";
import VideoPreview from "../VideoPreview/VideoPreview";
import { useVideoStore, VideoAppState } from "../../store/store";
import { findDeviceByID } from "../../lib/utils/devices";

interface ConfigureSettingsProps {}

export default function ConfigureSettings({}: ConfigureSettingsProps) {
  const localVideo = useVideoStore(
    (state: VideoAppState) => state.localTracks.video
  );
  const setLocalTracks = useVideoStore(
    (state: VideoAppState) => state.setLocalTracks
  );
  const uiStep = useVideoStore((state: VideoAppState) => state.uiStep);
  const clearTrack = useVideoStore((state: VideoAppState) => state.clearTrack);

  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();
  const { videoInputDevices, audioInputDevices, audioOutputDevices } =
    useDevices();

  function deviceChange(
    deviceID: string,
    type: "video" | "audioInput" | "audioOutput"
  ) {
    const deviceList =
      type === "video"
        ? videoInputDevices
        : type === "audioInput"
        ? audioInputDevices
        : audioOutputDevices;
    const device = findDeviceByID(deviceID, deviceList);
    console.log(`changed ${type} to `, device?.label);

    /* NEED TO ADD IN DEVICE CONFIGURATION SWITCHING FOR AUDIO INPUT & OUTPUT */
    if (type === "video" && localVideo?.mediaStreamTrack.id !== deviceID) {
      localVideo?.stop();
      clearTrack("video");
      Video.createLocalVideoTrack({
        deviceId: { exact: deviceID },
      }).then(function (localVideoTrack) {
        console.log(
          `Local Track changed: ${localVideoTrack.kind} (${localVideoTrack})`
        );
        //const previewContainer = document.getElementById("local-media");
        //attachTracks([localVideoTrack], previewContainer);
        setLocalTracks("video", localVideoTrack);
      });
    }
  }

  return (
    <Flex hAlignContent={"center"} width="100%">
      <Tooltip text="Configure settings" placement="top">
        <Button variant={"secondary"} onClick={handleOpen}>
          <FiSettings
            style={{ width: "25px", height: "25px", marginRight: "6px" }}
          />
          Settings
        </Button>
      </Tooltip>
      <Modal
        ariaLabelledby={modalHeadingID}
        isOpen={isOpen}
        onDismiss={handleClose}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Audio & Video Settings
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Paragraph>Configure your audio and video settings.</Paragraph>
          <Stack orientation={"vertical"} spacing="space60">
            <VideoPreview localVideo={localVideo} />
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">
                Video{" "}
                {localVideo === undefined
                  ? "(disabled)"
                  : localVideo?.isStopped
                  ? "(stopped)"
                  : ""}
              </Label>
                <Select
                  id="author"
                  onChange={(e) => deviceChange(e.target.value, "video")}
                  defaultValue={localVideo?.mediaStreamTrack.getSettings().deviceId ?? ""}
                  disabled={
                    //localVideo === undefined ||
                    //localVideo?.isStopped ||
                    videoInputDevices.length < 2
                  }
                >
                {videoInputDevices.map((videoInput: MediaDeviceInfo) => (
                  <Option key={videoInput.deviceId} value={videoInput.deviceId}>
                    {videoInput.label}
                  </Option>
                ))}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Input</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioInput")}
              >
                {audioInputDevices.map((audioInput: MediaDeviceInfo) => (
                  <Option key={audioInput.deviceId} value={audioInput.deviceId}>
                    {audioInput.label}
                  </Option>
                ))}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Output</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioOutput")}
              >
                {audioOutputDevices.map((audioOutput: MediaDeviceInfo) => (
                  <Option
                    key={audioOutput.deviceId}
                    value={audioOutput.deviceId}
                  >
                    {audioOutput.label}
                  </Option>
                ))}
              </Select>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="destructive" onClick={handleClose}>
              Back
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </Flex>
  );
}
