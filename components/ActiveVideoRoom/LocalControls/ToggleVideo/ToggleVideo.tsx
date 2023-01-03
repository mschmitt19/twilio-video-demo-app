import React, { useState } from "react";
import * as Video from "twilio-video";
import { Tooltip, Button } from "@twilio-paste/core";
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";

import useDevices from "../../../../lib/hooks/useDevices";
import { useVideoStore, VideoAppState } from "../../../../store/store";

export default function ToggleVideo() {
  const [isPublishing, setIsPublishing] = useState(false);
  const { localTracks, room, clearTrack, setLocalTracks } = useVideoStore(
    (state: VideoAppState) => state
  );
  const { hasVideoInputDevices } = useDevices();

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
        console.log("setup local video track");
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const videoInput = devices.find(
              (device) => device.kind === "videoinput"
            );
            return Video.createLocalTracks({
              video: { deviceId: videoInput?.deviceId },
              audio: false,
            });
          })
          .then((localTracks) => {
            console.log("localTracks...", localTracks);
            room?.localParticipant?.publishTrack(localTracks[0]);
            setLocalTracks("video", localTracks[0]);
            setIsPublishing(false);
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    }
  };

  return (
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
  );
}
