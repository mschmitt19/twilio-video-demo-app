import React from "react";
import { LocalVideoTrack } from "twilio-video";
import { RxAvatar } from "react-icons/rx";
import { Text } from "@twilio-paste/core";

import {
  AvatarContainer,
  InnerPreviewContainer,
  VideoPreviewContainer,
  OverlayContent,
} from "../styled";
import VideoTrack from "../VideoTrack/VideoTrack";

interface VideoPreviewProps {
  identity?: string;
  localVideo?: LocalVideoTrack;
}

export default function VideoPreview({
  identity,
  localVideo,
}: VideoPreviewProps) {
  return (
    <VideoPreviewContainer>
      <InnerPreviewContainer>
        {!!localVideo && !localVideo.isStopped ? (
          <VideoTrack track={localVideo} isPreview />
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
