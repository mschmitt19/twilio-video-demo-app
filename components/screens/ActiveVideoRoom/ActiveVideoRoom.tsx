import React, { useEffect, useState } from "react";
import { Flex, Stack } from "@twilio-paste/core";
import * as Video from "twilio-video";

import { UIStep, useVideoStore, VideoAppState } from "../../../store/store";
import {
  ActiveVideoRoomContainer,
  FooterDiv,
  ParticipantContainer,
} from "../../styled";
import Participant from "./Participant/Participant";
import ConfigureSettings from "../../ConfigureSettings/ConfigureSettings";
import ToggleVideo from "./LocalControls/ToggleVideo/ToggleVideo";
import ToggleAudio from "./LocalControls/ToggleAudio/ToggleAudio";
import ToggleScreenshare from "./LocalControls/ToggleScreenshare/ToggleScreenshare";
import LeaveRoom from "./LocalControls/LeaveRoom/LeaveRoom";
import RoomInfo from "./RoomInfo/RoomInfo";
import {
  GALLERY_VIEW_ASPECT_RATIO,
  GALLERY_VIEW_MARGIN,
} from "../../../lib/constants";
import useGalleryViewLayout from "../../../lib/hooks/useGalleryViewLayout";
// import HiddenWhen from "../../HiddenWhen/HiddenWhen";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function ActiveVideoRoom({}) {
  const { room, formData, setUIStep, localTracks, setDisconnectError } =
    useVideoStore((state: VideoAppState) => state);
  const [dominantSpeaker, setDominantSpeaker] =
    useState<Video.RemoteParticipant | null>(null);
  const [orderedParticipants, setOrderedParticipants] = useState<
    OrderedParticipant[]
  >(
    Array.from(room?.participants?.values() ?? [], (p) => ({
      participant: p,
      dominantSpeakerStartTime: 0,
    }))
  );

  const numParticipants =
    orderedParticipants.length > 0 ? orderedParticipants.length + 1 : 1;
  const { participantVideoWidth, containerRef } =
    useGalleryViewLayout(numParticipants);
  const participantWidth = `${participantVideoWidth}px`;
  const participantHeight = `${Math.floor(
    participantVideoWidth * GALLERY_VIEW_ASPECT_RATIO
  )}px`;
  console.log("orderedParticipants", orderedParticipants);
  console.log("room.localParticipant", room?.localParticipant);

  useEffect(() => {
    if (room) {
      const participantArray = Array.from(room.participants.values(), (p) => ({
        participant: p,
        dominantSpeakerStartTime: 0,
      }));
      setOrderedParticipants(participantArray);

      const handleParticipantConnected = (
        participant: Video.RemoteParticipant
      ) => {
        console.log("participantConnected", participant);
        setOrderedParticipants((prevParticipants) => [
          ...prevParticipants,
          { participant, dominantSpeakerStartTime: 0 },
        ]);
      };

      const handleParticipantDisconnected = (
        participant: Video.RemoteParticipant
      ) => {
        setOrderedParticipants((prevParticipants) =>
          prevParticipants.filter((p) => p.participant !== participant)
        );
      };

      const handleDominantSpeakerChanged = (
        participant: Video.RemoteParticipant
      ) => {
        console.log("The new dominant speaker in the Room is:", participant);
        if (participant) {
          setDominantSpeaker(participant);
        } else {
          setDominantSpeaker(null);
        }
      };

      room.on("participantConnected", handleParticipantConnected);
      room.on("participantDisconnected", handleParticipantDisconnected);
      room.on("dominantSpeakerChanged", handleDominantSpeakerChanged);
      room.once("disconnected", (room, error) => {
        console.log("room", room);
        console.log("error", error);
        localTracks.audio?.stop();
        localTracks.video?.stop();
        localTracks.screen?.stop();
        if (error) {
          console.log(
            "You were disconnected from the Room:",
            error.code,
            error.message
          );
          setDisconnectError(error.code, error.message);
        }
        setUIStep(UIStep.VIDEO_ROOM_DISCONNECT);
      });

      return () => {
        room.off("participantConnected", handleParticipantConnected);
        room.off("participantDisconnected", handleParticipantDisconnected);
        room.off("dominantSpeakerChanged", handleDominantSpeakerChanged);
      };
    }
  }, [room]);

  // Disconnect from the Video room if browser tab is refreshed or closed
  window.addEventListener("beforeunload", () => {
    room?.disconnect();
  });

  return (
    <ActiveVideoRoomContainer>
      <ParticipantContainer ref={containerRef}>
        {orderedParticipants.length > 0 &&
          orderedParticipants.map((remoteParticipant: OrderedParticipant) => {
            const isDominant = !!dominantSpeaker
              ? dominantSpeaker.sid === remoteParticipant.participant.sid
              : false;
            return (
              <div
                key={remoteParticipant.participant.sid}
                style={{
                  width: participantWidth,
                  height: participantHeight,
                  margin: GALLERY_VIEW_MARGIN,
                }}
              >
                <Participant
                  participant={remoteParticipant.participant}
                  isLocalParticipant={false}
                  isDominantSpeaker={isDominant}
                />
              </div>
            );
          })}
        <div
          key={room!.localParticipant.sid}
          style={{
            width: participantWidth,
            height: participantHeight,
            margin: GALLERY_VIEW_MARGIN,
          }}
        >
          <Participant
            participant={room!.localParticipant}
            isLocalParticipant
          />
        </div>
      </ParticipantContainer>
      <FooterDiv>
        <Flex width="100%" height="100%" vAlignContent="center">
          {/* <HiddenWhen> */}
          <Flex>
            <RoomInfo
              roomName={formData.roomName}
              numParticipants={orderedParticipants.length + 1}
            />
          </Flex>
          {/* </HiddenWhen> */}
          <Flex grow hAlignContent={"center"}>
            <Stack orientation="horizontal" spacing="space70">
              <ToggleAudio />
              <ToggleVideo />
              <ToggleScreenshare />
              <ConfigureSettings />
            </Stack>
          </Flex>
          <Flex>
            <Flex width="100%" hAlignContent={"right"} vAlignContent={"center"}>
              <LeaveRoom />
            </Flex>
          </Flex>
        </Flex>
      </FooterDiv>
    </ActiveVideoRoomContainer>
  );
}
