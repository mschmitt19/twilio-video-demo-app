import { styled, css } from "@twilio-paste/styling-library";

export const CenterContent = styled.div(
  css({
    paddingX: "space40",
    paddingTop: "space200",
    paddingBottom: "space60",
    width: "100%",
    minHeight: "100vh",
    justifyContent: "center",
    flexDirection: "column",
    //backgroundColor: "colorBackground",
    backgroundColor: "rgb(45, 46, 45)",
    alignItems: "center",
    alignContent: "center",
    horizontalAlign: "center",
  })
);

export const OverlayContent = styled.div(
  css({
    bottom: 40,
    opacity: 0.8,
    padding: "space20",
    backgroundColor: "#000000",
    zIndex: 100,
  })
);

export const VideoDivContainer = styled.div(
  css({
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    testAlign: "center",
    position: "relative",
    top: 0,
    left: 0,
    backgroundColor: "colorBackgroundPrimary",
    minHeight: "100%",
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

export const taskContainerStyle = {
  display: "flex",
  justifyContext: "space-between",
  paddingLeft: 0,
  width: "100%",
  borderLeft: "1px solid rgb(198, 202, 215)",
  backgroundColor: "rgb(251, 251, 252)",
};

export const mediaTrackContainer = {
  width: "100%",
  justifyContent: "center",
  alignContent: "center",
  testAlign: "center",
};

export const MaxWidthDiv = styled.div(
  css({
    maxWidth: "500px",
    marginTop: "space40",
    minWidth: "300px",
    justifyContent: "center",
  })
);
