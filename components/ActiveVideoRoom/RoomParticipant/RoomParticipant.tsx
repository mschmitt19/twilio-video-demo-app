import React from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { Participant as IParticipant } from "twilio-video";

interface RoomParticipantProps {
  participant: IParticipant;
  isLocalParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

export default function RoomParticipant({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
}: RoomParticipantProps) {
  console.log("participant", participant);
  const tracks = Array.from(participant.tracks.values());
  const InfoContainer = styled.div(
    css({
      border: `4px solid ${
        isDominantSpeaker ? "rgb(4, 184, 52)" : "rgb(197, 199, 197)"
      }`,
      borderRadius: "8px",
    })
  );

  const TracksContainer = styled.div(
    css({
      border: "",
    })
  );

  return (
    <InfoContainer id={participant.sid}>
      {/* {participant.videoTracks.forEach(
        (track: any) => track.kind === "video" && <VideoTrack track={track} />
      )} */}
    </InfoContainer>
  );
}
