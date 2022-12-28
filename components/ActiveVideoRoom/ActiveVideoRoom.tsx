import React, { useEffect, useState } from "react";
import { Flex, Stack, Grid, Column, Box } from "@twilio-paste/core";
import * as Video from "twilio-video";

import { useVideoStore, VideoAppState } from "../../store/store";
import {
  ActiveVideoRoomContainer,
  FooterDiv,
  ParticipantContainer,
} from "../styled";
import TwilioHeading from "../TwilioHeading/TwilioHeading";
import Participant from "./Participant/Participant";
import ConfigureSettings from "../ConfigureSettings/ConfigureSettings";
import ToggleVideo from "./LocalControls/ToggleVideo/ToggleVideo";
import ToggleAudio from "./LocalControls/ToggleAudio/ToggleAudio";
import ToggleScreenshare from "./LocalControls/ToggleScreenshare/ToggleScreenshare";
import LeaveRoom from "./LocalControls/LeaveRoom/LeaveRoom";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function ActiveVideoRoom({}) {
  const { room, formData, localTracks } = useVideoStore(
    (state: VideoAppState) => state
  );
  const isVideoEnabled = !!localTracks.video;
  console.log("isVideoEnabled", isVideoEnabled);

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

      room.on("participantConnected", handleParticipantConnected);
      room.on("participantDisconnected", handleParticipantDisconnected);

      return () => {
        room.off("participantConnected", handleParticipantConnected);
        room.off("participantDisconnected", handleParticipantDisconnected);
      };
    }
  }, [room]);

  return (
    <ActiveVideoRoomContainer>
      <ParticipantContainer>
        <TwilioHeading heading={`Video Room - ${formData.roomName}`} />
        <Grid vertical={[true, true, false]}>
          {orderedParticipants.length > 0 &&
            orderedParticipants.map((remoteParticipant: OrderedParticipant) => {
              return (
                <Column key={remoteParticipant.participant.sid}>
                  <Box
                    height="size40"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Participant
                      participant={remoteParticipant.participant}
                      isLocalParticipant={false}
                    />
                  </Box>
                </Column>
              );
            })}

          <Column>
            <Box
              height="size40"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
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
