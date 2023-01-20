import React, { useState } from "react";
import * as Video from "twilio-video";
import { Tooltip, Button, useToaster, Toaster } from "@twilio-paste/core";
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";

import useDevices from "../../../../../lib/hooks/useDevices";
import { useVideoStore, VideoAppState } from "../../../../../store/store";
import { SELECTED_VIDEO_INPUT_KEY } from "../../../../../lib/constants";

export default function ToggleVideo() {
  const toaster = useToaster();
  const [isPublishing, setIsPublishing] = useState(false);
  const { localTracks, room, clearTrack, setLocalTracks, devicePermissions } =
    useVideoStore((state: VideoAppState) => state);
  const { hasVideoInputDevices } = useDevices(devicePermissions);
  const storedLocalVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

  const toggleVideo = () => {
    if (!isPublishing) {
      if (localTracks.video) {
        localTracks.video.stop();
        clearTrack("video");
        const localTrackPublication = room?.localParticipant?.unpublishTrack(
          localTracks.video
        );
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        room?.localParticipant?.emit("trackUnpublished", localTrackPublication);
      } else {
        setIsPublishing(true);
        // setup local video track
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            // TODO: Tidy this logic. Seems lengthy
            const videoInput = devices.find(
              (device) => device.kind === "videoinput" && 
                (!storedLocalVideoDeviceId || device.deviceId === storedLocalVideoDeviceId)  
            );
            return Video.createLocalTracks({
              video: { deviceId: videoInput?.deviceId },
              audio: false,
            });
          })
          .then((localTracks) => {
            room?.localParticipant?.publishTrack(localTracks[0]);
            setLocalTracks("video", localTracks[0]);
            setIsPublishing(false);
          })
          .catch((error) => {
            toaster.push({
              message: `Error enabling Camera - ${error.message}`,
              variant: "error",
            });
          });
      }
    }
  };

  return (
    <>
      <Tooltip
        text={
          !hasVideoInputDevices
            ? "No video"
            : !!localTracks.video
            ? "Stop Camera"
            : "Start Camera"
        }
        placement="bottom"
      >
        <Button
          variant={!!localTracks.video ? "primary" : "destructive"}
          size="circle"
          onClick={toggleVideo}
        >
          {!!localTracks.video ? (
            <BsCameraVideoFill style={{ width: "25px", height: "25px" }} />
          ) : (
            <BsCameraVideoOff style={{ width: "25px", height: "25px" }} />
          )}
        </Button>
      </Tooltip>
      <Toaster {...toaster} />
    </>
  );
}
