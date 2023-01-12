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
  useToaster,
  Toaster,
} from "@twilio-paste/core";
import { useUID } from "@twilio-paste/core/uid-library";
import { FiSettings } from "react-icons/fi";

import useDevices from "../../lib/hooks/useDevices";
import VideoPreview from "../screens/PreJoinScreen/VideoPreview/VideoPreview";
import { useVideoStore, VideoAppState } from "../../store/store";
import { findDeviceByID } from "../../lib/utils/devices";
import { TEXT_COPY } from "../../lib/constants";

interface ConfigureSettingsProps {}

export default function ConfigureSettings({}: ConfigureSettingsProps) {
  const toaster = useToaster();
  const { CONFIGURE_SETTINGS_HEADER, CONFIGURE_SETTINGS_DESCRIPTION } =
    TEXT_COPY;
  const { localTracks, setLocalTracks, formData, clearTrack } = useVideoStore(
    (state: VideoAppState) => state
  );
  const localVideo = localTracks.video;
  const { identity } = formData;

  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const modalHeadingID = useUID();
  const { videoInputDevices, audioInputDevices, audioOutputDevices, isMicPermissionGranted, isCameraPermissionGranted } =
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

    /* TODO: NEED TO ADD IN DEVICE CONFIGURATION SWITCHING FOR AUDIO INPUT & OUTPUT */
    if (type === "video" && localVideo?.mediaStreamTrack.id !== deviceID) {
      localVideo?.stop();
      clearTrack("video");
      Video.createLocalVideoTrack({
        deviceId: { exact: deviceID },
      })
        .then(function (localVideoTrack) {
          console.log(
            `Local Track changed: ${localVideoTrack.kind} (${localVideoTrack})`
          );
          setLocalTracks("video", localVideoTrack);
        })
        .catch((error) => {
          toaster.push({
            message: `Error creating local track - ${error.message}`,
            variant: "error",
          });
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
            {CONFIGURE_SETTINGS_HEADER}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Paragraph>{CONFIGURE_SETTINGS_DESCRIPTION}</Paragraph>
          <Stack orientation={"vertical"} spacing="space60">
            {isCameraPermissionGranted &&
              <VideoPreview
                identity={identity ?? "Guest"}
                localVideo={localVideo}
              />
            }
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">
                Video{" "}
                {isCameraPermissionGranted && localVideo === undefined
                  ? "(disabled)"
                  : localVideo?.isStopped
                  ? "(stopped)"
                  : ""}
              </Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "video")}
                defaultValue={isCameraPermissionGranted ? (localVideo?.mediaStreamTrack.id ?? "") : "no-cam-permission"}
                disabled={
                  videoInputDevices.length < 2 ||
                  !isCameraPermissionGranted
                }
              >
                {isCameraPermissionGranted ?
                  videoInputDevices.map((videoInput: MediaDeviceInfo) => (
                    <Option key={videoInput.deviceId} value={videoInput.deviceId}>
                      {videoInput.label}
                    </Option>
                  )) : (
                    <Option key="no-cam-permission" value="no-cam-permission">
                      Camera permissions have not been granted in the browser
                    </Option>
                  )
                }
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Input</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioInput")}
                defaultValue={isMicPermissionGranted ? "" : "no-mic-permission"}
                disabled={
                  audioInputDevices.length < 2 ||
                  !isMicPermissionGranted
                }
              >
                {isMicPermissionGranted ? 
                  audioInputDevices.map((audioInput: MediaDeviceInfo) => (
                    <Option key={audioInput.deviceId} value={audioInput.deviceId}>
                      {audioInput.label}
                    </Option>
                  )) : (
                    <Option key="no-mic-permission" value="no-mic-permission">
                      Microphone permissions have not been granted in the browser
                    </Option>
                  )
                }
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
      <Toaster {...toaster} />
    </Flex>
  );
}
