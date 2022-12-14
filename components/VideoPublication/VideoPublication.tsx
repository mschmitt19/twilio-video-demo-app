import React from "react";
import {
  LocalVideoTrack,
  LocalVideoTrackPublication,
  VideoTrackPublication,
} from "twilio-video";
import { RxAvatar } from "react-icons/rx";
import { Text } from "@twilio-paste/core";

import {
  AvatarContainer,
  InnerPreviewContainer,
  VideoPreviewContainer,
  OverlayContent,
} from "../styled";
import VideoTrack from "../VideoTrack/VideoTrack";

interface VideoPublicationProps {
  identity?: string;
  localVideo?: LocalVideoTrackPublication | VideoTrackPublication;
}

export default function VideoPublication({
  identity,
  localVideo,
}: VideoPublicationProps) {
  return (
    <VideoPreviewContainer>
      <InnerPreviewContainer>
        {!!localVideo && localVideo.isTrackEnabled ? (
          <VideoTrack track={localVideo.track} isLocal />
        ) : (
          <AvatarContainer>
            <RxAvatar
              style={{ width: "50px", height: "50px", color: "#FFFFFF" }}
            />
          </AvatarContainer>
        )}
      </InnerPreviewContainer>
      <OverlayContent>
        <Text as="p" color="colorText" fontSize="fontSize10">
          {identity} (You)
        </Text>
      </OverlayContent>
    </VideoPreviewContainer>
  );
}
