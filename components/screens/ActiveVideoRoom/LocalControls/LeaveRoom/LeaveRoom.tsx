import React from "react";
import {
  Button,
  Box,
  PopoverContainer,
  PopoverButton,
  Popover,
  Heading,
  Separator,
  Text,
} from "@twilio-paste/core";
import { CgClose } from "react-icons/cg";

import {
  UIStep,
  useVideoStore,
  VideoAppState,
} from "../../../../../store/store";

export default function LeaveRoom() {
  const { room, localTracks, clearActiveRoom, setUIStep } = useVideoStore(
    (state: VideoAppState) => state
  );

  function disconnect() {
    if (room) {
      localTracks.audio?.stop();
      localTracks.video?.stop();
      room.disconnect();
      clearActiveRoom();
      setUIStep(UIStep.VIDEO_ROOM_DISCONNECT);
    }
  }

  return (
    <PopoverContainer baseId="popover-right-example" placement="top">
      <PopoverButton variant="destructive" size="circle">
        <CgClose style={{ width: "25px", height: "25px" }} />
      </PopoverButton>
      <Popover aria-label="Popover">
        <Box width="size20">
          <Heading as="h3" variant="heading30">
            Leave Room?
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Text as="span">Are you sure you want to leave the video room?</Text>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Button onClick={disconnect} variant="destructive" fullWidth>
            Disconnect
          </Button>
        </Box>
      </Popover>
    </PopoverContainer>
  );
}
