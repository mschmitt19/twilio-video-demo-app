// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function isPermissionDenied(name: "camera" | "microphone") {
  const permissionName = name as PermissionName; // workaround for https://github.com/microsoft/TypeScript/issues/33923

  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({
        name: permissionName,
      });
      return result.state === "denied";
    } catch {
      return false;
    }
  } else {
    return false;
  }
}

export async function getDeviceInfo() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    audioInputDevices: devices.filter((device) => device.kind === "audioinput"),
    videoInputDevices: devices.filter((device) => device.kind === "videoinput"),
    audioOutputDevices: devices.filter(
      (device) => device.kind === "audiooutput"
    ),
    hasAudioInputDevices: devices.some(
      (device) => device.kind === "audioinput"
    ),
    hasVideoInputDevices: devices.some(
      (device) => device.kind === "videoinput"
    ),
  };
}

export const isMobile = (() => {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.userAgent !== "string"
  ) {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

/*
  Track-related helper functions
*/

// Attach the Local Tracks to the DOM.
export function attachLocalTracks(tracks: any, divId: string) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    let trackDom = track.attach();
    trackDom.style.maxWidth = "100%";
    trackDom.style["height"] = "100%";
    //trackDom.style["max-height"] = "100%";
    document.getElementById(divId)?.appendChild(trackDom);
  });
}

// Attach the Remote Tracks to the DOM.
export function attachRemoteTracks(tracks: any, divId: string) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    if (!track.attach) return;
    let trackDom = track.attach();
    trackDom.style.width = "100%";
    //trackDom.style["max-height"] = "100%";
    //trackDom.style["height"] = "200px";
    trackDom.style["height"] = "100%";
    document.getElementById(divId)?.appendChild(trackDom);
  });
}

// Detach tracks from the DOM.
export function detachTracks(tracks: any) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    if (!track.detach) return;
    track.detach().forEach(function (detachedElement: any) {
      detachedElement.remove();
    });
  });
}
