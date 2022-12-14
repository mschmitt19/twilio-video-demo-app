import React, { useState } from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { LocalTrack, Participant as IParticipant } from "twilio-video";
import VideoPublication from "../../VideoPublication/VideoPublication";

interface RoomParticipantProps {
  participant: IParticipant;
  isLocalParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

/* WORK IN PROGRESS -- needs attention */

export default function RoomParticipant({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
}: RoomParticipantProps) {
  console.log("participant", participant);
  // const tracks = Array.from(participant.tracks.values());
  const track = Array.from(participant.videoTracks.values())[0];
  console.log(track);
  //const videoTracks = tracks.filter((track: any) => track.kind === "videoinput");
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
      <VideoPublication identity={participant.identity} localVideo={track} />
    </InfoContainer>
  );
}
