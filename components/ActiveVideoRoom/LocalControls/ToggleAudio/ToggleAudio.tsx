import React from "react";
import { Tooltip, Button } from "@twilio-paste/core";
import { BsMicFill, BsMicMute } from "react-icons/bs";

import { useVideoStore, VideoAppState } from "../../../../store/store";
import useIsTrackEnabled from "../../../../lib/hooks/useIsTrackEnabled";

export default function ToggleAudio() {
  const { localTracks } = useVideoStore((state: VideoAppState) => state);
  const audioTrack = localTracks.audio;
  const isEnabled = useIsTrackEnabled(audioTrack);

  const toggleAudio = () => {
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
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
