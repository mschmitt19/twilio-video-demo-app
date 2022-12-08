import React, { useEffect, useRef } from "react";
import { styled, css } from "@twilio-paste/styling-library";

interface VideoTrackProps {
  track: any;
  isLocal?: boolean;
}

const Video = styled("video")(
  css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
  })
);

export default function VideoTrack({ track, isLocal }: VideoTrackProps) {
  console.log("track", track);
  const ref = useRef<HTMLVideoElement>(null!);
  useEffect(() => {
    const el = ref.current;
    el.muted = true;

    track.attach(el);
    return () => {
      track.detach(el);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      el.srcObject = null;
    };
  }, [track]);

  return <Video ref={ref} />;
}
