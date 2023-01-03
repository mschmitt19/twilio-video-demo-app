import React from "react";
import * as Video from "twilio-video";
import { Tooltip, Button } from "@twilio-paste/core";
import { BsMicFill, BsMicMute } from "react-icons/bs";

import { useVideoStore, VideoAppState } from "../../../../store/store";
import useIsTrackEnabled from "../../../../lib/hooks/useIsTrackEnabled";

export default function ToggleAudio() {
  const { localTracks, setLocalTracks, room } = useVideoStore(
    (state: VideoAppState) => state
  );
  const audioTrack = localTracks.audio;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudio = () => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    } else {
      console.log("setup local audio track");
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const audioInput = devices.find(
            (device) => device.kind === "audioinput"
          );
          return Video.createLocalTracks({
            audio: { deviceId: audioInput?.deviceId },
            video: false,
          });
        })
        .then((localTracks) => {
          console.log("localTracks...", localTracks);
          room?.localParticipant?.publishTrack(localTracks[0]);
          setLocalTracks("audio", localTracks[0]);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  return (
    <Tooltip
      text={!audioTrack ? "No audio" : isEnabled ? "Mute mic" : "Unmute mic"}
      placement="bottom"
    >
      <Button
        variant={isEnabled ? "primary" : "destructive"}
        size="circle"
        onClick={toggleAudio}
      >
        {isEnabled ? (
          <BsMicFill style={{ width: "25px", height: "25px" }} />
        ) : (
          <BsMicMute style={{ width: "25px", height: "25px" }} />
        )}
      </Button>
    </Tooltip>
  );
}
