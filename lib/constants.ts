export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints["video"] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = "TwilioVideoApp-selectedAudioInput";
export const SELECTED_AUDIO_OUTPUT_KEY = "TwilioVideoApp-selectedAudioOutput";
export const SELECTED_VIDEO_INPUT_KEY = "TwilioVideoApp-selectedVideoInput";

// This is used to store the current background settings in localStorage
export const SELECTED_BACKGROUND_SETTINGS_KEY =
  "TwilioVideoApp-selectedBackgroundSettings";

export const GALLERY_VIEW_ASPECT_RATIO = 9 / 16; // 16:9
export const GALLERY_VIEW_MARGIN = 4;

export const ROOM_ISSUES_FEEDBACK_OPTIONS = [
  "Couldn't hear",
  "Others couldn't hear",
  "Video was low quality",
  "Video froze or was choppy",
  "Couldn't see participants",
  "Sound didn't match video",
  "Participants couldn't see me",
  "Other issue",
];
