import React from "react";

import BrowserSupport from "../BrowserSupport/BrowserSupport";
import LandingScreen from "../LandingScreen/LandingScreen";
import PreJoinScreen from "../PreJoinScreen/PreJoinScreen";
import ActiveVideoRoom from "../ActiveVideoRoom/ActiveVideoRoom";
import { UIStep, useVideoStore, VideoAppState } from "../../store/store";
import PostVideoRoom from "../PostVideoRoom/PostVideoRoom";

export default function VideoProvider() {
  const uiStep = useVideoStore((state: VideoAppState) => state.uiStep);

  function determineCurrentUI() {
    switch (uiStep) {
      case UIStep.LANDING_SCREEN:
        return <LandingScreen />;
      case UIStep.PRE_JOIN_SCREEN:
        return <PreJoinScreen />;
      case UIStep.VIDEO_ROOM:
        return <ActiveVideoRoom />;
      case UIStep.VIDEO_ROOM_DISCONNECT:
        return <PostVideoRoom />;
      default:
        return <LandingScreen />;
    }
  }

  return <BrowserSupport>{determineCurrentUI()}</BrowserSupport>;
}
