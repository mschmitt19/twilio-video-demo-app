import React, { useState } from "react";
import * as Video from "twilio-video";
import { Card, Flex, Button, Stack, Switch } from "@twilio-paste/core";
import {
  BsCameraVideoFill,
  BsCameraVideoOff,
  BsMicFill,
  BsMicMuteFill,
} from "react-icons/bs";

import { useGetToken } from "../../lib/api";
import { UIStep, useVideoStore, VideoAppState } from "../../store/store";
import { CenterContent, MaxWidthDiv } from "../styled";
import TwilioHeading from "../TwilioHeading/TwilioHeading";
import VideoPreview from "../VideoPreview/VideoPreview";
import ConfigureSettings from "../ConfigureSettings/ConfigureSettings";

export default function PreJoinScreen({}) {
  const formData = useVideoStore((state: VideoAppState) => state.formData);
  const localTracks = useVideoStore(
    (state: VideoAppState) => state.localTracks
  );
  const setLocalTracks = useVideoStore(
    (state: VideoAppState) => state.setLocalTracks
  );
  const clearTrack = useVideoStore((state: VideoAppState) => state.clearTrack);
  const setActiveRoom = useVideoStore(
    (state: VideoAppState) => state.setActiveRoom
  );
  const setUIStep = useVideoStore((state: VideoAppState) => state.setUIStep);

  const [micEnabled, setMicEnabled] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);

  const { roomName, identity } = formData;
  const { data } = useGetToken(roomName, identity);
  const [loading, setLoading] = useState(false);

  const joinVideoClicked = async () => {
    setLoading(true);
    let tracks = [];

    if (localTracks.video) {
      tracks.push(localTracks.video);
    }

    if (localTracks.audio) {
      tracks.push(localTracks.audio);
    }

    if (data.token) {
      Video.connect(data.token, { tracks })
        .then((room: Video.Room) => setActiveRoom(room))
        .then(() => setUIStep(UIStep.VIDEO_ROOM));
    }

    setLoading(false);
  };

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
          })
          .catch((error) => {
            console.log("error", error);
            setMicEnabled(false);
          });
      }
    }
  }

  function cameraToggle() {
    if (camEnabled) {
      // stop the track
      console.log("video track already setup -- stop the track");
      localTracks.video?.stop();
      clearTrack("video");
      setCamEnabled(false);
    } else {
      // either request permission and setup the local track
      // if already created but stopped, start the track
      if (!!localTracks.video) {
        console.log("video track setup -- start the track");
        localTracks.video?.restart();
        setCamEnabled(true);
      } else {
        // no existing track, ask for permissions and setup
        console.log("setup local audio track");
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            const videoInput = devices.find(
              (device) => device.kind === "videoinput"
            );
            return Video.createLocalTracks({
              video: { deviceId: videoInput?.deviceId },
              audio: false,
            });
          })
          .then((localTracks) => {
            console.log("localTracks...", localTracks);
            setLocalTracks("video", localTracks[0]);
            setCamEnabled(true);
          })
          .catch((error) => {
            console.log("error", error);
            setCamEnabled(false);
          });
      }
    }
  }

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
          <Card paddingTop="space60">
            <Stack orientation="vertical" spacing="space40">
              <VideoPreview
                identity={identity}
                localVideo={localTracks.video}
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
              <ConfigureSettings />
              <Flex hAlignContent={"center"} width="100%">
                <Stack orientation="vertical" spacing="space30">
                  <Flex
                    hAlignContent={"center"}
                    width="100%"
                    marginTop="space30"
                  >
                    <Button
                      variant="destructive"
                      onClick={async () => await joinVideoClicked()}
                      loading={loading}
                      style={{ background: "#F22F46" }}
                    >
                      Join Video Room
                    </Button>
                  </Flex>

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
              </Flex>
            </Stack>
          </Card>
        </MaxWidthDiv>
      </Flex>
    </CenterContent>
  );
}
