import React, { useEffect, useState } from "react";
import {
  Flex,
  Card,
  Stack,
  Label,
  Input,
  HelpText,
  Button,
  Alert,
  Callout,
  CalloutHeading,
  CalloutText,
} from "@twilio-paste/core";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CenterContent, MaxWidthDiv } from "../../styled";
import TwilioHeading from "../../TwilioHeading/TwilioHeading";
import { useVideoStore, VideoAppState, UIStep } from "../../../store/store";
import { TEXT_COPY } from "../../../lib/constants";

const formSchema = yup
  .object({
    identity: yup.string().required(),
    roomName: yup.string().required(),
  })
  .required();

export default function LandingScreen({}) {
  const router = useRouter();
  const [roomNameDisabled, setRoomNameDisabled] = useState(false);
  const { ROOM_NAME_INPUT_DISABLED, ROOM_NAME_INPUT_ENABLED } = TEXT_COPY;
  const setUIStep = useVideoStore((state: VideoAppState) => state.setUIStep);
  const setFormData = useVideoStore(
    (state: VideoAppState) => state.setFormData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      identity: "",
      roomName: "",
    },
  });

  const handleFormSave = (data: { identity: string; roomName: string }) => {
    setFormData(data);
    setUIStep(UIStep.PRE_JOIN_SCREEN);
  };

  useEffect(() => {
    const { roomName } = router.query;
    // Joining with an invite link, pre-populate input field and disable
    if (roomName) {
      setValue("roomName", String(roomName));
      setRoomNameDisabled(true);
    }
  }, [router]);

  return (
    <CenterContent>
      <Flex
        hAlignContent={"center"}
        vertical
        vAlignContent={"center"}
        height="100%"
      >
        <TwilioHeading heading="Twilio Video Feature Demo" />
        <MaxWidthDiv>
          <Stack orientation="vertical" spacing="space60">
            <Callout variant="new">
              <CalloutHeading as="h3">Ahoy!</CalloutHeading>
              <CalloutText>
                This quickstart application aims at getting you stood up rapidly
                with a React web application, powered by{" "}
                <a
                  href="https://www.twilio.com/docs/video/javascript"
                  target="_blank"
                  rel="noopener"
                >
                  Twilio Video JS
                </a>
                .
              </CalloutText>
            </Callout>
            <Card>
              <form onSubmit={handleSubmit(handleFormSave)}>
                <Flex vertical>
                  <Flex marginTop="space20" vertical width="100%">
                    <Label htmlFor="identity" required>
                      Participant Name
                    </Label>
                    <Input {...register("identity")} type="text" />
                    {errors.identity && (
                      <Flex marginTop="space40" marginBottom="space40">
                        <Alert variant="error">
                          {errors?.identity?.message ?? ""}
                        </Alert>
                      </Flex>
                    )}
                  </Flex>
                  <Flex marginTop="space40" vertical width="100%">
                    <Label htmlFor="roomName" required>
                      Room Name
                    </Label>
                    <Input
                      {...register("roomName")}
                      type="text"
                      placeholder="ex. 123456"
                      disabled={roomNameDisabled}
                    />
                    <HelpText id="email_help_text">
                      {roomNameDisabled
                        ? ROOM_NAME_INPUT_DISABLED
                        : ROOM_NAME_INPUT_ENABLED}
                    </HelpText>
                    {errors.roomName && (
                      <Flex marginTop="space40" marginBottom="space40">
                        <Alert variant="error">
                          {errors?.roomName?.message ?? ""}
                        </Alert>
                      </Flex>
                    )}
                  </Flex>
                  <Flex marginTop={"space40"}>
                    <Button
                      type="submit"
                      variant="destructive"
                      style={{ background: "#F22F46" }}
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Card>
          </Stack>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
