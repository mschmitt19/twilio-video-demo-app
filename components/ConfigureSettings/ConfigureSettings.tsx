import React, { useEffect, useState } from "react";
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
import useMediaStreamTrack from "../../lib/hooks/useMediaStreamTrack";
import VideoPreview from "../screens/PreJoinScreen/VideoPreview/VideoPreview";
import { useVideoStore, VideoAppState } from "../../store/store";
import { findDeviceByID } from "../../lib/utils/devices";
import {
  TEXT_COPY,
  SELECTED_AUDIO_INPUT_KEY,
  SELECTED_AUDIO_OUTPUT_KEY,
  SELECTED_VIDEO_INPUT_KEY,
} from "../../lib/constants";

interface ConfigureSettingsProps {}

export default function ConfigureSettings({}: ConfigureSettingsProps) {
  const toaster = useToaster();
  const { CONFIGURE_SETTINGS_HEADER, CONFIGURE_SETTINGS_DESCRIPTION } =
    TEXT_COPY;
  const {
    localTracks,
    setLocalTracks,
    formData,
    clearTrack,
    devicePermissions,
    room
  } = useVideoStore((state: VideoAppState) => state);
  const localVideo = localTracks.video;
  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
  );
  const { videoInputDevices, audioInputDevices, audioOutputDevices } =
    useDevices(devicePermissions);
    
  // Default preview track to local video track if there's one
  const [previewVideo, setPreviewVideo] = useState(localVideo);
  // Need the MediaStreamTrack to be able to react to (and re-render) on track restarts 
  const previewMediaStreamTrack = useMediaStreamTrack(previewVideo);
  // Get the device ID of the active track, or the preferred device ID from local storage, or the first video input device
  const videoInputDeviceId = previewMediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId
      || videoInputDevices?.find((device) => device.kind === "videoinput")?.deviceId;

  
  const { identity } = formData;
  const modalHeadingID = useUID();


  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => {
    if (devicePermissions.camera && videoInputDeviceId) {
      // Use active track as the preview (if there is one), otherwise create the preview track
      if (localVideo) {
        setPreviewVideo(localVideo);
      } else {
        // If preview track was stopped on previous close, recreating it is no slower than restarting it (TODO: Fact Check!)
        createPreviewTrack(videoInputDeviceId);
      }
    }
    setIsOpen(true);
  }

  const handleClose = () => {
    // Stop the preview track if it's not the active track (i.e. turn off camera light!)
    if (!localVideo) { 
      previewVideo?.stop(); 
      console.log(`Stopped preview track on close of ConfigureSettings`);
    }
    setIsOpen(false);
  }


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
    if (type === "video" && previewVideo?.mediaStreamTrack.id !== deviceID) {
      setStoredLocalVideoDeviceId(deviceID);
      window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, deviceID);
      clearTrack("video");
      createPreviewTrack(deviceID);    
    }
  }

  function createPreviewTrack(deviceID: string) {
    Video.createLocalVideoTrack({
      deviceId: { exact: deviceID },
    }).then((newTrack) => {
      console.log(`Preview track created with deviceID: ${newTrack.mediaStreamTrack.getSettings().deviceId}`);
      if (previewVideo) {
        previewVideo?.stop(); // Stop the old preview track if there is one
        console.log(`Stopped old preview track before attaching new one`);
      }
      setPreviewVideo(newTrack);
      if (localVideo) {
        // If in the context of a Room, unpublish the old track
        const localTrackPublication = room?.localParticipant?.unpublishTrack(localVideo);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        room?.localParticipant?.emit("trackUnpublished", localTrackPublication);
        // Set the new track as the active track, and publish
        setLocalTracks("video", newTrack);
        room?.localParticipant?.publishTrack(localVideo);

      }
    }).catch((error) => {
      toaster.push({
        message: `Error creating local track - ${error.message}`,
        variant: "error",
      });
    });
  }

  useEffect(() => {
    console.log("useEffect > ConfigureSettings");
    console.log("devicePermissions", devicePermissions);
  }, [devicePermissions]);

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
            {devicePermissions.camera && (
              <VideoPreview
                identity={identity ?? "Guest"}
                localVideo={previewVideo}
              />
            )}
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">
                Video{" "}
                {devicePermissions.camera && localVideo === undefined
                  ? "(disabled)"
                  : localVideo?.isStopped
                  ? "(stopped)"
                  : ""}
              </Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "video")}
                defaultValue={
                  devicePermissions.camera
                    ? videoInputDeviceId ?? ""
                    : "no-cam-permission"
                }
                disabled={
                  videoInputDevices.length < 2 || !devicePermissions.camera
                }
              >
                {devicePermissions.camera ? (
                  videoInputDevices.map((videoInput: MediaDeviceInfo) => (
                    <Option
                      key={videoInput.deviceId}
                      value={videoInput.deviceId}
                    >
                      {videoInput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-cam-permission" value="no-cam-permission">
                    Camera permissions have not been granted in the browser
                  </Option>
                )}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Input</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioInput")}
                defaultValue={
                  devicePermissions.microphone ? "" : "no-mic-permission"
                }
                disabled={
                  audioInputDevices.length < 2 || !devicePermissions.microphone
                }
              >
                {devicePermissions.microphone ? (
                  audioInputDevices.map((audioInput: MediaDeviceInfo) => (
                    <Option
                      key={audioInput.deviceId}
                      value={audioInput.deviceId}
                    >
                      {audioInput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-mic-permission" value="no-mic-permission">
                    Microphone permissions have not been granted in the browser
                  </Option>
                )}
              </Select>
            </Stack>
            <Stack orientation="vertical" spacing="space30">
              <Label htmlFor="author">Audio Output</Label>
              <Select
                id="author"
                onChange={(e) => deviceChange(e.target.value, "audioOutput")}
              >
                {devicePermissions.microphone ? (
                  audioOutputDevices.map((audioOutput: MediaDeviceInfo) => (
                    <Option
                      key={audioOutput.deviceId}
                      value={audioOutput.deviceId}
                    >
                      {audioOutput.label}
                    </Option>
                  ))
                ) : (
                  <Option key="no-mic-permission" value="no-mic-permission">
                    Microphone permissions have not been granted in the browser
                  </Option>
                )}
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
