import { styled, css } from "@twilio-paste/styling-library";

export const VideoContainer = styled.video(
  css({
    width: "100%",
    height: "100%",
  })
);

export const AvatarContainer = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  })
);

export const VideoPreviewContainer = styled.div(
  css({
    position: "relative",
    height: 0,
    overflow: "hidden",
    paddingTop: `${(9 / 16) * 100}%`,
    width: "100%",
    borderRadius: "6px",
  })
);

export const InnerPreviewContainer = styled.div(
  css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  })
);

export const CenterContent = styled.div(
  css({
    paddingX: "space40",
    paddingTop: "space200",
    paddingBottom: "space60",
    width: "100%",
    minHeight: "100vh",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "rgb(45, 46, 45)",
    alignItems: "center",
    alignContent: "center",
    horizontalAlign: "center",
  })
);

export const OverlayContent = styled.div(
  css({
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
    padding: "space20",
    backgroundColor: "#FFFFFF",
    zIndex: 100,
    borderRadius: "0px 6px 0px 0px",
  })
);

export const ParticipantContainer = styled.div(
  css({
    width: "100%",
    height: "calc(100vh - 80px)",
    padding: "space60",
    position: "absolute",
    top: "0px",
  })
);

export const ActiveVideoRoomContainer = styled.div(
  css({
    width: "100%",
    height: "100vh",
    position: "relative",
    backgroundColor: "rgb(45, 46, 45)",
  })
);

export const FooterDiv = styled.div(
  css({
    width: "100%",
    height: "80px",
    position: "absolute",
    bottom: "0px",
    backgroundColor: "rgb(0, 0, 0)",
  })
);

export const MaxWidthDiv = styled.div(
  css({
    maxWidth: "500px",
    marginTop: "space40",
    minWidth: "300px",
    justifyContent: "center",
  })
);
