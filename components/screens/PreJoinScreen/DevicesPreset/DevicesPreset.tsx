import React, { useEffect, useState } from "react";
import * as Video from "twilio-video";
import {
  Button,
  Flex,
  useToaster,
  Toaster,
  Card,
  Text,
  Stack,
  Switch,
} from "@twilio-paste/core";
import {
  BsCameraVideoFill,
  BsCameraVideoOff,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";
import { MdErrorOutline } from "react-icons/md";

import { UIStep, useVideoStore, VideoAppState } from "../../../../store/store";
import { MaxWidthDiv } from "../../../styled";
import VideoPreview from "../VideoPreview/VideoPreview";
import ConfigureSettings from "../../../ConfigureSettings/ConfigureSettings";
import { SELECTED_VIDEO_INPUT_KEY, TEXT_COPY } from "../../../../lib/constants";
import { useGetToken } from "../../../../lib/api";
import PermissionsWarning from "../PermissionsWarning/PermissionsWarning";
import useMediaStreamTrack from "../../../../lib/hooks/useMediaStreamTrack";

interface DevicesPresetProps {}

export default function DevicesPreset({}: DevicesPresetProps) {
  const toaster = useToaster();
  const { HELP_TEXT_PRELIGHT_FAILED, HELP_TEXT_PRELIGHT_PASSED } = TEXT_COPY;
  const { formData } = useVideoStore((state: VideoAppState) => state);
  const {
    localTracks,
    setLocalTracks,
    clearTrack,
    setActiveRoom,
    setUIStep,
    devicePermissions,
    setDevicePermissions,
  } = useVideoStore((state: VideoAppState) => state);

  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [preflightStatus, setPreflightStatus] = useState("idle");

  const { roomName, identity } = formData;
  const { data, status: tokenStatus } = useGetToken(roomName, identity);
  const [loading, setLoading] = useState(false);

  const localVideo = localTracks.video;
  // Need the MediaStreamTrack to be able to react to (and re-render) on track restarts
  const localMediaStreamTrack = useMediaStreamTrack(localVideo);

  const joinVideoClicked = async () => {
    setLoading(true);
    let tracks = [];

    if (localVideo) {
      tracks.push(localVideo);
    }

    if (localTracks.audio) {
      tracks.push(localTracks.audio);
    }

    if (data.token) {
      Video.connect(data.token, { tracks, dominantSpeaker: true })
        .then((room: Video.Room) => setActiveRoom(room))
        .then(() => setUIStep(UIStep.VIDEO_ROOM))
        .catch((error) => {
          console.log("error", error.message);
          toaster.push({
            message: `Error joining room - ${error.message}`,
            variant: "error",
          });
        });
    }

    setLoading(false);
  };

  function joinButtonText() {
    switch (preflightStatus) {
      case "idle":
        return "Join Room";
      case "loading":
        return "Loading...";
      case "passed":
        return "Join Video Room";
      case "failed":
        return "Unable to join";
    }
  }

  function microphoneToggle() {
    if (micEnabled) {
      // stop the track
      console.log("audio track already setup -- stop the track");
      localTracks.audio?.stop();
      clearTrack("audio");
      setMicEnabled(false);
    } else {
      // either request permission and setup the local track
      // if already created but stopped, start the track
      if (!!localTracks.audio) {
        console.log("audio track setup -- start the track");
        localTracks.audio?.restart();
        setMicEnabled(true);
      } else {
        // no existing track, ask for permissions and setup
        console.log("setup local audio track");
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const audioInput = devices.find(
              (device) => device.kind === "audioinput"
            );
            return Video.createLocalTracks({
              audio: { deviceId: audioInput?.deviceId },
              video: false,
            });
          })
          .then((localTracks) => {
            console.log("localTracks...", localTracks);
            setLocalTracks("audio", localTracks[0]);
            setMicEnabled(true);
            setDevicePermissions("microphone", true);
          })
          .catch((error) => {
            console.log("error", error.message);
            toaster.push({
              message: `Error: ${error.message}`,
              variant: "error",
            });
            setMicEnabled(false);
            setDevicePermissions("microphone", false);
          });
      }
    }
  }

  function cameraToggle() {
    if (camEnabled) {
      // stop the track
      console.log("video track already setup -- stop the track");
      localVideo?.stop();
      clearTrack("video");
      setCamEnabled(false);
    } else {
      // Refresh preferred device ID from local storage
      let localVideoDeviceId = localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);

      // either request permission and setup the local track
      // if already created but stopped, start the track
      if (!!localVideo) {
        console.log("video track setup -- start the track");
        localVideo?.restart();
        setCamEnabled(true);
      } else {
        // no existing track, ask for permissions and setup
        console.log(
          `setup local video track, local preferred device ID is ${localVideoDeviceId}`
        );
        // If we have don't have a device id yet (e.g. from local storage), find one!
        if (!localVideoDeviceId) {
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            const newDeviceId = devices.find(
              (device) => device.kind === "videoinput"
            )?.deviceId;
            console.log(
              `No existing device ID, so found deviceID ${newDeviceId}`
            );
            localVideoDeviceId = newDeviceId ?? null;
          });
        }
        console.log(`DeviceID is ${localVideoDeviceId}`);

        if (localVideoDeviceId) {
          Video.createLocalTracks({
            video: { deviceId: localVideoDeviceId },
            audio: false,
          })
            .then((localTracks) => {
              console.log("localTracks...", localTracks);
              setLocalTracks("video", localTracks[0]);
              setCamEnabled(true);
              setDevicePermissions("camera", true);
            })
            .catch((error) => {
              console.log("error", error.message);
              toaster.push({
                message: `Error: ${error.message}`,
                variant: "error",
              });
              setCamEnabled(false);
              setDevicePermissions("camera", false);
            });
        } else {
          console.log("No video input device id found");
          toaster.push({
            message: `Error: No video device found`,
            variant: "error",
          });
          setCamEnabled(false);
          setDevicePermissions("camera", false);
        }
      }
    }
  }

  // useEffect to run preflight test
  useEffect(() => {
    if (tokenStatus === "success") {
      setPreflightStatus("loading");
      const { token } = data;
      const preflightTest = Video.runPreflight(token);

      preflightTest.on("progress", (progress: any) => {
        console.log("progress ", progress);
      });

      preflightTest.on("completed", (report: any) => {
        console.log("completed", report);
        toaster.push({
          message: "Preflight test passed! 👌",
          variant: "success",
          dismissAfter: 3000,
        });
        setPreflightStatus("passed");
      });

      preflightTest.on("failed", (error: any) => {
        console.log("failed", error);
        toaster.push({
          message: "Preflight test failed 🙁",
          variant: "error",
        });
        setPreflightStatus("failed");
      });
    }
  }, [tokenStatus]);

  return (
    <MaxWidthDiv>
      <Card paddingTop="space60">
        <Stack orientation="vertical" spacing="space40">
          <VideoPreview
            identity={identity ?? "Guest"}
            localVideo={localVideo}
          />
          <Flex hAlignContent={"center"}>
            <Switch
              checked={micEnabled}
              onChange={() => {
                microphoneToggle();
              }}
            >
              {micEnabled ? (
                <BsMicFill
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                    color: "rgb(72, 221, 0)",
                  }}
                />
              ) : (
                <BsMicMuteFill
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "20px",
                    color: "rgb(221, 39, 0)",
                  }}
                />
              )}
            </Switch>
            <Switch
              checked={camEnabled}
              onChange={() => {
                cameraToggle();
              }}
            >
              {camEnabled ? (
                <BsCameraVideoFill
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "rgb(72, 221, 0)",
                  }}
                />
              ) : (
                <BsCameraVideoOff
                  style={{
                    width: "20px",
                    height: "20px",

                    color: "rgb(221, 39, 0)",
                  }}
                />
              )}
            </Switch>
          </Flex>
          {(!devicePermissions.camera || !devicePermissions.microphone) && (
            <PermissionsWarning />
          )}
          <ConfigureSettings />
          <Flex hAlignContent={"center"} width="100%">
            <Stack orientation="vertical" spacing="space30">
              <Flex hAlignContent={"center"} width="100%" marginTop="space30">
                <Button
                  variant="destructive"
                  onClick={async () => await joinVideoClicked()}
                  loading={loading}
                  style={{ background: "#F22F46" }}
                  //disabled={preflightStatus !== "passed"}
                >
                  {joinButtonText()}
                </Button>
              </Flex>
              {preflightStatus !== "failed" ? (
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
                  {HELP_TEXT_PRELIGHT_PASSED}
                </span>
              ) : (
                <Flex marginTop="space20">
                  <MdErrorOutline
                    style={{
                      width: "20px",
                      height: "20px",
                      color: "rgb(221, 39, 0)",
                      marginRight: "10px",
                    }}
                  />
                  <Text as="p" fontSize="fontSize20">
                    {HELP_TEXT_PRELIGHT_FAILED}
                  </Text>
                </Flex>
              )}
            </Stack>
          </Flex>
        </Stack>
      </Card>
      <Toaster {...toaster} />
    </MaxWidthDiv>
  );
}
