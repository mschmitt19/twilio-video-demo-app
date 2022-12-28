import React from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { Text } from "@twilio-paste/core";
import {
  Participant as IParticipant,
  RemoteVideoTrack,
  RemoteAudioTrack,
  LocalAudioTrack,
  LocalVideoTrack,
} from "twilio-video";
import { RxAvatar } from "react-icons/rx";

import ParticipantTracks from "../../ParticipantTracks/ParticipantTracks";
import usePublications from "../../../lib/hooks/usePublications";
import useTrack from "../../../lib/hooks/useTrack";
import useIsTrackSwitchedOff from "../../../lib/hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../../../lib/hooks/useParticipantIsReconnecting";
import {
  VideoPreviewContainer,
  OverlayContent,
  InnerPreviewContainer,
  AvatarContainer,
} from "../../styled";

interface RoomParticipantProps {
  participant: IParticipant;
  isLocalParticipant: boolean;
  isDominantSpeaker?: boolean;
}

/* WORK IN PROGRESS */

export default function Participant({
  participant,
  isLocalParticipant,
  isDominantSpeaker,
}: RoomParticipantProps) {
  const { identity } = participant;
  const publications = usePublications(participant);
  const audioPublication = publications.find((p) => p.kind === "audio");
  const videoPublication = publications.find(
    (p) => !p.trackName.includes("screen") && p.kind === "video"
  );
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find((p) =>
    p.trackName.includes("screen")
  );
  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(
    videoTrack as LocalVideoTrack | RemoteVideoTrack
  );

  const audioTrack = useTrack(audioPublication) as
    | LocalAudioTrack
    | RemoteAudioTrack
    | undefined;
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const InfoContainer = styled.div(
    css({
      border: `2px solid ${
        isDominantSpeaker ? "rgb(4, 184, 52)" : "rgb(197, 199, 197)"
      }`,
      borderRadius: "10px",
      width: "100%",
      maxWidth: "500px",
    })
  );

  return (
    <InfoContainer id={participant.sid}>
      <VideoPreviewContainer>
        <OverlayContent>
          <Text as="p" color="colorText" fontSize="fontSize10">
            {isLocalParticipant ? `${identity} (you)` : identity}
          </Text>
        </OverlayContent>
        <InnerPreviewContainer>
          {(!isVideoEnabled || isVideoSwitchedOff) && (
            <AvatarContainer>
              <RxAvatar
                style={{ width: "50px", height: "50px", color: "#FFFFFF" }}
              />
            </AvatarContainer>
          )}
          <ParticipantTracks
            isLocal={isLocalParticipant}
            participant={participant}
          />
        </InnerPreviewContainer>
      </VideoPreviewContainer>
    </InfoContainer>
  );
}
