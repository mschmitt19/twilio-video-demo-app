import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Button,
  Flex,
  Stack,
  Grid,
  Column,
  Box,
  PopoverContainer,
  PopoverButton,
  Popover,
  Heading,
  Separator,
  Text,
} from "@twilio-paste/core";
import * as Video from "twilio-video";
import { BsMicFill, BsCameraVideoFill } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { TbScreenShare } from "react-icons/tb";

import { UIStep, useVideoStore, VideoAppState } from "../../store/store";
import {
  ActiveVideoRoomContainer,
  FooterDiv,
  ParticipantContainer,
} from "../styled";
import TwilioHeading from "../TwilioHeading/TwilioHeading";
import RoomParticipant from "./RoomParticipant/RoomParticipant";
import ConfigureSettings from "../ConfigureSettings/ConfigureSettings";

interface OrderedParticipant {
  participant: Video.RemoteParticipant;
  dominantSpeakerStartTime: number;
}

export default function ActiveVideoRoom({}) {
  const room = useVideoStore((state: VideoAppState) => state.room);
  const formData = useVideoStore((state: VideoAppState) => state.formData);
  const setUIStep = useVideoStore((state: VideoAppState) => state.setUIStep);
  const localTracks = useVideoStore(
    (state: VideoAppState) => state.localTracks
  );
  const clearActiveRoom = useVideoStore(
    (state: VideoAppState) => state.clearActiveRoom
  );
  const [orderedParticipants, setOrderedParticipants] = useState<
    OrderedParticipant[]
  >(
    Array.from(room?.participants?.values() ?? [], (p) => ({
      participant: p,
      dominantSpeakerStartTime: 0,
    }))
  );
  console.log(orderedParticipants);

  function disconnect() {
    if (room) {
      localTracks.audio?.stop();
      localTracks.video?.stop();
      room.disconnect();
      clearActiveRoom();
      setUIStep(UIStep.VIDEO_ROOM_DISCONNECT);
    }
  }

  function handleTrackPublication(trackPublication: any, participant: any) {
    function displayTrack(track: any) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.sid);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      let trackDom = track.attach();
      trackDom.style.width = "290px";
      trackDom.style.height = "222px";
      participantDiv?.append(trackDom);
    }

    // check if the trackPublication contains a `track` attribute. If it does,
    // we are subscribed to this track. If not, we are not subscribed.
    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  }

  function handleConnectedParticipant(participant: any) {
    console.log("participant", participant);
    const participantDiv = document.getElementById(participant.sid);
    console.log(participantDiv);

    participant.tracks.forEach((trackPublication: any) => {
      handleTrackPublication(trackPublication, participant);
    });
  }

  // useEffect(() => {
  //   handleConnectedParticipant(room?.localParticipant);
  //   console.log("room", room);
  //   room?.participants.forEach(handleConnectedParticipant);
  // }, []);

  useEffect(() => {
    if (room) {
      //handleConnectedParticipant(room?.localParticipant);
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
        <Grid
          //gutter={["space20", "space60", "space90"]}
          vertical={[true, true, false]}
          //equalColumnHeights
        >
          {/* {orderedParticipants.forEach(
            (remoteParticipant: OrderedParticipant) => {
              console.log("looping...", remoteParticipant);
              return (
                <Column key={remoteParticipant.participant.sid}>
                  <Box
                    //backgroundColor="colorBackgroundPrimaryWeaker"
                    height="size40"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    test
                    <RoomParticipant
                      participant={remoteParticipant.participant}
                      //isDominantSpeaker={true}
                    />
                  </Box>
                </Column>
              );
            }
          )} */}

          <Column>
            <Box
              //backgroundColor="colorBackgroundPrimaryWeaker"
              height="size40"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <RoomParticipant
                participant={room!.localParticipant}
                //isDominantSpeaker={true}
              />
            </Box>
          </Column>
          {/* <Column>
            <Box
              //backgroundColor="colorBackgroundPrimaryWeaker"
              height="size40"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <RoomParticipant
                participant={orderedParticipants[0].participant}
                //isDominantSpeaker={true}
              />
            </Box>
          </Column> */}
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
            <Tooltip text="Mute" placement="bottom">
              <Button variant="primary" size="circle">
                <BsMicFill style={{ width: "25px", height: "25px" }} />
              </Button>
            </Tooltip>
            <Tooltip text="Stop Camera" placement="bottom">
              <Button
                variant="primary"
                size="circle"
                onClick={() => localTracks.video?.stop()}
              >
                <BsCameraVideoFill style={{ width: "25px", height: "25px" }} />
              </Button>
            </Tooltip>
            <Tooltip text="Share Screen" placement="bottom">
              <Button variant={"primary"} size="circle">
                <TbScreenShare style={{ width: "25px", height: "25px" }} />
              </Button>
            </Tooltip>
            <ConfigureSettings />
            <PopoverContainer baseId="popover-right-example" placement="top">
              <PopoverButton variant="destructive" size="circle">
                <CgClose style={{ width: "25px", height: "25px" }} />
              </PopoverButton>
              <Popover aria-label="Popover">
                <Box width="size20">
                  <Heading as="h3" variant="heading30">
                    Leave Room?
                  </Heading>
                  <Separator
                    orientation="horizontal"
                    verticalSpacing="space50"
                  />
                  <Text as="span">
                    Are you sure you want to leave the video room?
                  </Text>
                  <Separator
                    orientation="horizontal"
                    verticalSpacing="space50"
                  />
                  <Button onClick={disconnect} variant="destructive" fullWidth>
                    Disconnect
                  </Button>
                </Box>
              </Popover>
            </PopoverContainer>
          </Stack>
        </Flex>
      </FooterDiv>
    </ActiveVideoRoomContainer>
  );
}
