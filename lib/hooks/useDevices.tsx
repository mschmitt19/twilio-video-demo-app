import { useState, useEffect } from "react";
import { getDeviceInfo } from "../utils/devices";

// This returns the type of the value that is returned by a promise resolution
type ThenArg<T> = T extends PromiseLike<infer U> ? U : never;

export default function useDevices() {
  const [deviceInfo, setDeviceInfo] = useState<
    ThenArg<ReturnType<typeof getDeviceInfo>>
  >({
    audioInputDevices: [],
    videoInputDevices: [],
    audioOutputDevices: [],
    hasAudioInputDevices: false,
    hasVideoInputDevices: false,
    isMicPermissionGranted: false,
    isCameraPermissionGranted: false
  });

  useEffect(() => {
    const getDevices = () =>
      getDeviceInfo().then((devices: any) => setDeviceInfo(devices));
    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, []);

  return deviceInfo;
}
