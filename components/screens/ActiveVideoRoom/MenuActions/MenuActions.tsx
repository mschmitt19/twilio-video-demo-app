import React from "react";
import {
  useMenuState,
  MenuButton,
  Menu,
  MenuItem,
  MediaBody,
  MediaFigure,
  MediaObject,
  useToaster,
  Toaster,
} from "@twilio-paste/core";
import { FiMoreVertical, FiLink } from "react-icons/fi";

import { useVideoStore, VideoAppState } from "../../../../store/store";

export default function MenuActions() {
  const menu = useMenuState();
  const toaster = useToaster();
  const { formData } = useVideoStore((state: VideoAppState) => state);

  async function generateAndCopyRoomInvite() {
    try {
      const link = `${window.location.href}?roomName=${formData.roomName}`;
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(link);
      }
      toaster.push({
        message: `Invite link copied to clipboard!`,
        variant: "success",
        dismissAfter: 3000,
      });
    } catch (e) {
      console.log("error", e);
      toaster.push({
        message: `Error copying invite link`,
        variant: "error",
      });
    }
    menu.hide();
  }

  return (
    <>
      <MenuButton {...menu} variant="reset" size="reset">
        <FiMoreVertical
          style={{ width: "20px", height: "20px", marginTop: "5px" }}
        />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <MenuItem
          {...menu}
          onClick={(e) => {
            generateAndCopyRoomInvite();
          }}
        >
          <MediaObject verticalAlign="center">
            <MediaBody>Copy Invite Link</MediaBody>
            <MediaFigure spacing="space20">
              <FiLink style={{ width: "12px", height: "12px" }} />
            </MediaFigure>
          </MediaObject>
        </MenuItem>
      </Menu>
      <Toaster {...toaster} />
    </>
  );
}
