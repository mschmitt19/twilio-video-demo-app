import React, { useEffect, useState } from "react";
import { Flex, Stack, Grid, Column, Box } from "@twilio-paste/core";
import * as Video from "twilio-video";

import { useVideoStore, VideoAppState } from "../../../store/store";
import {
  ActiveVideoRoomContainer,
  FooterDiv,
  ParticipantContainer,
} from "../../styled";
import TwilioHeading from "../../TwilioHeading/TwilioHeading";
import Participant from "./Participant/Participant";
import ConfigureSettings from "../../ConfigureSettings/ConfigureSettings";
import ToggleVideo from "./LocalControls/ToggleVideo/ToggleVideo";
import ToggleAudio from "./LocalControls/ToggleAudio/ToggleAudio";
import ToggleScreenshare from "./LocalControls/ToggleScreenshare/ToggleScreenshare";
import LeaveRoom from "./LocalControls/LeaveRoom/LeaveRoom";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function ActiveVideoRoom({}) {
  const { room, formData } = useVideoStore((state: VideoAppState) => state);
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
      <ParticipantContainer>
        <TwilioHeading heading={`Video Room - ${formData.roomName}`} />
        <Grid
          vertical={orderedParticipants.length > 0 ? [true, true, false] : true}
          gutter={["space20"]}
        >
          {orderedParticipants.length > 0 &&
            orderedParticipants.map((remoteParticipant: OrderedParticipant) => {
              const isDominant = !!dominantSpeaker
                ? dominantSpeaker.sid === remoteParticipant.participant.sid
                : false;
              return (
                <Column
                  key={remoteParticipant.participant.sid}
                  span={orderedParticipants.length > 1 ? [12, 6, 4] : [12, 6]}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Participant
                      participant={remoteParticipant.participant}
                      isLocalParticipant={false}
                      isDominantSpeaker={isDominant}
                    />
                  </Box>
                </Column>
              );
            })}
          <Column span={orderedParticipants.length > 1 ? [12, 6, 4] : [12, 6]}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Participant
                participant={room!.localParticipant}
                isLocalParticipant
              />
            </Box>
          </Column>
        </Grid>
      </ParticipantContainer>
      <FooterDiv>
        <Flex
          width="100%"
          height="100%"
          hAlignContent={"center"}
          vAlignContent="center"
        >
          <Stack orientation="horizontal" spacing="space70">
            <ToggleAudio />
            <ToggleVideo />
            <ToggleScreenshare />
            <ConfigureSettings />
            <LeaveRoom />
          </Stack>
        </Flex>
      </FooterDiv>
    </ActiveVideoRoomContainer>
  );
}
