import React, { useState } from "react";
import { Card, Flex, Button, Stack } from "@twilio-paste/core";
import * as Video from "twilio-video";

import { useGetToken } from "../../lib/api";
import { UIStep, useVideoStore, VideoAppState } from "../../store/store";
import { CenterContent, MaxWidthDiv } from "../styled";
import TwilioHeading from "../TwilioHeading/TwilioHeading";

export default function PreJoinScreen({}) {
  const formData = useVideoStore((state: VideoAppState) => state.formData);
  const setActiveRoom = useVideoStore(
    (state: VideoAppState) => state.setActiveRoom
  );
  const setUIStep = useVideoStore((state: VideoAppState) => state.setUIStep);
  const { roomName, identity } = formData;
  const { data } = useGetToken(roomName, identity);
  const [loading, setLoading] = useState(false);

  const joinVideoClicked = async () => {
    setLoading(true);

    if (data.token) {
      Video.connect(data.token)
        .then((room: Video.Room) => setActiveRoom(room))
        .then(() => setUIStep(UIStep.VIDEO_ROOM));
    }

    setLoading(false);
  };

  // Get Access Token and Run Preflight Test
  // useEffect(() => {
  //   fetch(`/api/token?roomName=${roomName}&identity=${identity}`)
  //     .then((response) => response.json())
  //     // 4. Setting *dogImage* to the image url that we received from the response above
  //     .then((data) => {
  //       const { token } = data;
  //       const preflightTest = runPreflight(token);

  //       preflightTest.on("progress", (progress) => {
  //         console.log("progress ", progress);
  //       });

  //       preflightTest.on("completed", (report) => {
  //         console.log("completed", report);
  //         setPreflightResults(report);
  //       });

  //       preflightTest.on("failed", (error) => {
  //         console.log("failed", error);
  //       });
  //     });
  // }, []);

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        <MaxWidthDiv>
          <TwilioHeading heading={`Video Room - ${formData.roomName}`} />
          <Card padding="space100">
            <Stack orientation="vertical" spacing="space30">
              <Button
                variant="destructive"
                onClick={async () => await joinVideoClicked()}
                loading={loading}
                style={{ background: "#F22F46" }}
              >
                Join Video Room
              </Button>
              <span
                style={{
                  color: "#000000",
                  lineHeight: 1,
                  fontSize: "12px",
                  letterSpacing: "wider",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                Click to join the video room!
              </span>
            </Stack>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
