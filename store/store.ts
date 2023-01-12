import * as Video from "twilio-video";
import create from "zustand";

enum RoomStatus {
  NOT_CONNECTED = "NOT_CONNECTED",
  CONNECTED = "CONNECTED",
}

export enum UIStep {
  LANDING_SCREEN = "LANDING_SCREEN",
  PRE_JOIN_SCREEN = "PRE_JOIN_SCREEN",
  VIDEO_ROOM = "VIDEO_ROOM",
  VIDEO_ROOM_DISCONNECT = "VIDEO_ROOM_DISCONNECT",
}

interface LandingPageFormData {
  identity: undefined | string;
  roomName: undefined | string;
}

interface LocalTracks {
  audio: Video.LocalAudioTrack | undefined;
  video: Video.LocalVideoTrack | undefined;
  screen: Video.LocalVideoTrack | undefined;
  data: Video.LocalDataTrack | undefined;
}

export interface VideoAppState {
  room: Video.Room | null;
  status: RoomStatus;
  uiStep: UIStep;
  formData: LandingPageFormData;
  hasSkippedPermissionCheck: boolean;
  hasPassedPermissionCheck: boolean;
  localTracks: LocalTracks;
  setFormData: (data: LandingPageFormData) => void;
  setUIStep: (step: UIStep) => void;
  setActiveRoom: (room: Video.Room) => void;
  clearActiveRoom: () => void;
  setHasSkippedPermissionCheck: (hasSkipped : boolean) => void;
  setHasPassedPermissionCheck: (hasPassed : boolean) => void;
  setLocalTracks: (
    type: "audio" | "video" | "screen",
    track: Video.LocalAudioTrack | Video.LocalVideoTrack | Video.LocalDataTrack
  ) => void;
  clearTrack: (type: "audio" | "video" | "screen") => void;
  resetState: () => void;
}  


export const useVideoStore = create<VideoAppState>()((set, get) => ({
  room: null,
  status: RoomStatus.NOT_CONNECTED,
  uiStep: UIStep.LANDING_SCREEN,
  formData: {
    identity: undefined,
    roomName: undefined,
  },
  hasSkippedPermissionCheck: false, 
  hasPassedPermissionCheck: false,
  localTracks: {
    audio: undefined,
    video: undefined,
    screen: undefined,
    data: undefined,
  },
  setHasSkippedPermissionCheck: (hasSkipped: boolean) => set({ hasSkippedPermissionCheck: hasSkipped }),
  setHasPassedPermissionCheck: (hasPassed: boolean) => set({ hasPassedPermissionCheck: hasPassed }),

  setLocalTracks: (type, track: any) => {
    const currentTracks = get().localTracks;
    if (type === "audio") {
      set({ localTracks: { ...currentTracks, audio: track } });
    }
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: track } });
    }
    if (type === "screen") {
      set({ localTracks: { ...currentTracks, screen: track } });
    }
  },
  clearTrack: (type) => {
    const currentTracks = get().localTracks;
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: undefined } });
    }
    if (type === "audio") {
      set({ localTracks: { ...currentTracks, audio: undefined } });
    }
    if (type === "screen") {
      set({ localTracks: { ...currentTracks, screen: undefined } });
    }
  },
  setFormData: (data: LandingPageFormData) => set({ formData: data }),
  setUIStep: (step: UIStep) => set({ uiStep: step }),
  setActiveRoom: (activeRoom: Video.Room) => set({ room: activeRoom }),
  clearActiveRoom: () =>
    set({
      room: null,
      localTracks: {
        audio: undefined,
        video: undefined,
        screen: undefined,
        data: undefined,
      },
    }),
  resetState: () => {
    set({
      room: null,
      status: RoomStatus.NOT_CONNECTED,
      uiStep: UIStep.LANDING_SCREEN,
      formData: {
        identity: undefined,
        roomName: undefined,
      },
    });
  },
}));
