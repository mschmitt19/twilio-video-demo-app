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
  localTracks: LocalTracks;
  setFormData: (data: LandingPageFormData) => void;
  setUIStep: (step: UIStep) => void;
  setActiveRoom: (room: any) => void;
  clearActiveRoom: () => void;
  setLocalTracks: (type: "audio" | "video" | "screen", track: any) => void;
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
  localTracks: {
    audio: undefined,
    video: undefined,
    screen: undefined,
    data: undefined,
  },
  setLocalTracks: (type: "audio" | "video" | "screen", track: any) => {
    const currentTracks = get().localTracks;
    if (type === "audio") {
      set({ localTracks: { ...currentTracks, audio: track } });
    }
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: track } });
    }
  },
  clearTrack: (type: "audio" | "video" | "screen") => {
    const currentTracks = get().localTracks;
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: undefined } });
    }
  },
  setFormData: (data: LandingPageFormData) => set({ formData: data }),
  setUIStep: (step: UIStep) => set({ uiStep: step }),
  setActiveRoom: (activeRoom: any) => set({ room: activeRoom }),
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
