import React, { useState } from "react";
import { Tooltip, Button } from "@twilio-paste/core";
import { TbScreenShare, TbScreenShareOff } from "react-icons/tb";

export default function ToggleScreenshare() {
  const [isSharing, setIsSharing] = useState(false);

  const toggleScreenshare = () => {
    console.log("TODO: implement screenshare");
    setIsSharing(!isSharing);
  };

  return (
    <Tooltip text={isSharing ? "Stop sharing" : "Share screen"} placement="top">
      <Button
        variant={!isSharing ? "primary" : "destructive"}
        size="circle"
        onClick={toggleScreenshare}
      >
        {!isSharing ? (
          <TbScreenShare style={{ width: "25px", height: "25px" }} />
        ) : (
          <TbScreenShareOff style={{ width: "25px", height: "25px" }} />
        )}
      </Button>
    </Tooltip>
  );
}
