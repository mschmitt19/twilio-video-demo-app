import React from "react";
import {
  Button,
  Flex,
  useToaster,
  Toaster,
  Card,
  Text,
  Heading,
} from "@twilio-paste/core";

import { useVideoStore, VideoAppState } from "../../../../store/store";
import { MaxWidthDiv } from "../../../styled";

interface PermissionCheckProps {}

export default function PermissionCheck({}: PermissionCheckProps) {
  const toaster = useToaster();
  const { hasSkippedPermissionCheck, setHasSkippedPermissionCheck, 
        hasPassedPermissionCheck, setHasPassedPermissionCheck } = useVideoStore(
    (state: VideoAppState) => state
  );

  const handleSkip = () => {
    setHasSkippedPermissionCheck(true);
  }
  
  async function requestPermissions() {
    try {
      // get audio and video permissions then stop the tracks
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(async (mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      });
      // The devicechange event is not fired after permissions are granted, so we fire it
      // ourselves to update the useDevices hook. The 500 ms delay is needed so that device labels are available
      // when the useDevices hook updates.
      setTimeout(() => navigator.mediaDevices.dispatchEvent(new Event('devicechange')), 500);
      setHasPassedPermissionCheck(true);
    } catch (error: any) {
      console.log("Error requesting permission", error);
      toaster.push({
        message: `Error requesting permission to camera and mic: ${error.message}`,
        variant: "error",
      });
    }
  }

  return (  
    !hasSkippedPermissionCheck && !hasPassedPermissionCheck ? (
      <>
        <MaxWidthDiv>
          <Card>
            <Heading as="h4" variant="heading40">
              Browser Permissions Needed
            </Heading>
            <Text
              as="p"
              fontSize="fontSize20"
              fontWeight="fontWeightMedium"
              color="colorText"
            >
              To have a video call, please give us access to your camera and microphone.
            </Text>
            <Flex marginTop={"space60"}>
              <Button variant="primary" onClick={requestPermissions}>
                Give access to use camera and mic
              </Button>
              <Button variant="secondary" onClick={handleSkip}>
                Continue without camera and mic
              </Button>
            </Flex>
          </Card>
        </MaxWidthDiv>
        <Toaster {...toaster} />
      </>
    ) : (null)
  );
}
