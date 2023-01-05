import React from "react";
import { styled, css } from "@twilio-paste/styling-library";
import { Stack, Text } from "@twilio-paste/core";
import {
  Participant as IParticipant,
  RemoteVideoTrack,
  RemoteAudioTrack,
  LocalAudioTrack,
  LocalVideoTrack,
} from "twilio-video";
import { RxAvatar } from "react-icons/rx";

import ParticipantTracks from "../ParticipantTracks/ParticipantTracks";
import usePublications from "../../../../lib/hooks/usePublications";
import useTrack from "../../../../lib/hooks/useTrack";
import useIsTrackSwitchedOff from "../../../../lib/hooks/useIsTrackSwitchedOff";
import useParticipantIsReconnecting from "../../../../lib/hooks/useParticipantIsReconnecting";
import {
  VideoPreviewContainer,
  OverlayContent,
  InnerPreviewContainer,
  AvatarContainer,
} from "../../../styled";
import useIsTrackEnabled from "../../../../lib/hooks/useIsTrackEnabled";
import { BsMicFill, BsMicMute } from "react-icons/bs";

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
  const isAudioEnabled = useIsTrackEnabled(audioTrack);
  const isParticipantReconnecting = useParticipantIsReconnecting(participant);

  const InfoContainer = styled.div(
    css({
      border: `3px solid ${
        isDominantSpeaker ? "rgb(4, 184, 52)" : "rgb(197, 199, 197)"
      }`,
      borderRadius: "10px",
      width: "100%",
    })
  );

  return (
    <InfoContainer id={participant.sid}>
      <VideoPreviewContainer>
        <OverlayContent>
          <Stack orientation="horizontal" spacing="space10">
            {isAudioEnabled ? (
              <BsMicFill
                style={{
                  width: "12px",
                  height: "12px",
                  color: "rgb(72, 221, 0)",
                }}
              />
            ) : (
              <BsMicMute
                style={{
                  width: "12px",
                  height: "12px",
                  color: "rgb(221, 39, 0)",
                }}
              />
            )}
            <Text as="p" color="colorText" fontSize="fontSize10">
              {isLocalParticipant ? `${identity} (you)` : identity}
            </Text>
          </Stack>
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
