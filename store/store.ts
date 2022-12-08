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

export interface VideoAppState {
  room: any;
  status: RoomStatus;
  uiStep: UIStep;
  formData: LandingPageFormData;
  setFormData: (data: LandingPageFormData) => void;
  setUIStep: (step: UIStep) => void;
  setActiveRoom: (room: any) => void;
  clearActiveRoom: () => void;
}

export const useVideoStore = create<VideoAppState>()((set) => ({
  room: null,
  status: RoomStatus.NOT_CONNECTED,
  uiStep: UIStep.LANDING_SCREEN,
  formData: {
    identity: undefined,
    roomName: undefined,
  },
  setFormData: (data: LandingPageFormData) => set({ formData: data }),
  setUIStep: (step: UIStep) => set({ uiStep: step }),
  setActiveRoom: (activeRoom: any) => set({ room: activeRoom }),
  clearActiveRoom: () => set({ room: null }),
}));
