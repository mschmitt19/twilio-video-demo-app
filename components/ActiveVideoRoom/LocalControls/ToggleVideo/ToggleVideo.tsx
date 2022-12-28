import React, { useState } from "react";
import { Tooltip, Button } from "@twilio-paste/core";
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";

import useDevices from "../../../../lib/hooks/useDevices";
import { useVideoStore, VideoAppState } from "../../../../store/store";

export default function ToggleVideo() {
  const [isPublishing, setIspublishing] = useState(false);
  const { localTracks, room, clearTrack } = useVideoStore(
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
        setIspublishing(true);
        // TODO: publish video track on camera enabled
        console.log("TODO: implement video track enablement/publishing");

        // getLocalVideoTrack()
        //   .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
        //   .catch(onError)
        //   .finally(() => {
        //     setIspublishing(false);
        //   });
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
