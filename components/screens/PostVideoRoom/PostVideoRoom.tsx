import React from "react";
import { Flex, Card, Heading, Text, Button } from "@twilio-paste/core";

import { useVideoStore, VideoAppState } from "../../../store/store";
import { CenterContent, MaxWidthDiv } from "../../styled";
import TwilioHeading from "../../TwilioHeading/TwilioHeading";

export default function PostVideoRoom({}) {
  const formData = useVideoStore((state: VideoAppState) => state.formData);
  const resetState = useVideoStore((state: VideoAppState) => state.resetState);

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        <TwilioHeading heading={`Post Video Room - ${formData.roomName}`} />
        <MaxWidthDiv>
          <Card>
            <Heading as="h4" variant="heading40">
              Survey / Experience Collection
            </Heading>
            <Text
              as="p"
              fontSize="fontSize20"
              fontWeight="fontWeightMedium"
              color="colorText"
            >
              Use this state of the application to gather post video room
              surveys (guage the overall experience, issues faced, etc.)
            </Text>
            <Flex marginTop={"space60"}>
              <Button
                type="submit"
                variant="destructive"
                style={{ background: "#F22F46" }}
                onClick={() => resetState()}
              >
                Back to Landing Page
              </Button>
            </Flex>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
