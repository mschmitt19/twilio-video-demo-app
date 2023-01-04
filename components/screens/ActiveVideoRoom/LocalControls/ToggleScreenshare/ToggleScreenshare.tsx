import React, { useState } from "react";
import * as Video from "twilio-video";
import { Tooltip, Button } from "@twilio-paste/core";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";
import { useVideoStore, VideoAppState } from "../../../../../store/store";

export default function ToggleScreenshare() {
  const [isSharing, setIsSharing] = useState(false);
  const { localTracks, room, clearTrack, setLocalTracks } = useVideoStore(
    (state: VideoAppState) => state
  );
  const toggleScreenshare = () => {
    console.log("TODO: implement screenshare");
    if (localTracks.screen) {
      // stop the screenshare
      localTracks.screen.stop();
      room?.localParticipant.unpublishTrack(localTracks.screen);
      clearTrack("screen");
    } else {
      // start the screenshare
      navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => {
          let newScreenTrack = new Video.LocalVideoTrack(stream.getTracks()[0]);
          room?.localParticipant.publishTrack(newScreenTrack);
          setLocalTracks("screen", newScreenTrack);
        })
        .catch(() => {
          alert("Could not share the screen.");
        });
    }
    setIsSharing(!isSharing);
  };

  return (
    <Tooltip
      text={localTracks.screen ? "Stop sharing" : "Share screen"}
      placement="top"
    >
      <Button
        variant={!localTracks.screen ? "primary" : "destructive"}
        size="circle"
        onClick={toggleScreenshare}
      >
        {!localTracks.screen ? (
          <TbScreenShare style={{ width: "25px", height: "25px" }} />
        ) : (
          <TbScreenShareOff style={{ width: "25px", height: "25px" }} />
        )}
      </Button>
    </Tooltip>
  );
}
